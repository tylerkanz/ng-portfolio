# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`ng-portfolio` is Tyler Kanz's personal portfolio site — Angular 19, standalone components (no
NgModules), deployed as a single Cloudflare Worker that serves the built SPA and handles a
`/api/contact` endpoint backed by Resend + Cloudflare Turnstile. This was a ground-up rebuild from
an earlier Angular 14/NgModule version, executed per `PLAN.md`, mirroring conventions from a
sibling project (`kanz-frontend`/`kanz-infotech`).

**Still outstanding** (see `PLAN.md`'s execution order, step 7): creating the real Turnstile
widget + Resend sender in their dashboards, setting Worker secrets, and a live end-to-end send
test post-deploy. Until that's done, `environment.ts`/`environment.prod.ts`'s `turnstileSiteKey`
is empty (widget stays disabled) and the Worker's mailer/Turnstile verification run in their
fail-open mode (see Architecture below).

## Commands

```
npm start            # ng serve — dev server at http://localhost:4200, auto-reloads
npm run build         # ng build — production build to dist/ (assets land in dist/browser)
npm run watch         # ng build --watch --configuration development
npm test               # ng test — Karma/Jasmine unit tests (launches Chrome)
npm run worker:dev     # wrangler dev — serves the last `ng build` output + /api/contact locally
npm run deploy         # ng build --configuration production && wrangler deploy
```

To run a single spec file, pass Karma's `--include` via the Angular CLI, e.g.:
`ng test --include='**/app.component.spec.ts'`

There is no e2e test setup and no lint script configured in `package.json`.

## Architecture

Standalone Angular 19 app, bootstrapped via `bootstrapApplication(AppComponent, appConfig)` in
`src/main.ts`. `src/app/app.config.ts` is the single source of providers (zone change detection,
router with `withInMemoryScrolling`, `provideHttpClient()`) — don't split provider registration
into `main.ts` the way some sibling projects do.

- **`app.routes.ts`** declares three flat routes: `''` → `HomeComponent`, `'skills'` →
  `SkillsComponent`, `'contact'` → `ContactComponent`. No lazy loading — the app is small enough
  that it isn't worth it.
- **`SkillsComponent`** (`components/skills/`) is a single consolidated page with one section per
  skill area (Web Apps, Mobile Apps, APIs, Cloud Architecture), rendered from the typed
  `SKILL_AREAS` array in `data/skills.data.ts` via `@for`. Nav links route to `/skills` with a
  `fragment` (`web-apps`, `mobile-apps`, etc.) for anchor scrolling — there are no per-skill
  routes/components anymore. To add or edit a skill area, edit `data/skills.data.ts` only.
- **`AppComponent`** (`app.component.ts`/`.html`) owns the persistent nav bar (desktop dropdown +
  collapsible mobile menu, both hardcoded lists of the same skill fragments plus Contact — update
  both when adding/removing a skills section or top-level route) and the `<router-outlet>`. Route
  transition animations were dropped in the rebuild (no `route-animations.ts` equivalent).
- **`ContactComponent`** (`components/contact/`) posts to `ContactService.submitMessage()`, which
  `POST`s `{ data: {...} }` to the relative path `/api/contact` (same-origin — the Worker serves
  both the SPA and the API, no CORS needed). It ports the honeypot field (`website`, hidden via
  CSS, silently accepted if filled) and the Cloudflare Turnstile explicit-render pattern from
  `kanz-frontend`: the widget is rendered manually in `ngAfterViewInit` (retrying until the
  `turnstile` global loads, since `index.html`'s script tag uses `render=explicit`), and reset
  after each submit attempt since tokens are single-use.
- Icons come from `@fortawesome/angular-fontawesome` (`free-brands-svg-icons` for GitHub/LinkedIn,
  `free-solid-svg-icons` for the contact page's email/database icons) — `@ng-icons/*` was dropped.
  Tech-stack logos (Angular, React, AWS, etc.) are still plain SVGs under `src/assets/svg`, not
  FontAwesome, since they're brand marks FontAwesome's free tier doesn't cover.
- `@ng-bootstrap/ng-bootstrap` supplies nav collapse, dropdown, tooltip, popover, and the
  portfolio carousel (`ngb-carousel` in `home.component.html`).
- Per-icon stagger animations use hand-rolled CSS in `src/styles.scss`: `.fade-in`/`.fade-in-down`/
  `.fade-in-right` keyframe classes combined with `.icon-1`…`.icon-10` classes that set a
  `--stagger-delay` custom property — this replaced `animate.css` (dropped in the rebuild) and is
  reused wherever a row of tech icons animates in (home hero, skills sections).
- Bootstrap is imported and themed via SCSS variable overrides (`$primary`, `$body-color`,
  `$font-family-sans-serif` = Manrope, `$headings-font-family` = JetBrains Mono, etc.) at the top of
  `src/styles.scss`, before `@import "bootstrap"` — new theme colors go there, not in component
  styles. A `--accent-neon` CSS custom property (green, distinct from `kanz-frontend`'s cyan) is
  used for hover/focus accents (see `contact.component.scss`, `.logo-bunch-group:hover`).
- Static assets (tech-stack SVGs, portfolio screenshots) live under `src/assets/svg` and
  `src/assets/image/portfolio`, referenced by relative path (`assets/svg/...`) directly in
  templates or via `data/skills.data.ts` — `angular.json`'s asset glob maps `src/assets` to an
  `assets/` output dir, matching the old Angular 14 layout so these paths didn't need to change.

## Cloudflare Worker (`worker/index.ts`)

Single Worker, configured in `wrangler.jsonc`, that both serves the built SPA (`env.ASSETS.fetch`,
static assets from `dist/browser`, SPA-fallback via `not_found_handling`) and handles
`POST /api/contact`:

- Rate limiting: Cloudflare's native Workers Rate Limiting binding (`CONTACT_RATE_LIMITER`,
  configured under `wrangler.jsonc`'s `unsafe.bindings` with `type: "ratelimit"` — the plain
  top-level `ratelimit`/`ratelimits` key does **not** work with the installed wrangler version;
  verified against `node_modules/wrangler`'s source), 5 requests/60s keyed by `CF-Connecting-IP`.
  No KV/Durable Object needed.
- Honeypot check (`website` field) short-circuits before Turnstile verification or email, and
  returns a fake success so bots don't learn to avoid the field.
- `verifyTurnstile()` and `sendEmail()`/`sendAdminNotification()` are ported from
  `kanz-backend`'s `turnstile.ts`/`mailer.ts` — same fail-open-when-unconfigured pattern, just
  reading Worker `env` bindings instead of `process.env`. Both are plain `fetch`-based, no SDKs.
  The admin notification email is fired via `ctx.waitUntil()` so it doesn't block the response.
- Secrets (`RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY`) are
  set via `wrangler secret put <NAME>` — not committed, not present in `wrangler.jsonc`.
- `worker/tsconfig.json` is a standalone tsconfig (`types: ["@cloudflare/workers-types"]`) for
  editor support only — it's outside `src/`, so Angular's own tsconfigs never include it, and
  `wrangler dev`/`deploy` transpile the worker themselves without reading it.

## CI/CD

`.github/workflows/ci-cd.yml`: one `test` job (`ng test` headless, `ng build --configuration
production`, uploads `dist/` as an artifact) and one `deploy` job (`cloudflare/wrangler-action@v4`)
gated on push to `master`. Needs repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
the deploy step no-ops with a log message if they're unset.

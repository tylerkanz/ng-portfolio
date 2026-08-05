# Rebuild ng-portfolio on the kanz-frontend stack

## Context

`ng-portfolio` is Tyler's personal portfolio site: Angular **14**, NgModules,
`@ng-bootstrap/ng-bootstrap` 13, `@ng-icons/typicons`, `animate.css`, Karma tests, no contact
form, deployed... nowhere currently configured (no CI/CD, no wrangler config). It has 4 pages
worth of content (Home w/ hero + portfolio carousel, and 4 "Skills" sub-pages: Web Apps, Mobile
Apps, APIs, Cloud Architecture) and ~2.7MB of SVG tech-icons + portfolio screenshots in
`src/assets`.

The goal: bring it up to the same technology baseline as `kanz-frontend` (in the
`kanz-infotech` repo: Angular 19 standalone components, Bootstrap 5,
`@fortawesome/angular-fontawesome`, `@ng-bootstrap` 18), refresh the design/components while
doing it, and add a contact form. Unlike kanz-frontend, this site doesn't need accounts,
quotes, or an admin dashboard — so instead of a second Express+SQLite backend, the contact
form's "backend" is a small Cloudflare Worker fetch handler that calls Resend directly and
serves the static Angular build, deployed as a single Worker (same pattern kanz-frontend
already uses per `kanz-infotech/wrangler.jsonc` / `.github/workflows/ci-cd.yml`, minus the
separate backend job).

## Approach: rebuild in place, don't incrementally `ng update`

Angular 14 → 19 is 5 majors, several of which (17, 19) come with build-system and control-flow
changes. Given a full refactor + design pass is wanted anyway, scaffolding a fresh Angular 19
standalone app (`ng new` with the same options kanz-frontend used: SCSS, no SSR) and porting
content over component-by-component is less risky than 5 sequential `ng update` runs through an
old ng-bootstrap/ng-icons stack, and it's the only way to end up with standalone components
(the migration schematic exists but the result on 8-year-old NgModule code is messier than a
clean port of ~10 small components).

This happens **in the existing `ng-portfolio` repo** (git history preserved), not a new repo:
old `src/` gets replaced, `src/assets` (SVGs, portfolio screenshots) carries over as-is.

## Target structure (mirrors kanz-frontend conventions)

```
src/app/
├── components/
│   ├── home/           # hero + portfolio carousel (NgbCarouselModule, kept)
│   ├── skills/          # consolidated single page, anchor sections per skill area
│   │                     # (Web Apps / Mobile Apps / APIs / Cloud Architecture) instead of
│   │                     # 4 separate routed sub-pages — same content, fewer routes/components
│   │                     # to maintain for what is a short paragraph + icon row each
│   └── contact/         # new — modeled directly on kanz-frontend's contact.component.*
├── services/
│   └── contact/contact.service.ts   # POSTs {data: {...}} to /api/contact, same shape as
│                                      # kanz-frontend's contact.service.ts
├── data/                 # skill-area content (icons, descriptions) as a typed const array,
│                          # same pattern as kanz-frontend's data/solutions.data.ts
├── app.routes.ts         # '', 'skills', 'contact'
└── app.config.ts
```

Dependencies (matching kanz-frontend's versions exactly): `@angular/*@^19.1.0`,
`@ng-bootstrap/ng-bootstrap@^18.0.0` (kept — nav collapse/dropdown, tooltip/popover, carousel
all still needed), `bootstrap@^5.3.3`, `@fortawesome/angular-fontawesome@^1.0.0` +
`free-brands-svg-icons`/`free-solid-svg-icons`. **Dropped**: `@ng-icons/*` (replaced by
FontAwesome brand icons for GitHub/LinkedIn, matching kanz-frontend), `animate.css` and its
per-element `.icon-1`...`.icon-10` delay classes (replaced with a simpler CSS stagger or
dropped — this hand-rolled-per-icon animation delay system is exactly the kind of thing a design
refresh should clean up). Route animations (`route-animations.ts`, the slide transitions) are
optional to carry forward — recommend dropping them too, since kanz-frontend doesn't use
route-level animation and it simplifies the standalone routing config.

## Design

Keep it recognizably Tyler's own personal-brand site, not a reskin into Kanz InfoTech's Azure
Cipher palette — same execution quality (Space Grotesk/Inter, consistent card/section rhythm,
dark theme) but its own accent color so the two sites don't look like the same business. Default
to a distinct accent (e.g. keeping something in the current site's cool-gray/neon family rather
than kanz-frontend's cyan) unless matching kanz-frontend's palette exactly is preferred — easy
to change once components exist since colors live in a handful of SCSS variables.

## Contact form + Resend, no Express backend

**Frontend**: `contact.component.ts`/`.html` ported near-verbatim from kanz-frontend's
(`kanz-frontend/src/app/components/contact/contact.component.ts`) — same honeypot field, same
explicit Turnstile rendering fix shipped there (`turnstile.render()` in `AfterViewInit`,
`getResponse()`/`reset()`), same `{data: {...}}` POST shape. `environment.ts` gets a
`turnstileSiteKey` (new Cloudflare Turnstile widget, separate from kanz's) the same way.

**"Backend"**: a single `worker/index.ts` Cloudflare Worker fetch handler, added to this repo,
that:
- Intercepts `POST /api/contact`, otherwise falls through to `env.ASSETS.fetch(request)` to
  serve the Angular SPA (Workers-with-assets pattern — same `assets.directory` mechanism as
  kanz-frontend's `wrangler.jsonc`, plus a `main` entry this time)
- Ports the exact logic from `kanz-backend/src/mailer.ts` (`sendEmail`) and
  `kanz-backend/src/turnstile.ts` (`verifyTurnstile`) — same fail-open-when-unconfigured
  pattern, same Resend HTTP API call — just reading from Worker `env` bindings instead of
  `process.env`
- Honeypot check identical to `kanz-backend/src/routes/contact.routes.ts`
- Rate limiting via Cloudflare's native Workers Rate Limiting binding (`ratelimit` in
  `wrangler.jsonc`, 5 req / 15 min, keyed by IP) instead of `express-rate-limit` — no KV/Durable
  Object needed, matches "lean on Cloudflare primitives" instead of hand-rolling what a full
  backend would do
- No CORS handling needed (same-origin: the Worker serves both the SPA and `/api/contact`)

Secrets (`RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY`) set
via `wrangler secret put` / the Cloudflare dashboard, not committed — same as kanz-backend's
`.env` pattern conceptually, just Workers secrets instead of an `.env` file.

## Deployment / CI-CD

New `wrangler.jsonc`:
```jsonc
{
  "name": "ng-portfolio",
  "compatibility_date": "<today>",
  "main": "worker/index.ts",
  "assets": { "directory": "dist/browser", "not_found_handling": "single-page-application", "binding": "ASSETS" },
  "ratelimit": [{ "binding": "CONTACT_RATE_LIMITER", "namespace_id": "1001", "simple": { "limit": 5, "period": 60 } }]
}
```
New `.github/workflows/ci-cd.yml`, trimmed down from kanz-infotech's — one `test` job (`ng
test`, `ng build --configuration production`) and one `deploy` job (`wrangler deploy`) on push
to master. No backend job, no Coolify webhook. Needs new repo secrets:
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Execution order

1. Scaffold new Angular 19 standalone app in place (`ng new`), copy `src/assets` over unchanged
2. Port Home (hero + carousel) as a standalone component
3. Port Skills content into the consolidated Skills page
4. Build Contact page (component + service + environment turnstile key)
5. Add `worker/index.ts` (mailer + turnstile + honeypot + rate limit, ported from kanz-backend)
6. `wrangler.jsonc` + trimmed CI/CD workflow
7. Manual pass: create the Turnstile widget + Resend sender in their respective dashboards,
   set Worker secrets, do a live end-to-end send test (same browser-based verification approach
   used to confirm the kanz-frontend Turnstile fix)

## Verification

- `ng build --configuration production` succeeds with no template/type errors
- `ng test` (Karma) passes for whatever component specs are carried over/added
- `npx wrangler dev` locally serves the SPA and exercises `/api/contact` against the Worker
  fetch handler (with `RESEND_API_KEY` unset, confirming the fail-open path logs a warning and
  still accepts the submission, same as kanz-backend's mailer/turnstile behavior)
- Live browser check post-deploy: load the deployed Worker URL, confirm the Turnstile widget
  renders on page load (not just on manual `turnstile.render()`), submit the form, confirm the
  email arrives via Resend

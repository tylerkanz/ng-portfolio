# ng-portfolio

Tyler Kanz's personal portfolio site. Angular 19 standalone components, deployed as a single
Cloudflare Worker that serves the built SPA and handles the `/api/contact` endpoint.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Cloudflare Worker (contact form backend)

The `/api/contact` endpoint and static asset serving are both handled by `worker/index.ts`. To run
it locally against a production build:

```bash
ng build --configuration production
npm run worker:dev
```

`RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, and `TURNSTILE_SECRET_KEY` are read from
Worker secrets (`wrangler secret put <NAME>`) — when unset, email sending and Turnstile
verification both fail open (the submission still succeeds, a warning is logged).

To build and deploy:

```bash
npm run deploy
```

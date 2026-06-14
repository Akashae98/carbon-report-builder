# Local Setup

## Requirements

- Node.js compatible with the version declared by the project
- npm

## Install and run

```bash
npm install
npm run dev
```

The application is available at `http://localhost:3000` by default.

Useful verification commands:

```bash
npm run lint
npm run test
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and adjust the values for the persistence
mode you want to use. Do not commit `.env.local` or real secrets. Environment
variables prefixed with `NEXT_PUBLIC_` are exposed to browser code and must
never contain credentials.

## Local filesystem mode

Filesystem is the default local mode and does not require Xano or Vercel:

```bash
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPORT_JOB_STORE_DRIVER=filesystem
PDF_BROWSER_DRIVER=local
```

Report jobs are stored under `.tmp/reports`. This mode is intended for
development, tests, and offline demos; it is not durable hosted persistence.

## Local Xano mode

Local development can use the Xano persistence adapter. Use a separate
development Xano environment or database and a dedicated development key; do
not reuse the production key or production dataset:

```bash
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPORT_JOB_STORE_DRIVER=xano
PDF_BROWSER_DRIVER=local
XANO_REPORT_JOBS_ENDPOINT=https://your-xano-instance/api:group/report_jobs
# XANO_API_KEY=your_development_xano_api_key
```

When API-key protection is enabled in Xano, set `XANO_API_KEY` as a server-only
variable without a `NEXT_PUBLIC_` prefix. The endpoint validation and rollout
steps are described in `deployment.md`. Use HTTPS endpoints and give the
development key access only to the required `report_jobs` operations.

The persisted `payload_json` contains normalized data derived from the uploaded
CSV. Do not upload confidential or personal data to a shared development
environment, and remove test records when they are no longer needed.

Changing `REPORT_JOB_STORE_DRIVER` does not migrate existing jobs. Filesystem
jobs remain in `.tmp/reports`, and Xano jobs remain in Xano.

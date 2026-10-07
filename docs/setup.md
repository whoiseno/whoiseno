# Setup & Tooling

## Requirements

- Node.js `>=22.12.0` (see `engines` in [`package.json`](../package.json))
- [pnpm](https://pnpm.io) (see [`pnpm-workspace.yaml`](../pnpm-workspace.yaml)) — this repo uses pnpm's build-approval and minimum-release-age features, so use pnpm rather than npm/yarn

## Install

```bash
pnpm install
```

`pnpm install` also runs the `prepare` script (`husky`), which installs the git hooks in [`.husky/`](../.husky).

## Scripts

Defined in [`package.json`](../package.json):

| Script            | Command                                                   | Purpose                                                                                                                                                                        |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`        | `astro dev`                                               | Start the local dev server. In an AI-agent session, prefer `astro dev --background` (see [`CLAUDE.md`](../CLAUDE.md)) and manage it with `astro dev stop` / `status` / `logs`. |
| `pnpm build`      | `astro build`                                             | Production build with the Vercel adapter (output in `.vercel/output`), the command Vercel runs. Astro cannot preview it: see below.                                            |
| `pnpm build:node` | `astro build --node`                                      | Production build with the Node adapter (output in `dist/`), for `pnpm preview`.                                                                                                |
| `pnpm preview`    | `node --env-file-if-exists=.env ... astro preview --node` | Serves the build in `dist/` locally, with `.env` loaded. Run `pnpm build:node` first.                                                                                          |
| `pnpm astro`      | `astro`                                                   | Raw Astro CLI passthrough (e.g. `pnpm astro check`).                                                                                                                           |
| `pnpm format`     | `prettier . --write`                                      | Format the whole repo.                                                                                                                                                         |
| `pnpm lint`       | `eslint "src/**/*.{ts,astro}"`                            | Lint TS and Astro files under `src/`.                                                                                                                                          |
| `pnpm prepare`    | `husky`                                                   | Installs git hooks (runs automatically after install).                                                                                                                         |

### Building and previewing

`pnpm build` compiles and prerenders every static page (`/hobbies/books`, the CMS routes and `/api/cloud-assets/sign` are rendered on demand instead), then the Vercel adapter packages the server. It is the command Vercel runs. `astro preview` cannot serve that output: it stops with "The @astrojs/vercel adapter does not support the preview command". Only the Node adapter can be previewed, so `astro.config.mjs` uses it when the command line carries `--node`, and uses the Vercel adapter otherwise. `pnpm build:node` and `pnpm preview` add the flag for you.

To check the production site locally:

```bash
pnpm build:node
pnpm preview
```

Then open the address it prints (`http://127.0.0.1:4321`). Both commands need the flag, so `pnpm preview` after a plain `pnpm build` fails with the error above: build with `pnpm build:node` again. `pnpm preview` loads `.env` with Node's `--env-file-if-exists`, because a built server reads only the real environment, so the books page and the Cloudinary secrets work. A build is production, so the CMS uses Keystatic Cloud storage and asks you to sign in to Keystatic Cloud (see [`content.md`](./content.md#keystatic-cloud)). To edit content as local files, use `pnpm dev`, which is unaffected.

On Windows, `pnpm build` bundles the server function by creating symlinks into `.vercel/output`, which Windows blocks for normal users, so it ends with `EPERM: operation not permitted, symlink` unless Developer Mode is enabled (or the shell is elevated). The failure is environmental, not a code error; Vercel builds on Linux. Everything before it (including the static routes) completes, and `pnpm build:node` has no such step.

## Environment variables

Declared in the `env` schema in `astro.config.mjs` and imported from `astro:env/server`. Copy [`.env.example`](../.env.example) to `.env` for local work.

| Variable                | Required | Purpose                                                                                                                                                                                                                                                                                           |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TMDB_TOKEN`            | No       | TMDB "API Read Access Token" (the long JWT) or a v3 API key, from your TMDB account's API settings. Used at build time to fetch movie and series posters. Without it those entries fall back to the initial-letter tile.                                                                          |
| `HARDCOVER_API_KEY`     | No       | Hardcover API token, from your Hardcover account (see the [API docs](https://docs.hardcover.app/api/getting-started/)). The `Bearer ` prefix is optional. Read at request time to list the books on `/hobbies/books`. Without it that page shows "My books are unavailable right now" with a 503. |
| `CLOUDINARY_CLOUD_NAME` | No       | The cloud name shown on the Cloudinary dashboard. The CMS uploads every image, video and audio file to this account (see [`content.md`](./content.md#media-on-cloudinary)). Without the three Cloudinary variables an upload in the CMS fails with "Cloudinary is not set up".                    |
| `CLOUDINARY_API_KEY`    | No       | The API key from Cloudinary, Settings, API Keys.                                                                                                                                                                                                                                                  |
| `CLOUDINARY_API_SECRET` | No       | The API secret that goes with the key. It signs each upload on the server and never reaches the browser.                                                                                                                                                                                          |

Set `TMDB_TOKEN` and `HARDCOVER_API_KEY` in Vercel under Project Settings, Environment Variables for both Production and Preview, since the CMS saves trigger a rebuild there and Preview deployments render the books page too. The three Cloudinary variables are needed where the CMS runs, which is the production site (see [`content.md`](./content.md#keystatic-cloud)), so Production is enough; put them in `.env` as well to upload under `pnpm dev`. All of them are server secrets, so they never reach the browser or the built pages.

## Git hooks

[`.husky/pre-commit`](../.husky/pre-commit) runs `pnpm exec lint-staged`, which (per the `lint-staged` config in `package.json`) on staged files:

- `*.{js,cjs,mjs,ts,astro}` → `eslint --fix`
- `*.{js,cjs,mjs,ts,astro,css,json,md}` → `prettier --write --ignore-unknown`

So most formatting/lint-autofix issues are caught automatically at commit time — a failing pre-commit hook usually means an error `--fix` couldn't resolve.

## Linting

[`eslint.config.mjs`](../eslint.config.mjs) is a flat config combining:

- `eslint-config-prettier` (disables stylistic rules that conflict with Prettier)
- `eslint-plugin-astro`'s recommended rules (for `.astro` files)
- One project-specific rule: `astro/no-set-html-directive: error` — disallows `set:html` (raw HTML injection), an XSS guardrail worth keeping in mind since content can come from the CMS.

`eslint-plugin-jsx-a11y` is installed as a devDependency but not yet wired into the flat config — relevant if/when JSX-based components are introduced.

## Formatting

[`.prettierrc`](../.prettierrc) highlights:

- `printWidth: 120`, one attribute per line (`singleAttributePerLine`), attributes sorted ascending with `data-*` grouped separately.
- Plugins: `prettier-plugin-astro` (formats `.astro` files), `@ianvs/prettier-plugin-sort-imports` (enforces the FSD-layer import order described in [`architecture.md`](./architecture.md)), `@xeonlink/prettier-plugin-organize-attributes`, `prettier-plugin-tailwindcss` (sorts Tailwind classes, pointed at `src/app/styles/global.css` as the stylesheet source of truth for custom utilities).
- [`.prettierignore`](../.prettierignore) currently excludes only `astro.config.mjs` (its formatting is handled separately via the `*.config.mjs` override, which restricts plugins to import-sorting).

## TypeScript

[`tsconfig.json`](../tsconfig.json) extends Astro's `strict` preset and adds `verbatimModuleSyntax` plus the `@/*` layer aliases (see [`architecture.md`](./architecture.md)). Run type/template checking with:

```bash
pnpm astro check
```

(`@astrojs/check` is installed as a devDependency for this.)

## Editor

[`.vscode/`](../.vscode) ships recommended extensions and workspace settings — open the folder in VS Code to pick these up automatically.

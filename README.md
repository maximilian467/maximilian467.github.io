# Maximilian Köhlenbeck: personal website

Static bilingual (German / English) personal website built with Astro 7. Local fonts, plain CSS, and a real CartPole PPO policy running in the browser.

**Live:** https://maximilian467.github.io/ (English: https://maximilian467.github.io/en/)

## What it does

- Presents my background, current work and projects in German and English.
- Runs a **CartPole policy I trained with PPO** (Stable-Baselines3) directly in the browser. The network weights are exported to [`public/models/cartpole-policy.json`](public/models/cartpole-policy.json); the forward pass and the Gymnasium CartPole-v1 physics are reimplemented in TypeScript in [`src/lib/cartpole.ts`](src/lib/cartpole.ts). Visitors can nudge the pole.
- No cookies, no tracking, no external requests. A light/dark theme switch stores a single local-storage value (`portfolio-theme`).

## Architecture

```
docs/CONTENT.md ──┐                     public/models/cartpole-policy.json
src/content/      ├─► Astro build ─► static HTML/CSS ─► GitHub Pages
  projects/*.json │   (i18n routes: /, /en/)                 │
docs/legal/*.md ──┘                                          ▼
                                   src/lib/cartpole.ts (policy + physics) ─► CartPole.astro (canvas)
```

- `src/pages/`: routes (`/`, `/en/`, legal pages in both languages, 404)
- `src/components/`: one component per section (Hero, ProjectEntry, Datasheet, CartPole, …)
- `src/i18n/`: UI strings, links and routing helpers
- `src/content/projects/`: one JSON file per project, with `de` and `en` fields, validated by the content collection at build time
- `src/lib/cartpole.ts`: policy and physics, independent from rendering
- `src/styles/`: design tokens, base layout, and the two design variants

## Running locally

Node 24 recommended, at least 22.12:

```sh
npm ci
npm run dev
```

Check the production build: `npm run build`, then `npm run preview`.

## Tests and CI

| Command | What it checks |
|---|---|
| `npm run build` | `astro check` (type checking) and the static build |
| `npm run test:policy` | CartPole tests: a Gymnasium Euler reference step, argmax tie-breaking, and 20 seeded ten-minute runs that must survive a nudge every five seconds |
| `node scripts/verify-content.mjs` | Run after a build: legal pages match their sources, every project description is sourced from `docs/CONTENT.md`, no externally loaded media, canonical and hreflang tags present |

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main`: it builds the site with `withastro/action`, runs the policy tests and the content verification, and only then deploys to GitHub Pages.

Browser checks use the `playwright-cli`. After `npm run preview`:

```sh
playwright-cli -s=laborbuch open http://127.0.0.1:4321/
playwright-cli -s=laborbuch run-code --filename=scripts/browser-check.cjs
playwright-cli -s=laborbuch run-code --filename=scripts/browser-interactions.cjs
```

Create `docs/qa/screenshots/` first. Screenshots stay local and are not committed. Recorded check results are in [`docs/qa/`](docs/qa/).

## Design variants and theme

Visitors can choose light or dark via the text button in the header. Without a choice, the site follows the operating system. Implementation: `src/components/ThemeSwitch.astro` and `src/styles/tokens.css`. The CartPole area stays dark in both themes.

The default design is the revised `experiment` variant; the default can be changed in `src/config/design.ts`. Both variants share content, components, routes and simulation.

One-off preview of the original "lab notebook" (`classic`) design in PowerShell:

```powershell
$env:DESIGN_VARIANT='classic'
npm run dev
```

Back to the default: stop the server, `Remove-Item Env:DESIGN_VARIANT`, run `npm run dev` again. Use `npm run build` with the same setting for production files.

- `src/styles/tokens.css`: colors and typography
- `src/styles/base.css`: responsive base layout
- `src/styles/experiment.css`: italic accent typography and experiment area
- `src/styles/classic.css`: more restrained alternative
- `src/components/CartPole.astro`: rendering and controls
- `src/lib/cartpole.ts`: policy and physics

All decisions and open points: [docs/DECISIONS.md](docs/DECISIONS.md).

## Content and projects

`docs/CONTENT.md` is the single source of facts. Hero, about, current work and skills are read from it at build time. Legal pages read their files under `docs/legal/`.

To add a project, copy a JSON file under `src/content/projects/`, set a unique `order` and fill in `de` and `en`. Each language has `title`, `description`, `date`, `status`, `role`, `tech`. `running` controls the status dot. `measurements` is currently reserved for the Wächter datasheet.

`scripts/import-projects.mjs` was the one-time initial import of the six existing projects. Do not run it automatically: it would overwrite changes in those six JSON files with the current content of `CONTENT.md`.

Regenerate the OG image and favicon with `npm run assets` when needed. The glyphs are real Instrument Serif paths, so previews and favicon need no external fonts.

## Deployment

The site is hosted on GitHub Pages at https://maximilian467.github.io/ and deployed by GitHub Actions; no `base` path is set. To publish a change:

```sh
npm run build
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

Progress is visible in the repository's Actions tab. As of the update to Astro 7.3.2, `npm audit` reports no known vulnerabilities (13 September 2026, snapshot in [`docs/qa/npm-audit.json`](docs/qa/npm-audit.json)).

## Documentation language

The internal project documentation (`AGENTS.md`, `DESIGN.md`, `docs/`) is written in German.

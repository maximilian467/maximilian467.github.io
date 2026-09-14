# Maximilian Köhlenbeck: personal website

Static bilingual (English / German) personal website built with Astro 7. English is the default at `/`, German lives under `/de/`. Local fonts, plain CSS, and a double pendulum policy I trained with TQC, running live in the browser.

**Live:** https://maximilian467.github.io/ (German: https://maximilian467.github.io/de/)

## What it does

- Presents my background, current work and projects in English and German.
- Runs a **double pendulum on a cart, controlled by a TQC policy I trained** (sb3-contrib, MuJoCo) directly in the browser. One model holds four target poses (up · up, up · down, down · up, down · down) and switches between them. Only the actor weights are exported to [`public/models/double-pendulum-policy.json`](public/models/double-pendulum-policy.json); the forward pass and the MuJoCo model (Lagrangian dynamics, RK4, 0.005 s, 4 substeps per 50 Hz action) are reimplemented in TypeScript in [`src/lib/double-pendulum.ts`](src/lib/double-pendulum.ts). Visitors pick a pose and nudge a pole (3 N for 0.1 s).
- Shows projects with architecture diagrams, measurements and links where the facts exist.
- Hosts **Lab Notes**: technical write-ups of projects and experiments (`/lab-notes/`, German `/de/laborbuch/`).
- No cookies, no tracking, no external requests. A light/dark theme switch stores a single local-storage value (`portfolio-theme`). The language is carried by the URL only; there is no browser-language redirect.

## Architecture

```
docs/CONTENT.md ────┐                     public/models/double-pendulum-policy.json
src/content/        ├─► Astro build ─► static HTML/CSS ─► GitHub Pages
  projects/*.json   │   (i18n routes: /, /de/)                   │
  lab-notes/*.md    │                                            ▼
docs/legal/*.md ────┘   src/lib/double-pendulum.ts (policy + physics) ─► DoublePendulum.astro on LabFigure.astro (canvas)
```

- `src/pages/`: routes (`/`, `/de/`, legal pages in both languages, Lab Notes, 404). Old URLs (`/en/…`, `/impressum/`, `/datenschutz/`) redirect via `redirects` in `astro.config.mjs`.
- `src/components/`: one component per section (Hero, ProjectEntry, ArchitectureFlow, Datasheet, LabFigure, DoublePendulum, LabNoteEntry, …)
- `src/i18n/`: UI strings, links and routing helpers
- `src/content/projects/`: one JSON file per project, with `en` and `de` fields, validated by the content collection at build time
- `src/content/lab-notes/`: one Markdown file per Lab Notes article
- `src/lib/double-pendulum.ts`: policy and physics, independent from rendering; `src/lib/lab-notes.ts`: article queries
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
| `npm run test:policy` | Double pendulum tests against reference data from MuJoCo and the real model (`tests/fixtures/`): the forward pass on 50 observations (max. \|Δ action\| < 1e-4), the observation, 20 open-loop trajectories with nudges (max. \|Δ qpos\| < 1e-5, \|Δ qvel\| < 1e-4), and the 4×4 start/target evaluation matrix (every cell ≥ 80 %, mean ≥ 95 %) |
| `npm run bench:policy` | Not part of CI. Three-minute endurance runs with pose switches every 20 s and nudges every 4 s. It measures the trained model, not the implementation (see [docs/DECISIONS.md](docs/DECISIONS.md)) |
| `node scripts/verify-content.mjs` | Run after a build: legal pages match their sources, every project description is sourced from `docs/CONTENT.md`, English is the default, the Lab Notes disclosure is verbatim, old URLs redirect, no externally loaded media, canonical and hreflang tags present |

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main`: it builds the site with `withastro/action`, runs the policy tests and the content verification, and only then deploys to GitHub Pages.

Browser checks use the `playwright-cli`. After `npm run preview`:

```sh
playwright-cli -s=laborbuch open http://127.0.0.1:4321/
playwright-cli -s=laborbuch run-code --filename=scripts/browser-check.cjs
playwright-cli -s=laborbuch run-code --filename=scripts/browser-interactions.cjs
playwright-cli -s=laborbuch run-code --filename=scripts/browser-theme.cjs
```

Create `docs/qa/screenshots/` first. Screenshots stay local and are not committed. Recorded check results are in [`docs/qa/`](docs/qa/).

## Design variants and theme

Visitors can choose light or dark via the text button in the header. Without a choice, the site follows the operating system. Implementation: `src/components/ThemeSwitch.astro` and `src/styles/tokens.css`. The simulation area stays dark in both themes.

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
- `src/components/LabFigure.astro`: dark experiment surface, controls and caption
- `src/components/DoublePendulum.astro`: double pendulum drawing, pose buttons and controls, built on `LabFigure`
- `src/lib/double-pendulum.ts`: policy and physics

### Replacing the hero demo later

1. Put the weights in `public/models/` and the policy and physics as plain logic in `src/lib/` (like `double-pendulum.ts`, with a test under `tests/`).
2. Create a component next to `DoublePendulum.astro` that uses `LabFigure`: its own still SVG (`slot="still"`), optional selector row (`slot="selector"`), live readouts (`slot="readouts"`) and script.
3. Swap that one component in `src/components/Hero.astro`, then update the caption in `docs/CONTENT.md` (Hero, both languages) and the figure strings in `src/i18n/ui.ts`.

All decisions and open points: [docs/DECISIONS.md](docs/DECISIONS.md).

## Content and projects

`docs/CONTENT.md` is the single source of facts. Hero, about, AI-assisted engineering, current work and tools are read from it at build time. Legal pages read their files under `docs/legal/`.

To add a project, copy a JSON file under `src/content/projects/`, set a unique `order` and fill in `en` and `de`. Required per language: `title`, `description`, `date`, `status`, `role`, `tech`. Optional, and only with documented facts: `goal`, `built`, `architecture` (a list of flows `{ label?, nodes: [...] }`, rendered as a diagram), `decisions`, `metrics` (`{ label, value, highlight? }`, rendered as a datasheet), `learned`, `next`. Links sit outside the languages: `"links": { "demo": "https://…", "github": "…", "writeup": "<lab-note-id>" }`. Missing fields and links are not rendered. `running` controls the status dot.

`scripts/import-projects.mjs` was the one-time initial import of the six existing projects in the old format. Do not run it: it would overwrite the architecture, measurement and link fields.

Regenerate the OG image and favicon with `npm run assets` when needed. The glyphs are real Instrument Serif paths, so previews and favicon need no external fonts.

## Lab Notes

Articles are Markdown files under `src/content/lab-notes/<id>.md`. The overview is at `/lab-notes/` and `/de/laborbuch/`; articles are at `/lab-notes/<id>/` or `/de/laborbuch/<id>/`, depending on their language. Template, fields and how to link an article as a project's "Technical write-up": [docs/LAB-NOTES.md](docs/LAB-NOTES.md). The AI-writing disclosure is added automatically under every article.

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

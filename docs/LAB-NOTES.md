# Lab Notes: adding a note

Lab Notes (German UI: „Laborbuch") are technical write-ups of projects and experiments. Not a blog: no opinion, lifestyle or productivity posts.

- Overview: `/lab-notes/` (EN) and `/de/laborbuch/` (DE). Both list all notes; a note in the other language is marked.
- Article URL: `/lab-notes/<id>/` for English notes, `/de/laborbuch/<id>/` for German ones. `<id>` is the file name without `.md`.
- The AI-writing disclosure is added automatically under every article and on the overview. Do not repeat it in the text.
- Facts, numbers and measurements must be real. Nothing that is not in `docs/CONTENT.md` or your own notes.

## Steps

1. Create `src/content/lab-notes/<id>.md`, e.g. `double-pendulum-ppo.md`. Use lowercase and hyphens.
2. Copy the template below. Leave out optional fields you have no facts for.
3. Link it from a project as its "Technical write-up": set `"links": { "writeup": "<id>" }` in `src/content/projects/<project>.json`. The build fails if the id does not exist.
4. The first note only: restart `npm run dev` (the collection is skipped while the folder is empty).
5. `npm run build`. Notes with `draft: true` only show in `npm run dev`.

## Template

```md
---
title: Short, specific title
summary: One or two sentences: what was built or tested and the main result.
lang: en              # en or de
published: 2026-10-01
# updated: 2026-10-15
# project: waechter   # id of a file in src/content/projects/
stack: [Python, Stable-Baselines3, Gymnasium]
# architecture:       # rendered as a flow diagram above the text
#   - label: Training
#     nodes: [Gymnasium environment, PPO, Policy weights, Browser demo]
# metrics:            # rendered as a datasheet; one entry may have a short highlight
#   - { label: Episode reward, value: "…", highlight: "…" }
# links:
#   demo: https://…
draft: true
---

## What I wanted to build

## Architecture

## Experiments

## What failed

## Debugging

## Measurements

## Results

## What I learned

## What I would do differently
```

Headings are a guide, not a form. Drop sections that have nothing real in them.

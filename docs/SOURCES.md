# Vorbereitete Tools & Quellen

Stand: 13.09.2026. Alles liegt lokal im Projekt, damit der Coding-Agent (Codex / GPT-6 Astra) es ohne Internet findet.

## Agent Skills (`.agents/skills/`)

Codex liest Skills automatisch aus `.agents/skills/` im Repo.

| Skill | Quelle | Wofür |
|---|---|---|
| `minimalist-ui` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) | Primäre Design-Regeln: ruhig, editorial, warm-monochrom |
| `high-end-visual-design` | taste-skill | Nur als Referenz für Spacing/Motion-Qualität, NICHT für Glass/Pill-Look |
| `gpt-taste` | taste-skill | Nur die Verbote (Meta-Labels, 6-Zeilen-Headlines usw.), GSAP-Teil ignorieren |
| `image-to-code` | taste-skill | Erst Design-Bild generieren, analysieren, dann bauen |
| `redesign-existing-projects` | taste-skill | Für spätere Überarbeitungsrunden |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Review gegen Vercels Web Interface Guidelines |
| `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) | Screenshots & Browser-Checks durch den Agent |

## Referenzen (`docs/`)

- `docs/guidelines/vercel-web-interface-guidelines.md`: lokale Kopie von [command.md](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
- `docs/design-references/*.DESIGN.md`: aus [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (Linear, Notion, Vercel, Apple, Mintlify, Claude). Nur als Inspiration, nicht kopieren.

## Global installiert

- `@playwright/cli` (`playwright-cli open`, `screenshot`, `resize` …)

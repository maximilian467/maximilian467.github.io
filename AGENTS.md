# AGENTS.md

Persönliche Website von Maximilian Köhlenbeck. Ein Lebenslauf zum Durchklicken, vor allem für Bewerbungen bei Hackathons, technischen Praktika und zum Netzwerken.

## Pflichtlektüre vor jeder Änderung

1. `DESIGN.md`: Design-System „Laborbuch" (verbindlich)
2. `docs/CONTENT.md`: alle Texte und Fakten (einzige Quelle, nichts erfinden)
3. `docs/legal/impressum.md` und `docs/legal/datenschutz.md`: Texte für die Rechtsseiten
4. `docs/LAB-NOTES.md`: Aufbau und Vorlage für Lab-Notes-Artikel

## Stack

- **Astro 7** (Sicherheitsupdate vom Nutzer freigegeben), komplett statisch (`output: 'static'`), Node ≥ 22.12
- TypeScript strict
- Styling: **reines CSS** mit Custom Properties aus `DESIGN.md` (kein Tailwind, keine UI-Library)
- Schriften selbst gehostet: Instrument Serif, Geist, Geist Mono (Fontsource oder Astro Fonts API)
- i18n: Astros eingebautes Routing, `defaultLocale: 'en'`, `locales: ['en', 'de']`, `prefixDefaultLocale: false` → `/` Englisch (Standard), `/de/` Deutsch. Keine automatische Weiterleitung nach Browsersprache.
- Rechtsseiten: `/legal-notice`, `/privacy`, `/de/impressum`, `/de/datenschutz`. Alte URLs (`/en/…`, `/impressum`, `/datenschutz`) leiten über `redirects` in `astro.config.mjs` weiter.
- Lab Notes: `/lab-notes/` und `/de/laborbuch/`, Artikel als Markdown in `src/content/lab-notes/`.
- Client-JavaScript nur für: CartPole-Figur, Einblend-Animation und den vom Nutzer gewünschten Hell-/Dunkel-Schalter. Keine Frameworks (kein React), Vanilla TS in `<script>`.
- Hosting: **GitHub Pages** unter `https://maximilian467.github.io` (Repo `maximilian467/maximilian467.github.io`), Deploy per GitHub Actions mit `withastro/action`. `site: 'https://maximilian467.github.io'`, kein `base`.

## Struktur

```
src/
  components/   Header, LangSwitch, ProjectEntry, ArchitectureFlow, Datasheet, LabFigure, CartPole, LabNoteEntry, Footer …
  i18n/         ui.ts (UI-Strings), utils.ts (Routen), content.ts (liest CONTENT.md)
  content/      projects/ (je Projekt eine JSON-Datei mit en/de), lab-notes/ (Markdown)
  lib/          cartpole.ts (Policy + Physik), lab-notes.ts
  layouts/      Base.astro (Meta, hreflang, OG, Fonts), Home, Legal, LabNotesIndex, LabNote
  pages/        index.astro (EN), legal-notice, privacy, lab-notes/, de/…
  styles/       tokens.css, base.css
public/
  cv/           maximilian-koehlenbeck-lebenslauf.pdf
  models/       cartpole-policy.json
  favicon.svg, og.png, robots.txt
```

## Befehle

```bash
npm run dev       # lokal
npm run build     # muss fehlerfrei durchlaufen
npm run preview   # gebaute Seite testen
```

## Harte Regeln

- **Kein Quellcode, keine Repos, keine Screenshots aus privaten Projekten.** Einziger Code-Link: `github.com/maximilian467/n8n-automation-portfolio` (Allowlist in `src/content.config.ts`).
- **Kein Foto.** `_private/` wird nie verwendet oder veröffentlicht.
- **Nichts erfinden:** keine Zahlen, Platzierungen, Nutzerzahlen, Firmen, Zeiträume, Technologien oder Architekturdiagramme, die nicht in `docs/CONTENT.md` stehen. Der 4. Platz beim Hackathon wird nicht erwähnt.
- KUKA wird nur als Arbeitgeber im dualen Studium und beim 3D-Druck-Projekt genannt. Kein KUKA-Logo, keine KUKA-Farben, nichts, was nach offizieller KUKA-Seite aussieht. Keine Aussagen über Zukunftspläne bei KUKA.
- Texte klingen wie ein Mensch: erste Person, kurze Sätze, keine Gedankenstriche als Stilmittel, keine Floskeln, keine Emojis. Englisch ist eine natürliche Übersetzung, keine wörtliche. Ausnahme: der englische KI-Hinweis im Laborbuch steht wörtlich wie vom Nutzer vorgegeben.
- Keine Cookies, kein Tracking, keine externen Requests (Fonts, CDNs, Analytics). Sonst stimmt die Datenschutzerklärung nicht mehr.
- Die Verbotsliste in `DESIGN.md` Abschnitt 8 gilt ausnahmslos.

## CartPole-Figur

- `public/models/cartpole-policy.json` enthält die echten Gewichte der PPO-Policy (Stable-Baselines3 MlpPolicy), die Maximilian trainiert hat. Forward-Pass: für jede Schicht in `hidden`: `h = tanh(W·h + b)`, dann `logits = action.W·h + action.b`, Aktion = argmax (0 = links, 1 = rechts). Eingabe: `[x, x_dot, theta, theta_dot]`, unnormalisiert.
- Physik exakt wie Gymnasium CartPole-v1 (Euler, Werte in `physics` im JSON), 50 Schritte/s. Rendering mit `requestAnimationFrame` und festem Zeitschritt.
- „Stupsen" addiert einen kleinen Impuls auf `theta_dot` (ca. ±0.6 rad/s, zufällige Richtung). Reset, wenn `|theta| > 0.2095` oder `|x| > 2.4`.
- Geprüft (13.09.2026): Die JS-Umsetzung liefert dieselben Aktionen wie Python, und die Policy hält den Stab in 20 von 20 Läufen 10 Minuten lang, bei einem Stupser alle 5 Sekunden. Fällt der Stab in deiner Umsetzung trotzdem, ist die Umsetzung falsch. Reset trotzdem sauber mit kurzem Fade einbauen.
- Ohne JS: statisches SVG-Standbild. Mit `prefers-reduced-motion`: angehalten mit Play-Button.
- Rahmen, Steuerung und Bildunterschrift liegen in `LabFigure.astro`. Eine spätere Demo (z. B. Double Pendulum) bekommt eine eigene Komponente auf `LabFigure` und eine eigene Logik unter `src/lib/`; in `Hero.astro` wird nur die Komponente getauscht. Keine Platzhalter-Demo veröffentlichen.

## Skills (`.agents/skills/`)

Reihenfolge der Gewichtung bei Konflikten: `DESIGN.md` > `minimalist-ui` > alles andere.

| Skill | Einsatz |
|---|---|
| `image-to-code` | Phase „Entwurf": erst Design-Bilder generieren und analysieren, dann bauen |
| `minimalist-ui` | Haupt-Stilregeln. Ausnahme: Icons und Pill-Tags laut `DESIGN.md` weglassen |
| `gpt-taste` | **Nur** die Verbote und Checks (Meta-Labels, Headline-Zeilen, Button-Kontrast). GSAP, Bento, Marquee, picsum, AIDA ignorieren |
| `high-end-visual-design` | Nur Performance-Guardrails. Glass, Pill-Nav, Doppelrand ignorieren |
| `playwright-cli` | Screenshots und Browser-Checks (siehe unten) |
| `web-design-guidelines` | Review am Ende jeder Phase. Lokale Kopie: `docs/guidelines/vercel-web-interface-guidelines.md` |
| `redesign-existing-projects` | nur für spätere Überarbeitungsrunden |

## Prüfen, bevor etwas „fertig" ist

1. `npm run build` ohne Fehler und Warnungen, danach `node scripts/verify-content.mjs`.
2. `npm run preview`, dann mit `playwright-cli` Screenshots von `/` und `/de/` in 390×844, 768×1024, 1366×768, 1440×900, jeweils hell und dunkel (`prefers-color-scheme`). Screenshots selbst anschauen und Fehler beheben: Überlauf, horizontales Scrollen, abgeschnittene Texte, Headline > 2 Zeilen im Hero, schlechte Abstände.
3. Tastatur-Durchlauf: Tab durch die ganze Seite, Fokus immer sichtbar, Sprachumschalter und „Nudge"/„Anstupsen" bedienbar.
4. Review mit `web-design-guidelines` gegen alle geänderten Dateien, Findings beheben.
5. Texte gegen `docs/CONTENT.md` abgleichen: keine erfundenen Fakten, keine Gedankenstriche, keine Emojis.
6. Keine externen Requests im Netzwerk-Tab (außer Links, die man anklickt).

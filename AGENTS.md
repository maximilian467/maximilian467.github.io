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
- Client-JavaScript nur für: Doppelpendel-Figur, Einblend-Animation und den vom Nutzer gewünschten Hell-/Dunkel-Schalter. Keine Frameworks (kein React), Vanilla TS in `<script>`.
- Hosting: **GitHub Pages** unter `https://maximilian467.github.io` (Repo `maximilian467/maximilian467.github.io`), Deploy per GitHub Actions mit `withastro/action`. `site: 'https://maximilian467.github.io'`, kein `base`.

## Struktur

```
src/
  components/   Header, LangSwitch, ProjectEntry, ArchitectureFlow, Datasheet, LabFigure, DoublePendulum, LabNoteEntry, Footer …
  i18n/         ui.ts (UI-Strings), utils.ts (Routen), content.ts (liest CONTENT.md)
  content/      projects/ (je Projekt eine JSON-Datei mit en/de), lab-notes/ (Markdown)
  lib/          double-pendulum.ts (Policy + Physik), lab-notes.ts
  layouts/      Base.astro (Meta, hreflang, OG, Fonts), Home, Legal, LabNotesIndex, LabNote
  pages/        index.astro (EN), legal-notice, privacy, lab-notes/, de/…
  styles/       tokens.css, base.css
public/
  cv/           maximilian-koehlenbeck-lebenslauf.pdf
  models/       double-pendulum-policy.json
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

## Doppelpendel-Figur

- `public/models/double-pendulum-policy.json` enthält nur die Actor-Gewichte der TQC-Policy (sb3-contrib), die Maximilian in MuJoCo trainiert hat (`runs/tqc_phases/best_model.zip`, 1,7 Mio. Schritte). Kein Critic, kein Reward, kein Trainingscode. Netz: Linear(12→256) → ReLU → Linear(256→256) → ReLU → Linear(256→1) → tanh. Gewichte als Base64 von Float32 little-endian.
- Beobachtung (12 Werte, float32, auf ±10 geclippt): x/2.4, ẋ/3, sin/cos φ₁, sin/cos φ₂, ω₁/10, ω₂/10, One-Hot der Zielhaltung. Winkel absolut, 0 = oben, π = unten. Haltungen: 0 oben · oben, 1 oben · unten, 2 unten · oben, 3 unten · unten (unteres · oberes Pendel).
- Physik in `src/lib/double-pendulum.ts` ist eine eigene Umsetzung des MuJoCo-Modells: Lagrange-Gleichungen, viskose Dämpfung auf den MuJoCo-Geschwindigkeiten, RK4 mit 0.005 s, 4 Teilschritte pro Aktion (50 Hz), Motor 40 N · Aktion. Stupser: 3 N für 0.1 s im Schwerpunkt eines Pendels. Die weiche Schienengrenze bei ±2.4 ist nicht nachgebaut, weil ab |x| > 2.3 neu gestartet wird.
- Referenzdaten in `tests/fixtures/double-pendulum-reference.json` stammen aus MuJoCo und dem echten Modell (Export-Skript liegt privat im RL-Projekt). Geprüft (14.09.2026): Netz max. |Δ Aktion| 7,9e-7, Open-Loop max. |Δ qpos| 2,8e-14, 4×4-Matrix im Mittel 99 %. Weichen die Tests ab, ist die Umsetzung falsch. Physik, Kräfte und Netz nie anpassen, damit es besser aussieht.
- Bekannte Grenze des Modells, nicht der Umsetzung: In langen Läufen driftet der Wagen beim Halten aus der Mitte, und der nächste Wechsel fährt dann über die Schiene. `npm run bench:policy` misst das (TS 9/20, MuJoCo 6/20 ohne Schienen-Aus in 3 Minuten). Die Figur startet dann nach kurzem Fade hängend neu, die gewählte Haltung bleibt.
- Start: hängend, nach 1,5 s einmal automatisch auf oben · oben. Ohne JS: statisches SVG-Standbild. Mit `prefers-reduced-motion`: angehalten, kein automatischer Wechsel.
- Rahmen, Steuerung und Bildunterschrift liegen in `LabFigure.astro`. Eine spätere Demo bekommt eine eigene Komponente auf `LabFigure` und eine eigene Logik unter `src/lib/`; in `Hero.astro` wird nur die Komponente getauscht. Keine Platzhalter-Demo veröffentlichen.

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

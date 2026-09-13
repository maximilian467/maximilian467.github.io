# Maximilian Köhlenbeck

Statische persönliche Website mit Astro 6, Deutsch und Englisch. Lokale Schriften, reines CSS, echte CartPole-Policy im Browser.

## Lokal starten

Node 24 empfohlen, mindestens 22.12:

```sh
npm ci
npm run dev
```

Produktionsversion prüfen: `npm run build`, danach `npm run preview`. Simulation prüfen: `npm run test:policy`.

## Gestaltung schnell zurückwechseln

Standard ist die überarbeitete Gestaltung `experiment`. In `src/config/design.ts` lässt sich die Standardauswahl ändern. Beide Varianten teilen sich Inhalte, Komponenten, Routen und Simulation.

Für eine einmalige Vorschau der ursprünglichen Laborbuch-Gestaltung in PowerShell:

```powershell
$env:DESIGN_VARIANT='classic'
npm run dev
```

Zurück zum neuen Design: Server stoppen, `Remove-Item Env:DESIGN_VARIANT`, erneut `npm run dev`. Für Produktionsdateien mit derselben Einstellung `npm run build` verwenden.

- `src/styles/tokens.css`: Farben und Typografie
- `src/styles/base.css`: responsives Grundlayout
- `src/styles/experiment.css`: kursive Akzenttypografie und Experimentfläche
- `src/styles/classic.css`: zurückhaltende Alternative
- `src/components/CartPole.astro`: Darstellung und Bedienung
- `src/lib/cartpole.ts`: davon unabhängige Policy und Physik

Alle Entscheidungen und offenen Punkte: [docs/DECISIONS.md](docs/DECISIONS.md).

## Inhalte und Projekte

Fakten zuerst in `docs/CONTENT.md` pflegen. Hero, Über mich, Gerade dran und Kompetenzen werden beim Build direkt daraus gelesen. Rechtsseiten lesen die jeweilige Datei unter `docs/legal/`.

Für ein neues Projekt eine JSON-Datei unter `src/content/projects/` kopieren, eine eindeutige `order` setzen und `de` sowie `en` ausfüllen. Jede Sprache hat `title`, `description`, `date`, `status`, `role`, `tech`. `running` steuert den Statuspunkt. `measurements` ist derzeit ausschließlich für das Wächter-Datenblatt vorgesehen. Die Collection validiert alle Dateien beim Build.

`scripts/import-projects.mjs` ist der explizite Erstimport der sechs vorhandenen Projekte. Nicht automatisch ausführen: Er würde Änderungen an diesen sechs JSON-Dateien durch den aktuellen Inhalt von CONTENT.md ersetzen.

OG-Bild und Favicon bei Bedarf mit `npm run assets` neu erzeugen. Die Glyphen sind echte Instrument-Serif-Pfade, daher brauchen Vorschau und Favicon keine externen Fonts.

## Deployment

1. Auf GitHub das Repository `maximilian467/maximilian467.github.io` erstellen, ohne vorab eine README anzulegen.
2. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
3. Lokal den Remote hinzufügen und den vorbereiteten Commit pushen:

```sh
git remote add origin https://github.com/maximilian467/maximilian467.github.io.git
git push -u origin main
```

Der Workflow `.github/workflows/deploy.yml` baut mit `withastro/action` und veröffentlicht auf GitHub Pages. Es ist kein `base` gesetzt. Dieser Arbeitsstand wurde lokal committed, nicht gepusht.

Der festgelegte Astro-6-Stand hat einen verbleibenden npm-Audit-Befund. Details und Einordnung stehen in [docs/DECISIONS.md](docs/DECISIONS.md).

## Prüfungen

Browserprüfungen verwenden den vorhandenen `playwright-cli`. Nach `npm run preview`:

```sh
playwright-cli -s=laborbuch open http://127.0.0.1:4321/
playwright-cli -s=laborbuch run-code --filename=scripts/browser-check.cjs
playwright-cli -s=laborbuch run-code --filename=scripts/browser-interactions.cjs
```

Vorher `docs/qa/screenshots/` anlegen. Screenshots bleiben lokal und werden nicht committed oder veröffentlicht. Prüfergebnisse stehen unter `docs/qa/`.

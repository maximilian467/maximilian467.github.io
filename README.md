# Maximilian Köhlenbeck

Statische persönliche Website mit Astro 7, Deutsch und Englisch. Lokale Schriften, reines CSS, echte CartPole-Policy im Browser.

## Lokal starten

Node 24 empfohlen, mindestens 22.12:

```sh
npm ci
npm run dev
```

Produktionsversion prüfen: `npm run build`, danach `npm run preview`. Simulation prüfen: `npm run test:policy`.

## Gestaltung schnell zurückwechseln

Besucher können über den Textbutton in der Kopfzeile Hell oder Dunkel wählen. Ohne eigene Auswahl folgt die Website dem Betriebssystem. Die Auswahl wird ausschließlich lokal unter `portfolio-theme` gespeichert. Die dunkle CartPole-Fläche bleibt erhalten. Umsetzung: `src/components/ThemeSwitch.astro` und `src/styles/tokens.css`.

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

Das Repository `maximilian467/maximilian467.github.io` ist angelegt, der Remote `origin` gesetzt und GitHub Pages auf **GitHub Actions** eingestellt. Zieladresse: https://maximilian467.github.io/.

Für spätere Änderungen lokal prüfen, committen und veröffentlichen:

```sh
npm run build
git add <geänderte-dateien>
git commit -m "Describe the change"
git push origin main
```

Der Workflow `.github/workflows/deploy.yml` baut mit `withastro/action` und veröffentlicht auf GitHub Pages. Es ist kein `base` gesetzt. Den Fortschritt zeigt der Actions-Tab des Repositories. Eine eigene Domain oder ein zusätzlicher Hosting-Anbieter ist nicht nötig.

Nach dem freigegebenen Update auf Astro 7.3.2 meldet `npm audit` keine bekannten Sicherheitslücken (13. September 2026).

## Prüfungen

Browserprüfungen verwenden den vorhandenen `playwright-cli`. Nach `npm run preview`:

```sh
playwright-cli -s=laborbuch open http://127.0.0.1:4321/
playwright-cli -s=laborbuch run-code --filename=scripts/browser-check.cjs
playwright-cli -s=laborbuch run-code --filename=scripts/browser-interactions.cjs
```

Vorher `docs/qa/screenshots/` anlegen. Screenshots bleiben lokal und werden nicht committed oder veröffentlicht. Prüfergebnisse stehen unter `docs/qa/`.

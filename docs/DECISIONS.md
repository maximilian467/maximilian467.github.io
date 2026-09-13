# Entscheidungen und Rückwege

Stand: 13. September 2026. Grundlage: Nutzerfeedback nach Phase 2. Der Nutzer hat die Umsetzung freigegeben, eigene Gestaltungsentscheidungen ausdrücklich erlaubt und schnelle Rückwechsel verlangt.

## Getroffene Entscheidungen

| Entscheidung | Grund | Schnell ändern |
| --- | --- | --- |
| Dunkle CartPole-Experimentfläche, feines Raster | Die Simulation schafft den gewünschten stärkeren visuellen Schwerpunkt | `src/styles/experiment.css`; oder gesamter Rückwechsel per `DESIGN_VARIANT=classic` |
| Nachname kursiv und in Akzentfarbe | Mehr typografischer Charakter, ohne weitere Schriften oder Dekoration | `src/styles/experiment.css` |
| Drei Kontaktlinks: LinkedIn, E-Mail, GitHub | Auflösung des Widerspruchs DESIGN.md/CONTENT.md; CV bleibt im Hero | `src/components/Contact.astro` |
| Sachlicher Hero und Über-mich-Text | Der ursprüngliche Einstieg wurde ausdrücklich abgelehnt | `docs/CONTENT.md`, in beiden Sprachen |
| Wächter-Messwert als typografischer Schwerpunkt | Ein belegtes Ergebnis hilft beim schnellen Erfassen | `src/components/Datasheet.astro`; Classic blendet die zusätzliche Hervorhebung aus |
| Sichtbarer Pause-/Abspielen-Textbutton | Laufende Bewegung bleibt steuerbar; reduzierte Bewegung startet pausiert | `src/components/CartPole.astro` |
| Native Ankersprünge | Vermeidet kurzzeitig nicht sichtbaren Tastaturfokus bei weichem Scrollen | `src/styles/base.css` |
| Lokale Fontsource-Pakete und statische Seiten | Keine externen Ladeanfragen, kein Framework im Browser | `src/layouts/Base.astro`, `astro.config.mjs` |
| Node 24 für Entwicklung und Deployment | Unterstützte lokale Version; mindestens Node 22.12 erforderlich | `package.json`, `.github/workflows/deploy.yml` |
| GitHub Pages unter maximilian467.github.io | Veröffentlichung vom Nutzer inzwischen ausdrücklich gewünscht | Push auf `main` startet den Workflow; frühere Änderungen per Git-Revert zurücknehmen |

## Rückwechsel ohne Umbau

`DESIGN_VARIANT=classic` wählt beim Start/Build die ruhigere Laborbuch-Variante. Der Name wird normal und ohne Akzent gesetzt, die Simulation hell, das Raster entfernt und die zusätzliche Messwerthervorhebung ausgeblendet. Inhalte, Routen und Physik bleiben identisch. Build und Browserdarstellung der Alternative wurden geprüft.

Die Variante ist eine Umsetzung der ursprünglichen Gestaltungsregeln, kein pixelgenauer Nachbau der damaligen generierten Bilder. Die neuen sachlichen Texte bleiben auch beim Designwechsel erhalten.

Die Dateigrenzen sind absichtlich klein: UI-Strings und Routen unter `src/i18n/`, ein Projekt pro JSON-Datei, jede Sektion als Komponente, reine Simulationslogik unter `src/lib/cartpole.ts`, Darstellung getrennt davon in `CartPole.astro`.

## Freigegeben: Astro-Update und Farbschalter

Der Nutzer hat das Sicherheitsupdate ausdrücklich freigegeben. Astro wurde von 6.4.8 auf 7.3.2 aktualisiert. `npm audit` meldet nun keine bekannten Sicherheitslücken. Build, Inhaltsvergleich, CartPole-Tests und Browserprüfungen bestehen nach dem Update. Grundlage: [offizielle Astro-7-Migration](https://docs.astro.build/en/guides/upgrade-to/v7/). Der aktuelle Audit-Snapshot steht in `docs/qa/npm-audit.json`.

Der Projekt-Introtext wurde auf ausdrücklichen Wunsch in beiden Sprachen entfernt. Der Farbschalter sitzt als kleiner Textbutton in der Kopfzeile. Die Beschriftung nennt das Ziel des nächsten Klicks. Ohne eigene Auswahl gilt das Systemfarbschema; eine eigene Auswahl bleibt über Seiten- und Sprachwechsel erhalten. Dafür wird genau ein Local-Storage-Wert `portfolio-theme` verwendet. Kein Cookie und keine Übertragung. Die Datenschutzerklärung beschreibt dies in beiden Sprachen. Ohne JavaScript bleibt der Button verborgen; ohne verfügbaren Speicher funktioniert das Umschalten weiterhin auf der aktuellen Seite.

Die CartPole-Experimentfläche bleibt in beiden Farbschemata dunkel. Darstellung, Inhalte und Physik wurden ansonsten beibehalten. Theme-Komponente, Farbvariablen und Designvariante bleiben unabhängig austauschbar.

## Ehrliche Einschätzung und nächste sinnvolle Verbesserungen

- Die neue Gestaltung hat mehr Charakter; nach dem Hero bleibt die Seite bewusst textbetont. Als nächste Designentscheidung würde ich zuerst den Rhythmus der sechs Projekteinträge mit dem Nutzer beurteilen, nicht weitere Effekte hinzufügen.
- Auf Mobil folgt die vollständige Simulation unterhalb des ersten Bildschirms. Text und Links sind vorher lesbar. Das vermeidet zu kleine Schrift und einen zu flachen Simulationsbereich.
- Keine offenen Platzhalter für Name, Kontakt, Lebenslauf, Projekttexte oder Rechtsseiten. Repository und GitHub-Pages-Konfiguration sind eingerichtet.
- Der Browser-Testbetrieb war Chromium-basiert. Ein echter Safari-/iOS-Durchlauf und ein echter Hintergrundtab-Test in einem sichtbaren Browser bleiben zusätzliche Geräteprüfungen. Die Reaktion auf das Visibility-Signal wurde separat erfolgreich geprüft.

## Entwürfe und technische Grundlage

Die überarbeiteten Entwürfe liegen unter `docs/design/revision-02/`. Prompts und Auswahl sind dokumentiert. Ein von der Bildgenerierung erfundener Name samt Randtexten wurde verworfen und nicht übernommen.

Verwendete offizielle Dokumentation: [Astro Content Loader API](https://v6.docs.astro.build/en/reference/content-loader-reference/), [Astro-v6-Migration](https://v6.docs.astro.build/en/guides/upgrade-to/v6/), [withastro/action](https://github.com/withastro/action). Die bestehenden lokalen Vercel-Web-Interface-Guidelines wurden für den abschließenden Review verwendet.

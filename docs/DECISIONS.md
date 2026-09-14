# Entscheidungen und Rückwege

Stand: 13. September 2026. Grundlage: Nutzerfeedback nach Phase 2. Der Nutzer hat die Umsetzung freigegeben, eigene Gestaltungsentscheidungen ausdrücklich erlaubt und schnelle Rückwechsel verlangt.

## Getroffene Entscheidungen

| Entscheidung | Grund | Schnell ändern |
| --- | --- | --- |
| Dunkle Experimentfläche, feines Raster | Die Simulation schafft den gewünschten stärkeren visuellen Schwerpunkt | `src/styles/experiment.css`; oder gesamter Rückwechsel per `DESIGN_VARIANT=classic` |
| Nachname kursiv und in Akzentfarbe | Mehr typografischer Charakter, ohne weitere Schriften oder Dekoration | `src/styles/experiment.css` |
| Drei Kontaktlinks: LinkedIn, E-Mail, GitHub | Auflösung des Widerspruchs DESIGN.md/CONTENT.md; CV bleibt im Hero | `src/components/Contact.astro` |
| Sachlicher Hero und Über-mich-Text | Der ursprüngliche Einstieg wurde ausdrücklich abgelehnt | `docs/CONTENT.md`, in beiden Sprachen |
| Wächter-Messwert als typografischer Schwerpunkt | Ein belegtes Ergebnis hilft beim schnellen Erfassen | `src/components/Datasheet.astro`; Classic blendet die zusätzliche Hervorhebung aus |
| Sichtbarer Pause-/Abspielen-Textbutton | Laufende Bewegung bleibt steuerbar; reduzierte Bewegung startet pausiert | `src/components/DoublePendulum.astro` |
| Native Ankersprünge | Vermeidet kurzzeitig nicht sichtbaren Tastaturfokus bei weichem Scrollen | `src/styles/base.css` |
| Lokale Fontsource-Pakete und statische Seiten | Keine externen Ladeanfragen, kein Framework im Browser | `src/layouts/Base.astro`, `astro.config.mjs` |
| Node 24 für Entwicklung und Deployment | Unterstützte lokale Version; mindestens Node 22.12 erforderlich | `package.json`, `.github/workflows/deploy.yml` |
| GitHub Pages unter maximilian467.github.io | Veröffentlichung vom Nutzer inzwischen ausdrücklich gewünscht | Push auf `main` startet den Workflow; frühere Änderungen per Git-Revert zurücknehmen |

## Überarbeitung 14. September 2026: international, technischer, Lab Notes

| Entscheidung | Grund | Schnell ändern |
| --- | --- | --- |
| Englisch ist Standard (`/`), Deutsch unter `/de/` | Zielgruppe: internationale Hackathons, Praktika, Programme | `astro.config.mjs` (`defaultLocale`), `src/i18n/utils.ts`, Seiten unter `src/pages/` |
| Keine Weiterleitung nach Browsersprache, kein gespeicherter Sprachwert | Die gewählte Sprache wird nie überschrieben; die URL trägt die Sprache; keine neue Speicherung für die Datenschutzerklärung | `src/components/LangSwitch.astro` |
| Alte URLs leiten per statischer Weiterleitung um | Bereits geteilte Links (`/en/`, `/impressum/`, …) bleiben gültig | `redirects` in `astro.config.mjs` |
| Name bleibt `h1`, Positionierung als Zeile direkt darunter | Visuelle Identität bleibt, die Positionierung ist trotzdem in Sekunden lesbar | `src/components/Hero.astro`, `docs/CONTENT.md` |
| „KI-gestützte Entwicklung" als eigener Block unter Über mich | Transparent zu Claude Code/Codex, Schwerpunkt auf Systemdesign und Validierung | `docs/CONTENT.md` |
| Werkzeuge nach Einsatz gruppiert, ohne Selbsteinstufung | „Sehr sicher" war eine Selbstbewertung; nur belegte Technologien, Isaac Lab als Anfang markiert | `docs/CONTENT.md` |
| Architekturdiagramme als geordnete Liste mit CSS-Pfeilen | Leicht, zugänglich, ohne Diagramm-Bibliothek; nur aus Beschreibungen abgeleitete Abläufe | `src/components/ArchitectureFlow.astro`, Projekt-JSON |
| Messwerte aus Projektdaten statt fest im Datenblatt | Weitere Projekte und Artikel können Messwerte zeigen | `src/components/Datasheet.astro` |
| Lab Notes / Laborbuch als eigene Seiten, Startseitenabschnitt erst ab dem ersten Artikel | Kein leerer Abschnitt auf der Startseite; Navigation zeigt die Übersicht mit Hinweis „in Arbeit" | `src/layouts/LabNotesIndex.astro`, `src/layouts/Home.astro` |
| KI-Hinweis wörtlich mit Gedankenstrich, nur im Laborbuch | Vom Nutzer exakt vorgegeben; die deutsche Fassung kommt ohne Gedankenstrich aus | `src/i18n/ui.ts` (`disclosure`) |
| `LabFigure` als Rahmen der Hero-Demo | Double Pendulum kann später ohne Umbau des Hero eingesetzt werden | `src/components/LabFigure.astro`, `Hero.astro` |

## 14. September 2026: Doppelpendel statt CartPole

| Entscheidung | Grund | Schnell ändern |
| --- | --- | --- |
| Hero-Demo ist das Doppelpendel mit TQC-Policy, CartPole entfernt | Ein Modell, vier Haltungen zeigt mehr als ein balancierender Stab; vom Nutzer optisch freigegeben | `src/components/Hero.astro`; CartPole liegt in der Git-Historie |
| Physik als eigene TS-Umsetzung statt WASM-Engine | Keine neue Abhängigkeit, keine externen Requests; stimmt bis auf Rundungsfehler mit MuJoCo überein (max. \|Δ qpos\| 2,8e-14) | `src/lib/double-pendulum.ts` |
| Nur Actor-Gewichte veröffentlicht | Repo ist öffentlich; Critic, Reward, Curriculum und Trainingscode bleiben privat | `public/models/double-pendulum-policy.json` |
| Dauerlauf als Benchmark statt CI-Test | Die Vorgabe „18 von 20 Läufen à 3 min ohne Schienen-Aus“ schafft das Modell selbst nicht: MuJoCo mit `model.predict` 6/20, TS 9/20. Zwischenhaltungen oder anders getaktete Stupser änderten daran nichts. CI prüft die Umsetzung (Netz, Beobachtung, Open-Loop, 4×4-Matrix), `npm run bench:policy` misst das Modell | `package.json`, `scripts/bench-double-pendulum.ts` |
| Figur zeigt Aussetzer ehrlich | Fährt der Wagen raus, startet sie nach kurzem Fade hängend neu; kein Regler, keine vorberechnete Animation | `src/components/DoublePendulum.astro` |

Offener Punkt: Beim längeren Halten driftet der Wagen aus der Mitte, besonders deutlich beim Wechsel oben · oben → unten · unten nach mehreren Sekunden Halten (MuJoCo: nach 20 s Halten 4/10 stabil). Abhilfe wäre ein Nachtraining mit längeren Halte-Phasen und Mitten-Strafe; danach neu exportieren und `npm run test:policy` sowie `npm run bench:policy` laufen lassen.

## Rückwechsel ohne Umbau

`DESIGN_VARIANT=classic` wählt beim Start/Build die ruhigere Laborbuch-Variante. Der Name wird normal und ohne Akzent gesetzt, die Simulation hell, das Raster entfernt und die zusätzliche Messwerthervorhebung ausgeblendet. Inhalte, Routen und Physik bleiben identisch. Build und Browserdarstellung der Alternative wurden geprüft.

Die Variante ist eine Umsetzung der ursprünglichen Gestaltungsregeln, kein pixelgenauer Nachbau der damaligen generierten Bilder. Die neuen sachlichen Texte bleiben auch beim Designwechsel erhalten.

Die Dateigrenzen sind absichtlich klein: UI-Strings und Routen unter `src/i18n/`, ein Projekt pro JSON-Datei, jede Sektion als Komponente, reine Simulationslogik unter `src/lib/double-pendulum.ts`, Darstellung getrennt davon in `DoublePendulum.astro`.

## Freigegeben: Astro-Update und Farbschalter

Der Nutzer hat das Sicherheitsupdate ausdrücklich freigegeben. Astro wurde von 6.4.8 auf 7.3.2 aktualisiert. `npm audit` meldet nun keine bekannten Sicherheitslücken. Build, Inhaltsvergleich, CartPole-Tests und Browserprüfungen bestehen nach dem Update. Grundlage: [offizielle Astro-7-Migration](https://docs.astro.build/en/guides/upgrade-to/v7/). Der aktuelle Audit-Snapshot steht in `docs/qa/npm-audit.json`.

Der Projekt-Introtext wurde auf ausdrücklichen Wunsch in beiden Sprachen entfernt. Der Farbschalter sitzt als kleiner Textbutton in der Kopfzeile. Die Beschriftung nennt das Ziel des nächsten Klicks. Ohne eigene Auswahl gilt das Systemfarbschema; eine eigene Auswahl bleibt über Seiten- und Sprachwechsel erhalten. Dafür wird genau ein Local-Storage-Wert `portfolio-theme` verwendet. Kein Cookie und keine Übertragung. Die Datenschutzerklärung beschreibt dies in beiden Sprachen. Ohne JavaScript bleibt der Button verborgen; ohne verfügbaren Speicher funktioniert das Umschalten weiterhin auf der aktuellen Seite.

Die Experimentfläche bleibt in beiden Farbschemata dunkel. Darstellung, Inhalte und Physik wurden ansonsten beibehalten. Theme-Komponente, Farbvariablen und Designvariante bleiben unabhängig austauschbar.

## Ehrliche Einschätzung und nächste sinnvolle Verbesserungen

- Die neue Gestaltung hat mehr Charakter; nach dem Hero bleibt die Seite bewusst textbetont. Als nächste Designentscheidung würde ich zuerst den Rhythmus der sechs Projekteinträge mit dem Nutzer beurteilen, nicht weitere Effekte hinzufügen.
- Auf Mobil folgt die vollständige Simulation unterhalb des ersten Bildschirms. Text und Links sind vorher lesbar. Das vermeidet zu kleine Schrift und einen zu flachen Simulationsbereich.
- Keine offenen Platzhalter für Name, Kontakt, Lebenslauf, Projekttexte oder Rechtsseiten. Repository und GitHub-Pages-Konfiguration sind eingerichtet.
- Der Browser-Testbetrieb war Chromium-basiert. Ein echter Safari-/iOS-Durchlauf und ein echter Hintergrundtab-Test in einem sichtbaren Browser bleiben zusätzliche Geräteprüfungen. Die Reaktion auf das Visibility-Signal wurde separat erfolgreich geprüft.

## Entwürfe und technische Grundlage

Die überarbeiteten Entwürfe liegen unter `docs/design/revision-02/`. Prompts und Auswahl sind dokumentiert. Ein von der Bildgenerierung erfundener Name samt Randtexten wurde verworfen und nicht übernommen.

Verwendete offizielle Dokumentation: [Astro Content Loader API](https://v6.docs.astro.build/en/reference/content-loader-reference/), [Astro-v6-Migration](https://v6.docs.astro.build/en/guides/upgrade-to/v6/), [withastro/action](https://github.com/withastro/action). Die bestehenden lokalen Vercel-Web-Interface-Guidelines wurden für den abschließenden Review verwendet.

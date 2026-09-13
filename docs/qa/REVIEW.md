# Abschlussprüfung

Nachprüfung mit Astro 7.3.2 und Farbschalter: Build, Inhaltsvergleich und alle drei Policy-Tests bestanden. Alle 16 Bildschirm-/Sprach-/Farbkombinationen erneut aufgenommen und visuell geprüft, ohne Überlauf oder Accessibility-Findings. Beide Tastaturdurchläufe umfassen jetzt 20 Ziele. `theme-checks.json` bestätigt manuelle Auswahl, Tastatur, System-Fallback, Seiten-/Sprachwechsel, blockierten Speicher und Verhalten ohne JavaScript. Review der geänderten Komponenten gegen die lokalen Web-Interface-Guidelines: keine offenen Findings. `npm-audit.json` enthält jetzt null bekannte Sicherheitslücken. Der nachfolgende Lighthouse-Bericht dokumentiert den früheren Gestaltungsstand vor dem neuen Schalter.

Stand: 13. September 2026. Geprüft wird die statisch gebaute Website, nicht der Entwicklungsserver.

## Build und Inhalt

- `npm run build`: 0 Fehler, 0 Warnungen, 0 Hinweise; sieben statische Seiten einschließlich 404.
- `node scripts/verify-content.mjs`: Rechtsseiten in DE/EN stimmen nach Entfernen der Markdown-/HTML-Auszeichnung wörtlich mit den Quellen überein. Alle zwölf Projektbeschreibungen stimmen mit CONTENT.md überein.
- Hero und Über mich wurden nach ausdrücklichem Nutzerfeedback in CONTENT.md aktualisiert. Keine neuen biografischen Fakten.
- Favicon mit echten Instrument-Serif-Glyphen als Pfade, OG-Bild 1200 × 630. Beide wurden visuell überprüft; eine zunächst fehlerhafte Glyphenorientierung wurde korrigiert.
- CV, Modell, Favicon, OG-Bild, robots.txt und Sitemap sind unter den vorgesehenen Pfaden erreichbar.

## Browsermatrix

Chromium über den vorhandenen playwright-cli. Deutsch und Englisch, jeweils 390 × 844, 768 × 1024, 1366 × 768 und 1440 × 900, hell und dunkel. Alle 16 Viewport-Screenshots wurden visuell angesehen. Ergänzend: vollständige deutsche Seiten, Projektausschnitte, mobile Hero-Gesamtansicht, Rechtsseiten und Classic-Variante.

- Kein horizontaler Überlauf; alle Namen in genau zwei Zeilen; Fließtext 17 px.
- Der Desktop-Hero endet bei 1366 × 768 auf ungefähr y=744 einschließlich unterem Abstand.
- 6 Projekte auf beiden Sprachversionen.
- Keine WCAG-A/AA-Verstöße in axe-core für diese Prüfmatrix oder die vier Rechtsseiten. Das ist ein automatisierter Teilcheck, kein vollständiger Barrierefreiheitsnachweis.
- Keine externen Requests beim Laden. Keine JavaScript-Laufzeitfehler im normalen Betrieb.
- Jeder der 19 Tastaturschritte pro Sprache hat sichtbaren Fokus. Weiches Scrollen wurde entfernt und fokussierte Einblendbereiche bleiben sichtbar.
- Sprachumschalter und Rechtsseiten-Alternates führen zur passenden Sprachversion.
- Ein früher langer Element-Screenshot zeigte einen Aufnahmefehler des Skip-Links. Die finale Ansicht wurde als normaler Viewport-Screenshot geprüft; der Skip-Link liegt ohne Fokus außerhalb des Viewports und ist mit Tab sichtbar.

Maschinenlesbar: browser-matrix.json und interactions.json. Screenshots unter screenshots/ werden lokal aufbewahrt, nicht mit Git committed oder durch Astro ausgeliefert.

## CartPole

- Reine Physik-/Policy-Tests: expliziter Gymnasium-Euler-Referenzschritt, korrektes Argmax-Verhalten, 20 reproduzierbare Läufe zu je 30.000 Schritten. Alle Läufe überstehen zehn Minuten mit einem zufälligen Impuls ±0,6 rad/s alle fünf Sekunden.
- Browser: Anstupsen per Tastatur, Pause und Fortsetzen, Pause außerhalb des Viewports, Reduced-Motion-Start mit Abspielen-Button.
- Ohne JavaScript: sechs Projekte sichtbar und statisches SVG vorhanden. Keine nutzlosen Simulationssteuerungen oder dauerhafte Lademeldung.
- Bei fehlgeschlagenem Modellabruf: statisches SVG und verständliche Fehlermeldung, keine defekten Steuerelemente.
- Hintergrundtab-Einschränkung: Der Headless-Browser meldet selbst beim Tabwechsel weiterhin visibilityState=visible. Deshalb wurde ergänzend das Visibility-Signal injiziert; der Handler stoppt und startet korrekt. Ein realer Tabwechsel in einem sichtbaren Browser ist hier nicht als bestanden behauptet. Details: extra-checks.json.

## Lighthouse

Lokaler mobiler Bericht: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1,8 s, CLS 0, TBT 0 ms. Der vollständige Bericht ist lighthouse-mobile.json.

Die CLI meldete nach Erstellung des Berichts beim Löschen ihres temporären Windows-Browserprofils EPERM. Die Messung und der Bericht liegen vollständig vor; der Aufräumfehler wird nicht als erfolgreicher CLI-Exit ausgegeben. Die Werte gelten für den lokalen Prüfaufbau, nicht als Garantie für GitHub Pages oder jedes Endgerät.

## Web-Interface-Guidelines-Review

Alle Dateien unter src/ wurden gegen die lokale Richtlinienkopie geprüft. Behobene Findings:

- src/styles/base.css: weiches Scrollen verursachte vorübergehend nicht sichtbaren Fokus; entfernt. Fokussierte Reveal-Bereiche werden sofort sichtbar.
- src/layouts/Base.astro: Layout-Lesezugriffe vor den Schreibzugriffen gebündelt.
- src/components/CartPole.astro: zugängliche Beschreibung, native Buttons, jederzeitige Pause, Reduced Motion und No-JS-Fallback vorhanden.
- src/components/Contact.astro: englisches Email-Label korrigiert.
- src/content.config.ts: nicht veralteten Astro-Zod-Import verwendet.

Semantik, Überschriftenhierarchie, Linkziele, Tabelle mit Caption und Zeilenüberschriften, Fokus, Lang-Attribute, Farbschemata, Bewegung und lokale Ressourcen geprüft. Nicht anwendbare Formular-/Framework-Regeln wurden nicht künstlich eingeführt. Erste Person und deutsche Überschriftenkonventionen folgen ausdrücklich CONTENT.md statt abweichender generischer Stilregeln.

## Anti-Template-Check: DESIGN.md Abschnitt 8

1. Zentrierter Hero mit Verlauf-Blob oder Glow: nicht vorhanden. Hero linksbündig, keine Verläufe oder Leuchteffekte.
2. Karten-Grids, Bento, Glas- oder Doppelrand-Karten: nicht vorhanden. Einträge mit Linien; die eigenständige Simulation ist eine funktionale Zeichenfläche.
3. Pills und dekorative Eyebrows: nicht vorhanden. CartPole/PPO bezeichnen das tatsächliche Experiment.
4. Skill-Balken, Prozentangaben, Sterne: nicht vorhanden. Kompetenzen als Definitionsliste.
5. Emojis und Gedankenstriche als Stilmittel: nicht vorhanden. Der Bereich 17–19 Token/s bleibt als sachlicher Messwertbereich bestehen.
6. Stockfotos, Platzhalterfotos, Deko-Bilder und Porträt: nicht vorhanden. Generierte Entwürfe werden nicht in die Website eingebunden.
7. Marketingfloskeln: keine der gesperrten Formulierungen in den veröffentlichten Seitentexten.
8. Typewriter, rotierende Wörter, Partikel: nicht vorhanden. Nur die echte Simulation und die vorgegebene Einblendung bewegen sich.
9. Fake-Statistiken: nicht vorhanden. Wächter-Werte stammen aus CONTENT.md, Simulationswerte sind tatsächliche Zustände.

Gezielte Änderungen am ursprünglichen Design nach Nutzerfeedback sind im vorderen Abschnitt von DESIGN.md dokumentiert: dunkle Experimentfläche, kursive Akzenttypografie, dezente Akzentlinien und Hervorhebung des echten Messwerts.

## Offener technischer Befund

Ein verbleibender npm-Audit-Befund für das explizit vorgeschriebene Astro 6. Korrigierte Unterabhängigkeiten sind gesetzt. Empfehlung und Versionsentscheidung stehen in docs/DECISIONS.md. Nicht veröffentlicht, nicht gepusht.

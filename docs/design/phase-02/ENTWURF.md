# Laborbuch: Plan und Entwurfsreview

Stand: 13. September 2026. Phase 1 und 2. Umsetzung ab Phase 3 erst nach ausdrücklichem Okay des Nutzers.

## Phase 1: Plan

1. Reihenfolge: Kopfzeile, Hero, Über mich, Gerade dran, Projekte, Hackathons, Womit ich arbeite, Kontakt, Footer.
2. Layout: maximal 1120 px, auf Desktop ab 900 px etwa 180 px Metaspalte mit Abstand zur Inhaltsspalte; auf Mobil gestapelte Metadaten.
3. Stil: DESIGN.md ist verbindlich. Instrument Serif, Geist, Geist Mono, Papierfarben, Haarlinien und ein sparsamer Akzent. Keine Karten oder Deko-Bilder.
4. Hero: maximal zwei Namenszeilen, vorgegebener Text, Metazeile und GitHub, LinkedIn, Lebenslauf. CartPole rechts, mobil darunter. Desktop-Hero muss auf 1366 × 768 vollständig lesbar sein.
5. Komponenten: Header, LangSwitch, Hero, CartPole, ProjectEntry, Datasheet, NowEntry, SkillList, Contact und Footer.
6. Dateien: src/components/, src/layouts/Base.astro, src/styles/tokens.css und base.css, src/i18n/ui.ts und utils.ts, src/content/projects/, src/content.config.ts, src/pages/.
7. Projekte: sechs Dateien mit de/en-Feldern als Content Collection. Reihenfolge und Fakten ausschließlich aus docs/CONTENT.md. Öffentlicher Projektcode nur für n8n.
8. Astro 6 statisch, TypeScript strict, selbst gehostete Fonts, vorhandene Dokumente und öffentliche Dateien erhalten. Kein Zugriff auf _private/.
9. i18n: Deutsch auf /, Englisch auf /en/, Rechtsseiten mit passenden Übersetzungsrouten. Sprachwechsel zur entsprechenden Seite, lang, hreflang, canonical. Rechtsinhalte wörtlich ohne Entwurfshinweise.
10. CartPole: lokale PPO-Gewichte, unnormalisierte Zustände, tanh je versteckter Schicht, lineare Aktionsausgabe und Argmax. Gymnasium-Euler-Physik mit tau 0.02 und den Parametern der JSON-Datei.
11. Darstellung und Bedienung: requestAnimationFrame mit festem Physikschritt, devicePixelRatio, Impuls ±0.6 rad/s, Grenzwert-Reset mit Fade, Viewport-/Tab-Pause, SVG ohne JS und Abspielen bei reduzierter Bewegung. Zusätzlich jederzeit ein Pausieren-Textbutton.
12. Nach Freigabe: alle Inhalte, Metadaten, OG-Bild und Favicon umsetzen, vollständige Build-/Browser-/Tastatur-/Netzwerkprüfungen, GitHub-Actions-Deployment vorbereiten, erster Commit ohne Push.

## Unklarheiten und Prioritätsentscheidungen

- Kontakt: DESIGN.md nennt drei Links, CONTENT.md vier inklusive CV. Vorschlag: LinkedIn, E-Mail und GitHub im Kontakt; CV bleibt im Hero. Diese Entscheidung ist noch offen.
- GitHub: Der ausdrücklich vorgegebene Profillink ist von Links auf Projektquellcode zu unterscheiden. Nur n8n erhält einen Projekt-Code-Link.
- Der Stil der CartPole-Steuerung wird nicht ausdrücklich festgelegt. Anstupsen und Pausieren werden echte Buttons mit schlichter Textoptik; der umrandete Lebenslauf-Link bleibt der einzige auffällige Button-Stil.
- Widersprüche der Skills zu Fotos, Bento, Pill-Tags, GSAP, Drittanbieter-Fonts, Versalien und Textperspektive sind durch DESIGN.md und AGENTS.md aufgelöst. Es wird keine weitere Stilrichtung daraus übernommen.
- Kein fehlender Faktenplatzhalter in den für diese Entwürfe verwendeten Inhalten gefunden.

## Bildqualität und Grenzen

Die Bilder wurden mit dem integrierten image_gen erstellt und visuell geprüft. Die vollständigen Prompts und zwei Überarbeitungen stehen in PROMPTS.md.

Die Bildgenerierung hat die gewünschten Ausgabeabmessungen nicht exakt eingehalten:

| Bild | Angefragte Referenz | Tatsächliches PNG |
| --- | --- | --- |
| 01-desktop-hero.png | 1440 px Desktopbreite | 1536 × 1024 |
| 02-desktop-projekte.png | 1440 px Desktopbreite | 1330 × 1182 |
| 03-mobile-hero.png | 390 CSS-px Mobilbreite | 941 × 1672 |
| 04-mobile-waechter.png | 390 CSS-px Mobilbreite | 855 × 1840 |

Diese Rasterbilder sind visuelle Entwürfe, keine maßhaltigen Browser-Screenshots. Exakte Schriftfamilien, Farben und CSS-Maße lassen sich aus generierten Bildern nicht garantieren. Maßgeblich bleiben die Tokens und Skalen in DESIGN.md. Besonders die mobile Textgröße und Umbrüche sind noch kein Nachweis für die Lesbarkeit bei echten 390 px.

## 01: Desktop-Hero und Anfang Über mich

- Raster: Text und Figur stehen nebeneinander. Der folgende Abschnitt nimmt die Randspalte mit Bremen auf. Kopfzeile, Hero und Abschnittstrenner schaffen eine eindeutige Leserichtung.
- Hierarchie: Name in zwei Zeilen, darunter der konkrete Einstieg. Die feine Zeichnung fällt durch den einzelnen farbigen Stab auf. Der CV-Link ist umrandet, die anderen Links unterstrichen.
- Sollmaße: Name bis 92 px, Fließtext 17/28 px, Metadaten und Bildunterschrift 13 px. Desktopcontainer 1120 px, Figur etwa 480 × 360 px, Abstand zwischen Text und Figur etwa 64 bis 80 px.
- Sichtbare Abweichungen: Die Metazeile bleibt im Bild auf einer langen Zeile. Die Über-mich-Spalte beginnt etwas weiter rechts als im geplanten gemeinsamen Raster. Die untere Haarlinie ist länger als die Headerlinie. Alle drei Punkte müssen beim Satz nach DESIGN.md vereinheitlicht werden.
- Anti-Template: Keine Badges, keine erfundenen Kennzahlen, keine übertriebene Handlungsaufforderung. Name links und Figur rechts sind ein verbreitetes Muster, hier jedoch ausdrücklich vorgegeben und durch die echte Simulation inhaltlich begründet.
- Die angezeigten Simulationswerte sind Zustandsbeispiele aus DESIGN.md, keine behaupteten Leistungskennzahlen.

## 02: Desktop-Projekte

- Raster: Metadaten links; Titel, Beschreibung, Tabelle und Technik rechts. Die Projekttrennung läuft quer über beide Spalten. Wächter und Baulify sind vollständige, offene Einträge.
- Hierarchie: Nach der Überarbeitung ist die Abschnittsüberschrift ruhiger. Soll: h2 44 px, Projekttitel 30 px, Text 17/28 px, Daten 13 px.
- Abstände: Tabelle als zusammengehörige Messwertgruppe etwa 24 bis 32 px nach Beschreibung; Technik darunter; etwa 72 px Luft am Eintragswechsel.
- Tabelle: Vier Messwertzeilen, nur horizontale Haarlinien, Hardwarewert umgebrochen. Ohne separate Kartenfläche oder dekorative Datenblattbox.
- Noch zu verbessern: Prosa wirkt trotz Überarbeitung breiter als die vorgegebenen 64ch. Die seitlichen Ränder und die Metaspaltenbreite sind nur angenähert. Beim späteren Satz strikt begrenzen, nicht vom Bild aus übernehmen.
- Anti-Template: Die Fakten und Messwerte ersetzen eine übliche Projektkarten-Galerie. Keine Projektbilder, fremden Logos oder Links für private Projekte.

## 03: Mobiler Hero

- Raster: Name und Sprachwahl in der ersten Kopfzeile, drei Anker in einer zweiten. Hero-Text, Links, Zeichnung, Messwerte, Steuerung und Bildunterschrift folgen untereinander.
- Die ausgelassene Arbeitgeberangabe wurde in der zweiten Generation korrigiert. Die Metazeile enthält jetzt den vorgegebenen Text mit KUKA.
- Sollmaße: 20 px Seitenrand, Name 48 px in zwei Zeilen, Fließtext 17/28 px, Metadaten 13 px. Figur 350 × 262,5 px bei 390 px Viewport. Bedienelemente mit ausreichend großer Klickfläche.
- Noch zu verbessern: Der generierte Fließtext wirkt auf echte 390 px heruntergerechnet zu klein und bricht weiterhin in nur drei Zeilen um. Der Rahmen ist sichtbar flacher als 4:3. Die tatsächliche Umsetzung braucht dadurch mehr Höhe als diese Abbildung.
- Der Desktop-Erstbildschirm ist ausdrücklich höhenbeschränkt; mobil darf die vollständige Figur mit Bildunterschrift über den ersten Bildschirm hinausgehen.
- Anti-Template: Kein Hamburger-Menü, keine App-Leiste, keine CTA-Pill. Die wiederholte volle Namensangabe im Header ist etwas dominant, folgt aber der Vorgabe.

## 04: Mobiler Wächter-Eintrag

- Raster: 20 px Zielseitenrand, Metadaten oberhalb des Titels, Beschreibung über volle Breite. Datenblatt bleibt zweispaltig mit umgebrochenen Werten.
- Hierarchie: Abschnittsüberschrift und Projektname sind deutlich getrennt. Soll: 32 px h2, Projekttitel nach DESIGN.md bei 390 px etwa 24 px, Fließtext 17/28 px, Mono 13 px.
- Abstände: Der Raum zwischen Abschnittsintro und Projektmetadaten ist im Bild übergroß. Eine ruhigere Staffelung von etwa 40 bis 48 px ist angemessener. Der Projekttitel ist im Bild ebenfalls zu groß gegenüber der Skala.
- Die Messwerte sind vollständig sichtbar. Lange Tabellenwörter wie Personenerkennung benötigen bei 390 px gezieltes Umbruchverhalten, ohne den Text unter 13 px zu verkleinern oder horizontal zu scrollen.
- Anti-Template: Keine Kachel, kein Status-Badge, keine Symbolreihe. Der Statuspunkt und zusätzliche Mittelpunkte stehen im Bild etwas dicht; im späteren Satz reicht eine klare Trennung.

## Review dieser Phase

Geprüft gegen DESIGN.md, docs/CONTENT.md und die lokale Kopie docs/guidelines/vercel-web-interface-guidelines.md.

- Visuell keine Karten, Bento-Grids, Glaskarten oder Doppelränder.
- Kein zentrierter Hero, Glow, Neon oder dekorativer Verlauf. Die Rasterbilder zeigen leichte generative Papierunruhe; Ziel bleibt eine einheitliche Papierfläche.
- Keine Pills, nummerierten Meta-Labels oder Versalien-Eyebrows.
- Keine Skill-Balken, Sterne oder erfundenen Prozentangaben.
- Keine Emojis oder Gedankenstriche als Stilmittel. Der Bereich 17–19 Token/s ist ein Messwertbereich aus CONTENT.md.
- Keine Fotos, Platzhalterfotos, Porträts oder dekorativen Illustrationen. Die einzige Zeichnung stellt die ausdrücklich gewünschte CartPole-Simulation dar.
- Keine Marketingfloskeln oder erfundenen Erfolge.
- Bewegung und Effekte sind in statischen Bildern nicht prüfbar; geplant sind nur CartPole und die vorgegebene Einblendung.
- Kein KUKA-Logo oder offizielle Markengestaltung. Der Stabakzent folgt dem festgelegten gebrannten Orange.
- Laufende Animation erhält nach Richtlinienreview einen jederzeit verfügbaren Pausieren-Button.
- DOM-Semantik, tatsächliche Kontraste, Fokuszustände, Touchflächen, Bewegungseinstellungen und Netzwerkzugriffe bleiben Prüfaufgaben der Implementierungsphase.

Es wurde kein Website-Code geschrieben, kein Projekt initialisiert, kein Commit erzeugt und nichts veröffentlicht. Build und Browserprüfungen sind in dieser Entwurfsphase noch nicht durchführbar. Hier endet die Arbeit bis zum Nutzerfeedback.


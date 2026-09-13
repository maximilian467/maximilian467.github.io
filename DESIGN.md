# DESIGN.md: Laborbuch

Design-System für maximilian467.github.io. Die Richtung heißt **Laborbuch**: die Seite fühlt sich an wie das saubere Notizbuch eines Ingenieurs. Warmes Papier, eine ruhige Serifenschrift für Überschriften, Monospace für Daten und Messwerte, feine Linien statt Karten. Ruhig, hochwertig, ehrlich. Nicht verspielt, nicht laut.

Leitsatz: **Die Inhalte sind konkret, also darf das Design leise sein.**

## Überarbeitung nach Nutzerfeedback vom 13.09.2026

Der Nutzer wünscht ausdrücklich mehr visuellen Charakter und einen professionelleren Einstieg. Diese gezielten Änderungen haben Vorrang vor den entsprechenden ursprünglichen Detailregeln unten:

- Richtung: technisches Portfolio mit Experimentfläche. Der Hero behält zwei Spalten, setzt den Nachnamen aber in Instrument Serif Italic und Akzent-Textfarbe. Maximal zwei Namenszeilen und weiterhin die vorhandene Schriftgrößenskala.
- Die CartPole-Zeichnung liegt auf einer durchgehend dunklen Fläche (#1C1B18), auch im hellen Farbschema. Ein feines Koordinatenraster und Teilstriche auf der Schiene vermitteln den Simulationsraum. Keine Schatten oder Verläufe. Die Zeichnung bleibt ungefüllt; Stab #E0703F, Linien #ECE8DF, sekundärer Text #BDB7AC, Raster #34312B.
- Steuerung und Live-Werte sind direkt in die Experimentfläche integriert. Bildunterschrift bleibt außerhalb. Der eigentliche Zeichenbereich hat etwa 4:3.
- Abschnittsüberschriften erhalten eine kurze Akzentlinie und dürfen in einer eigenen linken Spalte stehen. Projekte behalten ihre Randspalte für Metadaten.
- Der echte Wächter-Messwert ~2,6 s darf als typografischer Schwerpunkt neben der zugänglichen Datenblatt-Tabelle erscheinen. Die Messwertfläche verwendet --paper-2, ohne Kartenrand oder Rundung.
- Keine erfundenen Zahlen, dekorativen Randtexte, Fotos, Karten-Grids, Pills, GSAP oder Effekthintergründe. Farbkontrast, gute Abstände und echte Interaktion tragen die Überarbeitung.
- CONTENT.md enthält die überarbeiteten Texte in beiden Sprachen. Keine neuen biografischen Fakten.
- Weiteres Nutzerfeedback: kein Introtext im Projektabschnitt. Ein Textbutton in der Kopfzeile wechselt zwischen Hell und Dunkel. Ohne gespeicherte Auswahl gilt das Systemfarbschema; eine ausdrücklich gewählte Darstellung wird lokal gespeichert. Die Experimentfläche bleibt in beiden Modi dunkel.

---

## 1. Charakter

- Wirkt wie: Laborbuch, technisches Datenblatt, gut gesetztes Buch.
- Wirkt nicht wie: SaaS-Landingpage, Template, Dark Mode mit Neon, „AI-Startup".
- Eine einzige Besonderheit darf auffallen: das live balancierende CartPole im Hero. Alles andere tritt zurück.

## 2. Farben

Warm-monochrom, eine Akzentfarbe, sparsam eingesetzt (Statuspunkt „läuft", Link-Hover, Fokus-Ring, der Stab im CartPole).

```css
:root {
  --paper:      #F6F4EF; /* Hintergrund */
  --paper-2:    #EFECE5; /* leicht abgesetzte Flächen, z. B. Canvas-Hintergrund */
  --ink:        #1C1B18; /* Haupttext, nie reines Schwarz */
  --ink-muted:  #6A665E; /* Sekundärtext, Metadaten */
  --rule:       #DEDAD1; /* Haarlinien */
  --accent:     #B4471D; /* gebranntes Orange, NICHT KUKA-Orange */
  --accent-ink: #8F3614; /* Akzent auf hellem Grund für Text (Kontrast AA) */
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper:      #151412;
    --paper-2:    #1C1B18;
    --ink:        #ECE8DF;
    --ink-muted:  #9C978C;
    --rule:       #2E2C28;
    --accent:     #E0703F;
    --accent-ink: #E88A5E;
  }
}
```

Verboten: Verläufe, Neon, Glow, Glassmorphism, farbige Flächen-Sections, lila/blau als Primärfarbe.

Optional: ein kaum sichtbares Papierkorn (Noise, Opazität ≤ 0.03) auf einem `position: fixed; pointer-events: none` Layer.

## 3. Typografie

Selbst gehostet (Fontsource oder Astro Fonts API), keine Anfragen an Google.

| Rolle | Schrift | Einsatz |
|---|---|---|
| Display / Überschriften | **Instrument Serif** (Fallback: Georgia, serif) | Name, h2, Projekttitel |
| Text / UI | **Geist** (Fallback: system-ui) | Fließtext, Navigation, Buttons |
| Daten | **Geist Mono** (Fallback: ui-monospace) | Datum, Status, Messwerte, Tech-Listen, Bildunterschriften |

Skala (fluid):
- Name im Hero: `clamp(3rem, 7vw, 5.75rem)`, line-height 1.0, letter-spacing -0.02em, max. 2 Zeilen
- h2: `clamp(2rem, 3.6vw, 2.75rem)`, line-height 1.1
- Projekttitel: `clamp(1.5rem, 2.4vw, 1.875rem)`
- Fließtext: 1.0625rem / 1.65, max-width 64ch
- Mono-Metadaten: 0.8125rem, letter-spacing 0.01em, `--ink-muted`

Inter, Roboto, Arial, Open Sans sind verboten. Keine Versalien-Eyebrows über Überschriften.

## 4. Layout

- Container: max. 1120px, Seitenrand `clamp(1.25rem, 5vw, 3rem)`.
- **Randspalte wie im Laborbuch:** Auf Desktop (≥ 900px) ein Zwei-Spalten-Raster: links eine schmale Metaspalte (ca. 180px) für Datum, Status, Rolle; rechts der Inhalt. Auf Mobil stapelt sich die Metazeile über dem Inhalt.
- Abschnitte sind durch eine volle Haarlinie (`1px solid var(--rule)`) und großzügigen Abstand getrennt (`clamp(5rem, 10vw, 8rem)` vertikal).
- Keine Karten-Grids, keine Bento-Boxen, keine Karten in Karten. Projekte sind **Einträge** untereinander, getrennt durch Linien.
- Linksbündig. Nichts zentriert außer der CartPole-Figur innerhalb ihres Rahmens.

## 5. Seitenaufbau

1. **Kopfzeile:** Links „Maximilian Köhlenbeck" (Geist, klein). Rechts Anker (Projekte, Gerade dran, Kontakt) und Sprachumschalter `DE / EN` als Text, aktive Sprache in `--ink`, andere in `--ink-muted`. Nicht sticky oder nur dezent sticky ohne Blur-Pill.
2. **Hero:** Desktop zweispaltig. Links: Name (Serif, groß), ein Satz, Metazeile in Mono, Links (GitHub, LinkedIn, Lebenslauf). Rechts: CartPole-Figur mit Bildunterschrift „Abb. 1: …". Mobil: Text, dann Figur. Erster Screen muss auf 1366×768 vollständig lesbar sein.
3. **Über mich:** zwei bis drei kurze Absätze, Randspalte leer oder mit „Bremen".
4. **Gerade dran:** Einträge mit Metaspalte „Stand Sept. 2026" / Status.
5. **Projekte:** kurzer Intro-Satz, dann 6 Einträge.
6. **Hackathons:** eine Zeile pro Hackathon.
7. **Womit ich arbeite:** Definitionsliste (`<dl>`), keine Balken, keine Sterne, keine Pills.
8. **Kontakt:** ein Satz, drei Links.
9. **Footer:** Mono, klein: ©, Impressum, Datenschutz, „Gebaut mit Astro und KI-Agenten".

## 6. Komponenten

### Projekteintrag
```
[Metaspalte]            [Inhalt]
2026                    Wächter                      (Serif)
● fertig                Beschreibung, 3–5 Sätze      (Geist)
Allein
                        ┌ Datenblatt ─────────────────┐  (nur wenn Messwerte da sind)
                        │ Erstes Wort     ~2,6 s      │  Mono, zweispaltige Tabelle,
                        │ Personenerk.    17,3 ms     │  Haarlinien zwischen Zeilen
                        └─────────────────────────────┘
                        Python · faster-whisper · …  (Mono, muted, mit · getrennt)
                        Code ansehen ↗               (nur wenn öffentlich)
```
- Statuspunkt: 6px Kreis. `läuft` = `--accent`, `fertig` / `Prototyp` / `täglich im Einsatz` = `--ink-muted`.
- Tech als Text mit Mittelpunkt getrennt, **keine Pill-Badges**.
- Das Datenblatt ist eine echte `<table>` mit `<caption>` (visuell versteckt).

### Links und Buttons
- Primäre Links im Hero: Text mit Unterstreichung (`text-underline-offset: 0.2em`, 1px), Hover: Farbe `--accent-ink`. Externe Links mit `↗`.
- Ein einziger „Button"-Stil für „Lebenslauf (PDF)": 1px Rahmen `--ink`, Radius 4px, kein Schatten, Hover: invertiert.
- Keine Pill-Buttons, keine Icon-in-Kreis-Buttons.

### CartPole-Figur (Signatur-Element)
- Canvas in einem Rahmen: 1px `--rule`, Hintergrund `--paper-2`, Seitenverhältnis ca. 4:3.
- Strichzeichnung: Schiene als Haarlinie, Wagen als Rechteck-Kontur in `--ink`, Stab in `--accent`, kleine Achse. Keine Farbfüllung, keine Schatten. Sieht aus wie eine Skizze im Laborbuch.
- Darunter Bildunterschrift in Mono (siehe CONTENT.md) und dezente Live-Werte: `θ = 0.012 rad · x = -0.08 m · Schritt 1.204`.
- Interaktion: Klick/Tap oder Taste auf der Figur = Stups (Impuls auf den Stab). Button „Anstupsen" für Tastatur. Wenn der Stab fällt oder der Wagen rausfährt: sanft zurücksetzen.
- `prefers-reduced-motion`: pausiert, Standbild + „Abspielen"-Button.
- Pausiert, wenn nicht im Viewport (IntersectionObserver) oder Tab verborgen.
- Die Policy ist echt: Gewichte in `public/models/cartpole-policy.json` (siehe AGENTS.md).

### Sprachumschalter
- `DE / EN`, als echte Links auf die jeweilige Sprachversion derselben Seite, mit `hreflang` und `lang`.

## 7. Bewegung

Kaum sichtbar.
- Beim ersten Erscheinen: Abschnitte faden ein (`opacity 0→1`, `translateY 12px→0`, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`), einmalig, per IntersectionObserver.
- Hover: nur Farbe/Unterstreichung, 150ms.
- Kein GSAP, kein Scroll-Jacking, kein Parallax, keine Marquees, kein Cursor-Effekt, keine Typewriter-Effekte.
- Alles respektiert `prefers-reduced-motion`.

## 8. Verbotsliste (Anti-KI-Look)

- Zentrierter Hero mit Verlauf-Blob oder Glow
- Karten-Grids, Bento-Grids, Glaskarten, Doppelrand-Karten
- Pill-Badges, Eyebrow-Labels wie „ABOUT ME", „SECTION 01", „01 / Projekte"
- Skill-Balken, Prozentangaben, Sterne-Ratings
- Emojis, Gedankenstriche als Stilmittel in Texten
- Stock-Fotos, picsum-Platzhalter, generierte Deko-Bilder, Porträtfoto
- Floskeln: „passionate", „innovativ", „nahtlos", „Elevate", „Unleash"
- Typewriter-Effekt, rotierende Wörter, Partikel-Hintergründe
- Fake-Statistiken („10+ Projekte", „100 % Einsatz")

## 9. Qualitätsregeln

- WCAG AA Kontrast in hell und dunkel.
- Sichtbarer `:focus-visible` Ring (2px `--accent`, Offset 3px). Skip-Link.
- Semantisches HTML: `header`, `main`, `section` mit Überschrift, `article` pro Projekt, `footer`.
- Lighthouse-Ziel: 100 / 100 / 100 / 100 (Performance, Accessibility, Best Practices, SEO).
- Kein Layout-Shift, Schriften mit `font-display: swap` und passenden Fallback-Metriken.
- Funktioniert ohne JavaScript (alles außer der CartPole-Animation; dort erscheint ein statisches SVG-Standbild).

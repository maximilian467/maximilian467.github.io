# Prompt für GPT-6 Astra

Den Block unten komplett in Codex (GPT-6 Astra) im Ordner `personal website` einfügen.

---

```text
Du baust meine persönliche Website. Sie ist ein Lebenslauf zum Durchklicken. Ziel: Wer mich für einen Hackathon auswählt oder mit mir netzwerken will, soll in 60 Sekunden verstehen, wer ich bin, was ich baue und wie ich denke.

Ich bin Maximilian Köhlenbeck, dualer Student Automatisierungstechnik bei KUKA und an der Hochschule Bremen. Ich baue mit KI-Agenten und interessiere mich vor allem für Robotik, Automatisierung und Physical AI. Ich habe noch keine großen Erfolge vorzuweisen, deshalb muss die Seite durch Ehrlichkeit, Konkretheit und Qualität überzeugen, nicht durch große Worte.

## Lies zuerst, komplett, bevor du irgendetwas tust

1. AGENTS.md: Stack, harte Regeln, Prüfprozess
2. DESIGN.md: Design-System „Laborbuch", verbindlich
3. docs/CONTENT.md: alle Texte und Fakten, einzige Quelle
4. docs/legal/impressum.md und docs/legal/datenschutz.md
5. Die Skills in .agents/skills/, besonders image-to-code, minimalist-ui, playwright-cli, web-design-guidelines. Welche Teile der Skills gelten und welche nicht, steht in AGENTS.md. Bei Konflikten gilt: DESIGN.md schlägt minimalist-ui schlägt alles andere.

## Arbeite in Phasen. Nach Phase 2 hältst du an und wartest auf mein Okay.

### Phase 1: Verstehen und planen (kein Code)
Fasse in maximal 15 Stichpunkten zusammen: Seitenaufbau, Komponenten, Dateistruktur, wie du i18n löst, wie die CartPole-Figur funktioniert. Liste alles auf, was dir unklar ist oder sich widerspricht, statt es zu raten.

### Phase 2: Entwürfe (image-to-code)
Generiere Design-Bilder, bevor du Code schreibst:
- Desktop 1440 breit: Hero mit CartPole-Figur plus Anfang von „Über mich"
- Desktop: Projektbereich mit zwei Einträgen, einer davon mit Datenblatt-Tabelle (Wächter)
- Mobil 390 breit: Hero und ein Projekteintrag
Die Bilder müssen DESIGN.md exakt folgen: warmes Papier, Instrument Serif für Überschriften, Geist für Text, Geist Mono für Metadaten, Randspalte, Haarlinien, eine Akzentfarbe, keine Karten, keine Pills, kein Foto, echte Texte aus docs/CONTENT.md statt Platzhaltern.
Analysiere danach jedes Bild: Raster, Abstände, Schriftgrößen, Hierarchie, was noch nach KI-Template aussieht. Zeig mir die Bilder mit der Analyse. STOPP. Warte auf mein Feedback.

### Phase 3: Grundgerüst
- Astro 6 im aktuellen Ordner aufsetzen (die vorhandenen Dateien AGENTS.md, DESIGN.md, docs/, public/, .agents/, _private/, .gitignore nicht löschen oder überschreiben).
- TypeScript strict, reines CSS mit den Tokens aus DESIGN.md, selbst gehostete Schriften.
- i18n-Routing: / Deutsch, /en/ Englisch, Sprachumschalter „DE / EN" als Text oben rechts, hreflang-Alternates, lang-Attribut.
- Base-Layout mit Title, Description, Open-Graph (einfaches, typografisches og.png im Laborbuch-Stil, 1200×630), Favicon als SVG (Monogramm „MK" in Instrument Serif, kein Emoji), canonical, sitemap, robots.txt.

### Phase 4: Inhalte und Komponenten
- Alle Abschnitte in der Reihenfolge aus DESIGN.md Abschnitt 5, mit den Texten aus docs/CONTENT.md, auf Deutsch und Englisch.
- Projekte als Content Collection (eine Datei pro Projekt mit de/en-Feldern), damit ich später leicht Projekte ergänzen kann.
- Komponenten: Header, LangSwitch, Hero, ProjectEntry (mit Metaspalte, Statuspunkt, optionaler Datasheet-Tabelle, Tech-Zeile, optionalem Link), NowEntry, SkillList (dl), Contact, Footer.
- Rechtsseiten /impressum, /datenschutz, /en/legal-notice, /en/privacy mit den Texten aus docs/legal/. Die Texte sind vollständig ausgefüllt, übernimm sie wörtlich (Überschriften als h1/h2, keine Entwurfs-Hinweise aus den Zitatblöcken übernehmen).
- Lebenslauf-Link auf /cv/maximilian-koehlenbeck-lebenslauf.pdf. Die Datei liegt bereits in public/cv/.

### Phase 5: CartPole-Figur
Das ist das einzige auffällige Element der Seite und muss perfekt sein.
- Lade public/models/cartpole-policy.json. Das sind die echten Gewichte meiner PPO-Policy. Forward-Pass und Physik genau wie in AGENTS.md beschrieben (Gymnasium CartPole-v1, Euler, tau 0.02, fester Zeitschritt, unabhängig von der Bildwiederholrate).
- Die Policy ist geprüft: Sie hält den Stab in der Simulation minutenlang, auch wenn man sie alle paar Sekunden anstupst. Wenn es in deiner Umsetzung nicht klappt, ist dein Code falsch, nicht das Modell.
- Zeichnung als Laborbuch-Skizze nach DESIGN.md, Live-Werte in Mono darunter, Bildunterschrift aus docs/CONTENT.md.
- Klick/Tap auf die Figur und ein Button „Anstupsen" / „Nudge" geben einen Impuls. Reset mit kurzem Fade, wenn der Stab fällt oder der Wagen den Rand erreicht.
- Canvas mit devicePixelRatio scharf, pausiert außerhalb des Viewports und in versteckten Tabs, prefers-reduced-motion = angehalten mit Play-Button, ohne JS ein statisches SVG-Standbild, aria-Beschreibung für Screenreader.
- Keine Library. Vanilla TypeScript.

### Phase 6: Prüfen und verbessern (Pflicht, nicht überspringen)
Führe den Prüfprozess aus AGENTS.md Abschnitt „Prüfen, bevor etwas fertig ist" vollständig aus:
- npm run build fehlerfrei
- playwright-cli: Screenshots von / und /en/ in 390×844, 768×1024, 1366×768, 1440×900, hell und dunkel. Schau dir jeden Screenshot an und vergleiche mit deinen Entwürfen aus Phase 2 und mit DESIGN.md. Behebe alles, was nicht stimmt. Wiederhole, bis nichts mehr auffällt.
- Tastatur-Durchlauf, sichtbarer Fokus, kein horizontales Scrollen, Hero-Name maximal 2 Zeilen.
- web-design-guidelines-Review über alle Dateien in src/, Findings beheben.
- Texte-Check: Jede Aussage muss in docs/CONTENT.md stehen. Keine Gedankenstriche, keine Emojis, keine Floskeln. Englisch soll klingen wie von einem Menschen geschrieben.
- Netzwerk-Check: keine externen Requests beim Laden der Seite.
- Anti-Template-Check: Geh die Verbotsliste in DESIGN.md Abschnitt 8 Punkt für Punkt durch und bestätige jeden einzeln.

### Phase 7: Deployment vorbereiten
- astro.config: site 'https://maximilian467.github.io', kein base.
- GitHub-Actions-Workflow .github/workflows/deploy.yml mit withastro/action, Deploy auf GitHub Pages bei Push auf main.
- README.md (kurz, Deutsch): lokal starten, Projekt hinzufügen, deployen.
- Git initialisieren und einen ersten Commit machen, aber NICHT pushen. Sag mir, welche Schritte ich auf GitHub machen muss (Repo maximilian467.github.io anlegen, Pages auf GitHub Actions stellen, pushen).

## Was ich am Ende von dir will
1. Kurze Zusammenfassung, was gebaut wurde.
2. Die finalen Screenshots (Desktop und Mobil, DE).
3. Liste aller offenen Platzhalter und Punkte, die ich entscheiden muss.
4. Ehrlich: Was gefällt dir selbst noch nicht, und was würdest du als Nächstes verbessern?

## Niemals
- Fakten erfinden, Platzierungen oder Zahlen hinzufügen, den 4. Platz erwähnen.
- Quellcode, Screenshots oder Links aus privaten Projekten verwenden. Einziger Code-Link: github.com/maximilian467/n8n-automation-portfolio.
- Ein Foto einbauen oder etwas aus _private/ verwenden.
- KUKA-Logo, KUKA-Orange oder etwas, das nach offizieller KUKA-Seite aussieht.
- Tailwind, React, GSAP, UI-Libraries, Google Fonts per CDN, Analytics, Cookies.
- Karten-Grids, Bento, Pills, Glassmorphism, Verläufe, Skill-Balken, Typewriter-Effekte, Emojis.
```

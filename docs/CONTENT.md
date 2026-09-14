# Inhalte der Website

Das ist die **einzige Quelle für Fakten**. Nichts erfinden, was hier nicht steht. Formulierungen dürfen leicht angepasst werden, aber der Ton bleibt: erste Person, kurze Sätze, konkret, ehrlich, kein Marketing-Sprech.

Schreibregeln für alle Texte:
- Keine Gedankenstriche (— oder –) als Stilmittel. Punkt, Komma oder Doppelpunkt nehmen. Einzige Ausnahme: der vom Nutzer wörtlich vorgegebene KI-Hinweis im Laborbuch (siehe unten).
- Keine Wörter wie „innovativ", „nahtlos", „revolutionär", „Leidenschaft", „next-level", „cutting-edge", „Synergie".
- Keine übertriebenen Aussagen. Lieber ein echter Messwert als ein Adjektiv.
- Keine Emojis.
- Den 4. Platz beim Hackathon **nicht** erwähnen.
- Kein Foto.
- Englisch ist die Standardsprache der Website. Studiengang im Englischen: „Automation Engineering“ (großgeschrieben).

---

## Meta

| | EN (Standard) | DE |
|---|---|---|
| Seitentitel | Maximilian Köhlenbeck · AI and robotics projects | Maximilian Köhlenbeck · Projekte mit KI und Robotik |
| Description | Automation Engineering student at KUKA and Hochschule Bremen. I build AI and robotics projects: reinforcement learning, local AI assistants and automation. | Dualer Student der Automatisierungstechnik bei KUKA und an der Hochschule Bremen. Ich baue Projekte mit KI und Robotik: Reinforcement Learning, lokale KI-Assistenten und Automatisierung. |
| URL | https://maximilian467.github.io/ | https://maximilian467.github.io/de/ |

Links:
- GitHub: https://github.com/maximilian467
- LinkedIn: https://www.linkedin.com/in/maximilian-k%C3%B6hlenbeck-06982b330/
- E-Mail: m.koehlenbeck@koehlenbeck.com
- CV, je nach Sprache der Seite: EN `/cv/maximilian-koehlenbeck-cv.pdf` (Quelle `docs/cv/cv-en.html`), DE `/cv/maximilian-koehlenbeck-lebenslauf.pdf` (Quelle `docs/cv/lebenslauf.html`)

---

## Hero

**DE**
- Name: Maximilian Köhlenbeck
- Überschrift: Ich studiere Automatisierungstechnik und baue Systeme mit KI und Robotik.
- Satz: Mich interessieren Reinforcement Learning, Physical AI und Systeme, die mit der realen Welt interagieren.
- Metazeile: Bremen · Duales Studium bei KUKA und an der Hochschule Bremen
- Links: GitHub · LinkedIn · Lebenslauf (PDF)
- Bildunterschrift: Abb. 1: Ein Modell, vier Haltungen. Diese Policy habe ich selbst mit TQC trainiert. Sie läuft live in deinem Browser. Wähl eine Haltung oder stups ein Pendel an.

**EN**
- Headline: Automation Engineering student building AI and robotics systems.
- Sentence: Interested in reinforcement learning, physical AI and systems that interact with the real world.
- Meta line: Bremen · Work-study program at KUKA and Hochschule Bremen
- Links: GitHub · LinkedIn · CV (PDF)
- Caption: Fig. 1: One model, four poses. I trained this policy myself with TQC. It runs live in your browser. Pick a pose or give a pole a nudge.

---

## Über mich

**DE**

Ich studiere seit Oktober 2024 dual Automatisierungstechnik. Die Theorie lerne ich an der Hochschule Bremen, die Praxisphasen verbringe ich bei KUKA.

**EN**

Since October 2024 I've been studying Automation Engineering in a dual work-study program. I learn the theory at Hochschule Bremen and spend my practical phases at KUKA.

---

## KI-gestützte Entwicklung

**DE**

Ich nutze Coding-Agenten wie Claude Code und Codex intensiv für die Implementierung. Ich konzentriere mich auf die Arbeit drumherum: Anforderungen, Systemdesign und Architektur, Experimente, Fehlersuche, Integration und die Prüfung, ob das System tatsächlich funktioniert.

**EN**

I use coding agents like Claude Code and Codex heavily for implementation. I focus on the engineering around it: requirements, system design and architecture, experiments, debugging, integration, and validating whether the system actually works.

---

## Gerade dran (Stand: September 2026)

**DE**

**KI trainieren statt nur benutzen.** Ich bringe mir gerade bei, wie man Modelle selbst trainiert. Angefangen habe ich mit Reinforcement Learning: erst ein Agent, der einen Stab auf einem Wagen balanciert, dann ein Doppelpendel auf einem Wagen, das mit einem einzigen Modell zwischen vier Haltungen wechselt (das oben auf der Seite). Jetzt geht es mit NVIDIA Isaac Lab weiter. Die Frage, die mich dabei beschäftigt: Wie bringt man einem Modell etwas so bei, dass es auch in Situationen klappt, die es nie gesehen hat?

**3D-Drucker optimieren, zusammen mit KUKA.** Ich optimiere einen 3D-Drucker und habe dafür eine Kalibrierung des Düsen-Offsets selbst eingebaut. Das Projekt läuft noch.

**EN**

**Training AI instead of just using it.** I'm teaching myself how to train models. I started with reinforcement learning: first an agent that balances a pole on a cart, then a double pendulum on a cart that switches between four poses with a single model (the one at the top of this page). Next up is NVIDIA Isaac Lab. The question on my mind: how do you teach a model something so it also works in situations it has never seen?

**Improving a 3D printer, together with KUKA.** I'm optimizing a 3D printer and built a nozzle offset calibration into it myself. The project is ongoing.

---

## Projekte

Kein Intro im Projektabschnitt. Die Arbeitsweise mit KI-Agenten wird unter „KI-gestützte Entwicklung“ beschrieben. Quellcode wird weiterhin nur verlinkt, wenn er öffentlich sein darf.

Die Projektdateien unter `src/content/projects/` können optional strukturierte Felder haben: Ziel, Was ich gebaut habe, Aufbau (Diagramm), Technische Entscheidungen, Messwerte, Was ich gelernt habe, Grenzen und nächste Schritte, sowie Links (Live-Demo, GitHub, Technischer Bericht). Nur füllen, wenn die Fakten hier stehen. Leere Felder werden nicht angezeigt.

Reihenfolge wie unten.

### 1. Wächter

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Ein Assistent, der durch eine Kamera sieht, zuhört und antwortet. Alles läuft offline auf meinem Laptop, ohne Grafikkarte, ohne Cloud. Eine Bewegungserkennung weckt die Personenerkennung erst, wenn sich etwas tut. Die Spracherkennung bekommt nur Abschnitte, in denen wirklich gesprochen wird, weil Whisper bei Stille sonst Sätze erfindet. Ziel war: Er fängt nach weniger als drei Sekunden an zu sprechen.
- **EN:** An assistant that sees through a camera, listens and talks back. Everything runs offline on my laptop, no GPU, no cloud. Motion detection only wakes the person detector when something actually happens. Speech recognition only gets segments where someone is really talking, because Whisper invents sentences when it hears silence. The goal: it starts speaking in under three seconds.
- Aufbau (aus der Beschreibung abgeleitet):
  - Bild: Kamera → Bewegungserkennung → Personenerkennung
  - Sprache: Mikrofon → nur Sprachabschnitte → faster-whisper → lokales Sprachmodell → Piper TTS
- Messwerte (Datenblatt):
  - Zeit bis zum ersten gesprochenen Wort: ~2,6 s (Ziel < 3 s)
  - Personenerkennung: 17,3 ms pro Bild (58 fps)
  - Sprachmodell: 17–19 Token/s
  - Hardware: Intel i7-13700H, 32 GB RAM, keine dedizierte GPU
- Tech: Python · faster-whisper · Piper TTS · lokales Sprachmodell · ONNX / DirectML
- Links: keine

### 2. Baulify

- Status: Prototyp · Zeitraum: seit Mai 2026 · im Team
- **DE:** Entstanden beim Smart Region Hackathon Offenburg. Eine Plattform, auf der Versorger, Kommunen und Baufirmen ihre Tiefbaumaßnahmen abstimmen. Sie zeigt Konflikte, bevor dieselbe Straße zweimal aufgerissen wird. Nach dem Hackathon habe ich weitergebaut: Eine KI liest Anfragen aus PDFs oder Freitext aus und füllt das Formular vor, Freigaben laufen über einen Link ohne Account, dazu eine Karte und eine eigene Landingpage.
- **EN:** Started at the Smart Region Hackathon Offenburg. A platform where utilities, municipalities and contractors coordinate roadworks. It shows conflicts before the same street gets dug up twice. After the hackathon I kept building: an AI reads requests from PDFs or free text and pre-fills the form, approvals work through a link without an account, plus a map and a landing page.
- Aufbau (aus der Beschreibung abgeleitet): Anfragen: PDF oder Freitext → LLM über OpenRouter → vorausgefülltes Formular
- Tech: Next.js · TypeScript · PostgreSQL · Drizzle · MapLibre · LLM über OpenRouter
- Links: keine (privates Team-Repo)

### 3. Planen-Editor

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Wie spannt man eine Plane so, dass sie keine Falten wirft? Im Editor zeichnet man die Form, setzt Befestigungspunkte und startet die Simulation. Die Plane wird zu einem Feder-Masse-Netz, Falten erscheinen als Linien und werden über einen Faltenindex messbar. Ein Assistent schlägt dann Positionen für die Befestigungspunkte vor, bei denen die Plane glatter liegt.
- **EN:** How do you mount a tarp so it doesn't wrinkle? In the editor you draw the shape, place mounting points and start the simulation. The tarp becomes a spring-mass mesh, wrinkles show up as lines and are measured with a wrinkle index. An assistant then suggests mounting point positions that make the tarp lie flatter.
- Aufbau (aus der Beschreibung abgeleitet): Form zeichnen → Befestigungspunkte setzen → Feder-Masse-Netz → Faltenindex → Vorschlag für Befestigungspunkte
- Tech: JavaScript · Canvas · Feder-Masse-Simulation · eine einzige HTML-Datei
- Links: keine

### 4. 3D-Drucker: Düsen-Offset-Kalibrierung

- Status: läuft · Zeitraum: 2026 · mit KUKA
- **DE:** Ich kenne mich mit 3D-Druck gut aus und optimiere gerade zusammen mit KUKA einen Drucker. Dafür habe ich eine Kalibrierung des Düsen-Offsets selbst eingebaut.
- **EN:** I know my way around 3D printing and I'm currently optimizing a printer together with KUKA. For that I built a nozzle offset calibration myself.
- Aufbau: nicht dokumentiert, daher kein Diagramm
- Tech: 3D-Druck · Kalibrierung
- Links: keine

### 5. Mein Wispr-Flow-Klon

- Status: täglich im Einsatz · Zeitraum: 2026 · Allein
- **DE:** Das Tool, das ich von allen hier am meisten benutze. Tastenkombination drücken, sprechen, nochmal drücken, und der Text steht da, wo der Cursor ist. In Word, im Browser, im Code-Editor. Nachgebaut nach dem Vorbild von Wispr Flow, nur dass alles lokal läuft, nichts kostet und nichts ins Internet schickt.
- **EN:** The tool I use most out of everything on this page. Press a hotkey, talk, press again, and the text appears wherever the cursor is. In Word, in the browser, in the code editor. Modeled after Wispr Flow, except everything runs locally, costs nothing and sends nothing to the internet.
- Aufbau (aus der Beschreibung abgeleitet): Tastenkombination → Sprachaufnahme → faster-whisper (small, int8, CPU) → Text am Cursor
- Tech: Python · faster-whisper (small, int8, CPU) · Windows
- Links: keine

### 6. KI-Automationen mit n8n

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Drei Automationen für kleine Firmen. Rechnungen aus PDFs auslesen und prüfen, ob die Positionen wirklich die Summe ergeben. Eingehende Mails sortieren und Antworten als Entwurf vorbereiten, nie automatisch senden. Preise und Lagerbestand in Onlineshops ohne API beobachten. Wenn die KI unsicher ist, entscheidet ein Mensch.
- **EN:** Three automations for small businesses. Extract invoices from PDFs and check that the line items actually add up to the total. Sort incoming emails and prepare replies as drafts, never send them automatically. Track prices and stock in online shops that have no API. When the AI isn't sure, a human decides.
- Aufbau (aus der Beschreibung abgeleitet): Rechnungen: Rechnung als PDF → Auslesen per LLM → Positionen gegen Summe prüfen → Mensch entscheidet bei Unsicherheit
- Tech: n8n · LLM über HTTP · Google Sheets · Airtable · Slack · Gmail
- Link: https://github.com/maximilian467/n8n-automation-portfolio (DE: „Code auf GitHub", EN: "Code on GitHub")

---

## Hackathons

- **Smart Region Hackathon Offenburg** · Mai 2026 · Daraus entstand Baulify.
- EN: **Smart Region Hackathon Offenburg** · May 2026 · This is where Baulify started.

(Keine Platzierung erwähnen.)

---

## Laborbuch / Lab Notes

Technische Berichte zu Projekten und Experimenten. Keine Artikel erfinden. Aufbau und Vorlage: `docs/LAB-NOTES.md`.

Veröffentlicht:
- `waechter` (Englisch, 14.09.2026): „Wächter: an offline voice-and-vision assistant for my front door". Quelle ist der vom Nutzer gelieferte Artikel, übernommen ohne inhaltliche Änderungen: `src/content/lab-notes/waechter.md`. Verknüpft als Technischer Bericht beim Projekt Wächter.
- `one-policy-four-balance-modes` (Englisch, 14.09.2026): „One Policy, Four Balance Modes". Quelle ist der vom Nutzer gelieferte Artikel zum Doppelpendel-Training. Ergänzt: Hardware (gleicher Laptop wie Wächter, laut Nutzer) und der Absatz zur Web-Umsetzung aus `docs/DECISIONS.md` und `README.md`. Motivations-Platzhalter entfernt, weil dazu keine Angaben vorliegen. Verknüpft über die Bildunterschrift der Hero-Demo.

KI-Hinweis, klein und unauffällig auf der Übersicht und unter jedem Artikel. Englisch **wörtlich** so (einschließlich Gedankenstrich):

- EN: The projects, experiments, measurements and bugs are mine. Claude helps turn my notes into readable articles. I review the technical content before publishing — AI saves me writing time, not engineering time.
- DE: Die Projekte, Experimente, Messwerte und Bugs sind meine. Claude hilft mir, aus meinen Notizen lesbare Artikel zu machen. Die technischen Inhalte prüfe ich vor der Veröffentlichung. KI spart mir Schreibzeit, keine Ingenieurszeit.

---

## Werkzeuge und Technologien

**DE** (nach praktischem Einsatz gruppiert, keine Prozentbalken, keine Sterne, nur was in Projekten tatsächlich verwendet wurde)
- **Reinforcement Learning und Simulation:** Gymnasium, Stable-Baselines3 (PPO, SAC, TQC), MuJoCo, Feder-Masse-Simulation, NVIDIA Isaac Lab (gerade am Anfang)
- **Lokale KI und Sprache:** faster-whisper, Piper TTS, Ollama, ONNX / DirectML, LLMs über OpenRouter
- **Software und Web:** Python, TypeScript, JavaScript, Next.js, Astro, PostgreSQL, Drizzle, MapLibre
- **Automatisierung und Werkzeuge:** n8n, Claude Code, Codex, Git
- **Hardware:** 3D-Druck
- **Sprachen:** Deutsch (Muttersprache), Englisch (C1)

**EN**
- **Reinforcement learning & simulation:** Gymnasium, Stable-Baselines3 (PPO, SAC, TQC), MuJoCo, spring-mass simulation, NVIDIA Isaac Lab (just getting started)
- **Local AI & speech:** faster-whisper, Piper TTS, Ollama, ONNX / DirectML, LLMs via OpenRouter
- **Software & web:** Python, TypeScript, JavaScript, Next.js, Astro, PostgreSQL, Drizzle, MapLibre
- **Automation & tooling:** n8n, Claude Code, Codex, Git
- **Hardware:** 3D printing
- **Languages:** German (native), English (C1)

---

## Kontakt

**DE:** Du organisierst einen Hackathon, baust etwas mit Robotern oder willst einfach reden? Schreib mir auf LinkedIn oder per E-Mail.
**EN:** Running a hackathon, building something with robots or just want to talk? Message me on LinkedIn or send an email.

Links: LinkedIn · E-Mail (m.koehlenbeck@koehlenbeck.com) · GitHub · Lebenslauf (PDF)

## Footer

- DE: © 2026 Maximilian Köhlenbeck · Impressum · Datenschutz · Gebaut mit Astro und KI-Agenten
- EN: © 2026 Maximilian Köhlenbeck · Legal notice · Privacy · Built with Astro and AI agents

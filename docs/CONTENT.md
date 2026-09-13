# Inhalte der Website

Das ist die **einzige Quelle für Fakten**. Nichts erfinden, was hier nicht steht. Formulierungen dürfen leicht angepasst werden, aber der Ton bleibt: erste Person, kurze Sätze, konkret, ehrlich, kein Marketing-Sprech.

Schreibregeln für alle Texte:
- Keine Gedankenstriche (— oder –) als Stilmittel. Punkt, Komma oder Doppelpunkt nehmen.
- Keine Wörter wie „innovativ", „nahtlos", „revolutionär", „Leidenschaft", „next-level", „cutting-edge", „Synergie".
- Keine übertriebenen Aussagen. Lieber ein echter Messwert als ein Adjektiv.
- Keine Emojis.
- Den 4. Platz beim Hackathon **nicht** erwähnen.
- Kein Foto.

---

## Meta

| | DE | EN |
|---|---|---|
| Seitentitel | Maximilian Köhlenbeck | Maximilian Köhlenbeck |
| Description | Dualer Student Automatisierungstechnik bei KUKA. Ich baue mit KI, am liebsten Dinge, die sich bewegen. | Automation engineering student at KUKA. I build things with AI, preferably things that move. |
| URL | https://maximilian467.github.io | https://maximilian467.github.io/en/ |

Links:
- GitHub: https://github.com/maximilian467
- LinkedIn: https://www.linkedin.com/in/maximilian-k%C3%B6hlenbeck
- E-Mail: m.koehlenbeck@koehlenbeck.com
- CV: `/cv/maximilian-koehlenbeck-lebenslauf.pdf`

---

## Hero

**DE**
- Name: Maximilian Köhlenbeck
- Satz: Ich studiere Automatisierungstechnik und entwickle Projekte mit KI-Agenten. Besonders interessieren mich Robotik, Automatisierung und Physical AI.
- Metazeile: Bremen · Dualer Student bei KUKA und an der Hochschule Bremen
- Links: GitHub · LinkedIn · Lebenslauf (PDF)
- Bildunterschrift CartPole: Abb. 1: Diese Policy habe ich selbst mit PPO trainiert. Sie läuft hier live in deinem Browser. Stups den Stab an.

**EN**
- Sentence: I study automation engineering and develop projects with AI agents. My main interests are robotics, automation and physical AI.
- Meta line: Bremen · Dual student at KUKA and Hochschule Bremen
- Links: GitHub · LinkedIn · CV (PDF)
- Caption: Fig. 1: I trained this policy myself with PPO. It is running live in your browser. Give the pole a nudge.

---

## Über mich

**DE**

Ich studiere seit Oktober 2024 dual Automatisierungstechnik. Die Theorie lerne ich an der Hochschule Bremen, die Praxisphasen verbringe ich bei KUKA.

Ich entwickle meine Projekte mit KI-Agenten wie Claude Code und Codex. Dabei übernehme ich die Planung, definiere die Anforderungen und prüfe die Ergebnisse. Entscheidend ist für mich, ob ein System seine Aufgabe tatsächlich erfüllt.

Besonders interessieren mich KI-Systeme, die mit ihrer Umgebung interagieren: Robotik, Automatisierung und Physical AI.

**EN**

Since October 2024 I've been a dual student in automation engineering. I learn the theory at Hochschule Bremen and spend my practical phases at KUKA.

I develop my projects with AI agents such as Claude Code and Codex. I plan the work, define the requirements and check the results. What matters to me is whether a system actually does what it is meant to do.

I am particularly interested in AI systems that interact with their surroundings: robotics, automation and physical AI.

---

## Gerade dran (Stand: September 2026)

**DE**

**KI trainieren statt nur benutzen.** Ich bringe mir gerade bei, wie man Modelle selbst trainiert. Angefangen habe ich mit Reinforcement Learning: erst ein Agent, der einen Stab auf einem Wagen balanciert (das Pendel oben auf der Seite), dann ein doppeltes Pendel. Jetzt geht es mit NVIDIA Isaac Lab weiter. Die Frage, die mich dabei beschäftigt: Wie bringt man einem Modell etwas so bei, dass es auch in Situationen klappt, die es nie gesehen hat?

**3D-Drucker optimieren, zusammen mit KUKA.** Ich optimiere einen 3D-Drucker und habe dafür eine Kalibrierung des Düsen-Offsets selbst eingebaut. Das Projekt läuft noch.

**EN**

**Training AI instead of just using it.** I'm teaching myself how to train models. I started with reinforcement learning: first an agent that balances a pole on a cart (the pendulum at the top of this page), then a double pendulum. Next up is NVIDIA Isaac Lab. The question on my mind: how do you teach a model something so it also works in situations it has never seen?

**Improving a 3D printer, together with KUKA.** I'm optimizing a 3D printer and built a nozzle offset calibration into it myself. The project is ongoing.

---

## Projekte

Alle Projekte sind mit KI-Agenten gebaut. Das darf und soll auf der Seite stehen (einmal im Abschnitt, nicht bei jedem Projekt wiederholen).

**Intro DE:** Alles hier habe ich mit KI-Agenten gebaut. Den Quellcode gibt es nur, wo er öffentlich sein darf.
**Intro EN:** I built everything here with AI agents. Source code is linked only where it can be public.

Reihenfolge wie unten.

### 1. Wächter

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Ein Assistent, der durch eine Kamera sieht, zuhört und antwortet. Alles läuft offline auf meinem Laptop, ohne Grafikkarte, ohne Cloud. Eine Bewegungserkennung weckt die Personenerkennung erst, wenn sich etwas tut. Die Spracherkennung bekommt nur Abschnitte, in denen wirklich gesprochen wird, weil Whisper bei Stille sonst Sätze erfindet. Ziel war: Er fängt nach weniger als drei Sekunden an zu sprechen.
- **EN:** An assistant that sees through a camera, listens and talks back. Everything runs offline on my laptop, no GPU, no cloud. Motion detection only wakes the person detector when something actually happens. Speech recognition only gets segments where someone is really talking, because Whisper invents sentences when it hears silence. The goal: it starts speaking in under three seconds.
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
- Tech: Next.js · TypeScript · PostgreSQL · Drizzle · MapLibre · LLM über OpenRouter
- Links: keine (privates Team-Repo)

### 3. Planen-Editor

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Wie spannt man eine Plane so, dass sie keine Falten wirft? Im Editor zeichnet man die Form, setzt Befestigungspunkte und startet die Simulation. Die Plane wird zu einem Feder-Masse-Netz, Falten erscheinen als Linien und werden über einen Faltenindex messbar. Ein Assistent schlägt dann Positionen für die Befestigungspunkte vor, bei denen die Plane glatter liegt.
- **EN:** How do you mount a tarp so it doesn't wrinkle? In the editor you draw the shape, place mounting points and start the simulation. The tarp becomes a spring-mass mesh, wrinkles show up as lines and are measured with a wrinkle index. An assistant then suggests mounting point positions that make the tarp lie flatter.
- Tech: JavaScript · Canvas · Feder-Masse-Simulation · eine einzige HTML-Datei
- Links: keine

### 4. 3D-Drucker: Düsen-Offset-Kalibrierung

- Status: läuft · Zeitraum: 2026 · mit KUKA
- **DE:** Ich kenne mich mit 3D-Druck gut aus und optimiere gerade zusammen mit KUKA einen Drucker. Dafür habe ich eine Kalibrierung des Düsen-Offsets selbst eingebaut.
- **EN:** I know my way around 3D printing and I'm currently optimizing a printer together with KUKA. For that I built a nozzle offset calibration myself.
- Tech: 3D-Druck · Kalibrierung
- Links: keine

### 5. Mein Wispr-Flow-Klon

- Status: täglich im Einsatz · Zeitraum: 2026 · Allein
- **DE:** Das Tool, das ich von allen hier am meisten benutze. Tastenkombination drücken, sprechen, nochmal drücken, und der Text steht da, wo der Cursor ist. In Word, im Browser, im Code-Editor. Nachgebaut nach dem Vorbild von Wispr Flow, nur dass alles lokal läuft, nichts kostet und nichts ins Internet schickt.
- **EN:** The tool I use most out of everything on this page. Press a hotkey, talk, press again, and the text appears wherever the cursor is. In Word, in the browser, in the code editor. Modeled after Wispr Flow, except everything runs locally, costs nothing and sends nothing to the internet.
- Tech: Python · faster-whisper (small, int8, CPU) · Windows
- Links: keine

### 6. KI-Automationen mit n8n

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Drei Automationen für kleine Firmen. Rechnungen aus PDFs auslesen und prüfen, ob die Positionen wirklich die Summe ergeben. Eingehende Mails sortieren und Antworten als Entwurf vorbereiten, nie automatisch senden. Preise und Lagerbestand in Onlineshops ohne API beobachten. Wenn die KI unsicher ist, entscheidet ein Mensch.
- **EN:** Three automations for small businesses. Extract invoices from PDFs and check that the line items actually add up to the total. Sort incoming emails and prepare replies as drafts, never send them automatically. Track prices and stock in online shops that have no API. When the AI isn't sure, a human decides.
- Tech: n8n · LLM über HTTP · Google Sheets · Airtable · Slack · Gmail
- Link: https://github.com/maximilian467/n8n-automation-portfolio (DE: „Code ansehen", EN: "View code")

---

## Hackathons

- **Smart Region Hackathon Offenburg** · Mai 2026 · Daraus entstand Baulify.
- EN: **Smart Region Hackathon Offenburg** · May 2026 · This is where Baulify started.

(Keine Platzierung erwähnen.)

---

## Womit ich arbeite

**DE** (ehrlich, keine Prozentbalken, keine Sterne)
- **Sehr sicher:** Agentisches Coding mit Claude Code und Codex. Projekte planen, in Schritte zerlegen, prüfen, was die KI baut.
- **Damit gebaut:** Python, TypeScript und Next.js, Astro, n8n, lokale Modelle (Ollama, faster-whisper)
- **Robotik und Simulation:** Gymnasium, Stable-Baselines3 (PPO), NVIDIA Isaac Lab (am Anfang)
- **Hardware:** 3D-Druck
- **Sprachen:** Deutsch (Muttersprache), Englisch (C1)

**EN**
- **Very confident:** Agentic coding with Claude Code and Codex. Planning projects, breaking them into steps, checking what the AI builds.
- **Built with:** Python, TypeScript and Next.js, Astro, n8n, local models (Ollama, faster-whisper)
- **Robotics and simulation:** Gymnasium, Stable-Baselines3 (PPO), NVIDIA Isaac Lab (just getting started)
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

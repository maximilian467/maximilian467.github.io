# Inhalte der Website

Das ist die **einzige Quelle für Fakten**. Nichts erfinden, was hier nicht steht. Formulierungen dürfen leicht angepasst werden, aber der Ton bleibt: erste Person, kurze Sätze, konkret, ehrlich, kein Marketing-Sprech.

Schreibregeln für alle Texte:
- Keine Gedankenstriche (— oder –) als Stilmittel. Punkt, Komma oder Doppelpunkt nehmen. Einzige Ausnahme: der vom Nutzer wörtlich vorgegebene KI-Hinweis im Laborbuch (siehe unten).
- Keine Wörter wie „innovativ", „nahtlos", „revolutionär", „Leidenschaft", „next-level", „cutting-edge", „Synergie".
- Keine übertriebenen Aussagen. Lieber ein echter Messwert als ein Adjektiv.
- Keine Emojis.
- Keine Platzierungen bei Hackathons erwähnen. Einzige Ausnahme: der Sieg beim Mobile Robotics Hackathon (Oktober 2026), vom Nutzer freigegeben.
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

## Gerade dran (Stand: Oktober 2026)

**DE**

**Sesame Robot mit Reinforcement Learning.** Ich baue gerade einen Sesame Robot und trainiere ihn mit Reinforcement Learning. Das Doppelpendel oben auf der Seite war der Anfang. Jetzt geht es von der Simulation auf einen echten Roboter.

**EN**

**Sesame Robot with reinforcement learning.** I'm building a Sesame Robot and training it with reinforcement learning. The double pendulum at the top of this page was the start. Now it moves from simulation to a real robot.

---

## Projekte

Kein Intro im Projektabschnitt. Die Arbeitsweise mit KI-Agenten wird unter „KI-gestützte Entwicklung“ beschrieben. Quellcode wird weiterhin nur verlinkt, wenn er öffentlich sein darf.

Die Projektdateien unter `src/content/projects/` können optional strukturierte Felder haben: Ziel, Was ich gebaut habe, Aufbau (Diagramm), Technische Entscheidungen, Messwerte, Was ich gelernt habe, Grenzen und nächste Schritte, sowie Links (Live-Demo, GitHub, Technischer Bericht). Nur füllen, wenn die Fakten hier stehen. Leere Felder werden nicht angezeigt.

Reihenfolge wie unten. Auf der Startseite stehen nur angepinnte Projekte (`"pinned": true` in der Projektdatei), zurzeit Helpy, Developer Island, Baulify und die n8n-Automationen. Darunter der Link „Alle Projekte (8) →“ / „All projects (8) →“ zur Seite `/de/projekte/` bzw. `/projects/`, auf der alle Projekte vollständig untereinander stehen.

### 0. Helpy

- Status: Prototyp · Zeitraum: Oktober 2026 · im Team
- **DE:** Ein Assistent, der einem Experten bei der Arbeit zusieht, die Erklärungen anhört und in natürlichen Pausen nach den Entscheidungen fragt. Daraus entsteht eine Work Map aus Schritten, Regeln und Begründungen. Ein neuer Kollege übt dann damit, und Fehler werden vor dem Speichern abgefangen. Bildschirmfotos werden schon im Browser per OCR geprüft und geschwärzt. Entstanden beim Hack-Nation 7.
- **EN:** An assistant that watches an expert work, listens to their narration and asks about decisions at natural pauses. The session becomes a Work Map of steps, rules and reasons. A new colleague then practices with it, and mistakes get caught before saving. Screenshots are OCR'd and redacted right in the browser. Started at Hack-Nation 7.
- Tech: TypeScript · React · TanStack Start · Convex · Claude · ElevenLabs · Tesseract.js
- Messwerte: Bildschirmfoto-Pipeline 378 ms (einfacher Bildschirm) bzw. 1.512 ms (dichter Bildschirm), laut Benchmark vom 04.10.2026
- Links: Technischer Bericht (Lab Note `helpy`)

### 1. Developer Island

- Status: veröffentlicht · Zeitraum: Oktober 2026 · Allein · angepinnt
- **DE:** Eine Dynamic Island für den Windows-Desktop. Eine kleine Kapsel oben am Bildschirm zeigt meine Nutzung von Claude Code und Codex, Musik, einen Fokus-Timer, Termine und den Zustand des Rechners. Sie liest die lokalen Logs der Tools, schickt nichts in die Cloud und braucht im Leerlauf 55 MB und 0,03 % eines CPU-Kerns. Der Code ist öffentlich.
- **EN:** A Dynamic Island for the Windows desktop. A small capsule at the top of the screen shows my Claude Code and Codex usage, music, a focus timer, meetings and system health. It reads the tools' local logs, sends nothing to the cloud and idles at 55 MB and 0.03 % of one CPU core. The code is open source.
- Aufbau (aus der Lab Note): Daten: Lokale Logs, Medien und Sensoren → Provider → Unveränderliche Snapshots → SQLite-Verlauf. Anzeige: View-Models → Zustandsautomat → Transparentes Fenster fester Größe → Feder-Animationen
- Messwerte (aus der Lab Note, gemessen am 01.10.2026): Leerlauf 55 MB und 16 ms CPU in 60 s (0,03 % eines Kerns), Warmstart 47 ms, 382 Unit-Tests
- Tech: C# · .NET 10 · WinUI 3 · SQLite · xUnit
- Links: https://github.com/maximilian467/Developer-Island (Allowlist), Technischer Bericht (Lab Note `developer-island`)
- Laut Nutzer (18.10.2026) zurzeit sein stärkstes Projekt auf GitHub. Keine Sternezahl auf der Seite, weil sie sich ständig ändert.

### 2. Wächter

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

### 3. Baulify

- Status: Prototyp · Zeitraum: seit Mai 2026 · im Team
- **DE:** Entstanden beim Smart Region Hackathon Offenburg. Eine Plattform, auf der Versorger, Kommunen und Baufirmen ihre Tiefbaumaßnahmen abstimmen. Sie zeigt Konflikte, bevor dieselbe Straße zweimal aufgerissen wird. Nach dem Hackathon habe ich weitergebaut: Eine KI liest Anfragen aus PDFs oder Freitext aus und füllt das Formular vor, Freigaben laufen über einen Link ohne Account, dazu eine Karte und eine eigene Landingpage.
- **EN:** Started at the Smart Region Hackathon Offenburg. A platform where utilities, municipalities and contractors coordinate roadworks. It shows conflicts before the same street gets dug up twice. After the hackathon I kept building: an AI reads requests from PDFs or free text and pre-fills the form, approvals work through a link without an account, plus a map and a landing page.
- Aufbau (aus der Beschreibung abgeleitet): Anfragen: PDF oder Freitext → LLM über OpenRouter → vorausgefülltes Formular
- Tech: Next.js · TypeScript · PostgreSQL · Drizzle · MapLibre · LLM über OpenRouter
- Links: keine (privates Team-Repo)

### 4. Planen-Editor

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Wie spannt man eine Plane so, dass sie keine Falten wirft? Im Editor zeichnet man die Form, setzt Befestigungspunkte und startet die Simulation. Die Plane wird zu einem Feder-Masse-Netz, Falten erscheinen als Linien und werden über einen Faltenindex messbar. Ein Assistent schlägt dann Positionen für die Befestigungspunkte vor, bei denen die Plane glatter liegt.
- **EN:** How do you mount a tarp so it doesn't wrinkle? In the editor you draw the shape, place mounting points and start the simulation. The tarp becomes a spring-mass mesh, wrinkles show up as lines and are measured with a wrinkle index. An assistant then suggests mounting point positions that make the tarp lie flatter.
- Aufbau (aus der Beschreibung abgeleitet): Form zeichnen → Befestigungspunkte setzen → Feder-Masse-Netz → Faltenindex → Vorschlag für Befestigungspunkte
- Tech: JavaScript · Canvas · Feder-Masse-Simulation · eine einzige HTML-Datei
- Links: keine

### 5. 3D-Drucker: Düsen-Offset-Kalibrierung

- Status: fertig (laut Nutzer abgeschlossen, 18.10.2026) · Zeitraum: 2026 · mit KUKA
- **DE:** Mein bisher längstes Projekt, zusammen mit KUKA. Beim FDM-3D-Druck waren schon wenige Zehntelmillimeter Abweichung in den Bauteilen sichtbar, und der Düsen-Offset verschob sich mit der Temperatur und nach Düsenwechseln. Ich habe eine Kalibrierung gebaut, die den Offset zuverlässig und wiederholbar misst, echte Offset-Fehler von Bettnivellierung oder Materialverhalten trennt und als Ablauf funktioniert, den das Team ohne mich wiederholen kann.
- **EN:** My longest project so far, together with KUKA. In FDM 3D printing, errors of a few tenths of a millimeter already showed in the parts, and the nozzle offset shifted with temperature and after nozzle changes. I built a calibration that measures the offset reliably and repeatably, separates real offset errors from causes like bed leveling or material behavior, and works as a process the team can rerun without me.
- Aufbau: nicht dokumentiert, daher kein Diagramm
- Tech: FDM-3D-Druck · Kalibrierung · Messung
- Was ich gelernt habe: Für konsistente Ergebnisse brauchte es viele Runden aus Testdrucken und Messungen.
- Lab Note: noch keine, kommt vielleicht.
- Links: keine
- Weitere Fakten vom Nutzer (15.10.2026), im Lebenslauf und in der Projektbeschreibung verwendet: mein längstes und größtes Projekt bisher. FDM-3D-Druck bei KUKA. Schon Fehler von wenigen Zehntelmillimetern waren in den Bauteilen sichtbar, und der Offset verschob sich mit der Temperatur und nach Düsenwechseln. Aufgabe: den Offset zuverlässig und wiederholbar messen, echte Offset-Fehler von anderen Ursachen wie Bettnivellierung oder Materialverhalten trennen und daraus einen Ablauf machen, den das Team ohne mich wiederholen kann. Es brauchte viele Runden aus Testdrucken und Messungen, bis die Ergebnisse konsistent waren.

### 6. Mein Wispr-Flow-Klon

- Status: täglich im Einsatz · Zeitraum: 2026 · Allein
- **DE:** Das Tool, das ich von allen hier am meisten benutze. Tastenkombination drücken, sprechen, nochmal drücken, und der Text steht da, wo der Cursor ist. In Word, im Browser, im Code-Editor. Nachgebaut nach dem Vorbild von Wispr Flow, nur dass alles lokal läuft, nichts kostet und nichts ins Internet schickt.
- **EN:** The tool I use most out of everything on this page. Press a hotkey, talk, press again, and the text appears wherever the cursor is. In Word, in the browser, in the code editor. Modeled after Wispr Flow, except everything runs locally, costs nothing and sends nothing to the internet.
- Aufbau (aus der Beschreibung abgeleitet): Tastenkombination → Sprachaufnahme → faster-whisper (small, int8, CPU) → Text am Cursor
- Tech: Python · faster-whisper (small, int8, CPU) · Windows
- Links: keine

### 7. KI-Automationen mit n8n

- Status: fertig · Zeitraum: 2026 · Allein
- **DE:** Drei Automationen für kleine Firmen. Rechnungen aus PDFs auslesen und prüfen, ob die Positionen wirklich die Summe ergeben. Eingehende Mails sortieren und Antworten als Entwurf vorbereiten, nie automatisch senden. Preise und Lagerbestand in Onlineshops ohne API beobachten. Wenn die KI unsicher ist, entscheidet ein Mensch.
- **EN:** Three automations for small businesses. Extract invoices from PDFs and check that the line items actually add up to the total. Sort incoming emails and prepare replies as drafts, never send them automatically. Track prices and stock in online shops that have no API. When the AI isn't sure, a human decides.
- Aufbau (aus der Beschreibung abgeleitet): Rechnungen: Rechnung als PDF → Auslesen per LLM → Positionen gegen Summe prüfen → Mensch entscheidet bei Unsicherheit
- Tech: n8n · LLM über HTTP · Google Sheets · Airtable · Slack · Gmail
- Link: https://github.com/maximilian467/n8n-automation-portfolio (DE: „Code auf GitHub", EN: "Code on GitHub")

---

## Hackathons

Neueste zuerst.

- **Mobile Robotics Hackathon** · Oktober 2026 · Wir haben mit einem Roboterarm Müll sortiert, über 6D-Pose-Estimation und maschinelles Lernen. Eigene Zeile: 1. Platz. Link: Technischer Bericht (Lab Note `mobile-robotics-hackathon`).
- EN: **Mobile Robotics Hackathon** · October 2026 · We sorted waste with a robot arm, using 6D pose estimation and machine learning. Own line: 1st place.
- **Hack-Nation 7** · Oktober 2026 · Daraus entstand Helpy.
- EN: **Hack-Nation 7** · October 2026 · This is where Helpy started.
- **Smart Region Hackathon Offenburg** · Mai 2026 · Daraus entstand Baulify.
- EN: **Smart Region Hackathon Offenburg** · May 2026 · This is where Baulify started.

(Keine weitere Platzierung erwähnen, nur der Sieg beim Mobile Robotics Hackathon.)

---

## Zertifikate

Abschnitt direkt nach den Hackathons. Ohne Datum, weil keins vorliegt. Umsetzung: `src/components/Certificates.astro`.

- **Claude Code 101** · Anthropic · Nachweis: https://academy.claude.com/badges/877ce300-0a1a-4ed3-b5e4-102c72d87680 (DE „Nachweis ansehen", EN "View credential")
- **Applying AI Principles with Google Cloud** · Google Cloud · Completion Badge als Bild: `/certificates/google-applying-ai-principles-badge.png` (DE „Badge ansehen", EN "View badge")

---

## Laborbuch / Lab Notes

Technische Berichte zu Projekten und Experimenten. Keine Artikel erfinden. Felder: `src/content.config.ts`.

Veröffentlicht:
- `mobile-robotics-hackathon` (Englisch, 18.10.2026): „Mobile Robotics Hackathon: sorting waste with a robot arm“. Quelle: Sprachnotiz-Transkript und Antworten des Nutzers vom 18.10.2026. TU Dresden, ROS 2, MoveIt, Python, Claude Code, Kalibrierung mit AprilTags aus 20 Posen. Objekte: Papierbecher und Plastikflaschen in die passenden Eimer, Glasflaschen in den Kasten. Erkennung in der Demo über die Höhe der Objekte, die 6D-Pose-Estimation lief getrennt und wurde aus Zeitgründen nicht mehr eingebunden. Keine Namen, keine Teamgröße, keine Erfolgsquote. Verknüpft beim Hackathon-Eintrag. Überarbeiten, sobald die Zusammenfassungen der anderen Claude-Code-Sessions da sind.
- `developer-island` (Englisch, 06.10.2026): „Developer Island: a Dynamic Island for the Windows desktop“. Verknüpft als Technischer Bericht beim Projekt Developer Island.
- `waechter` (Englisch, 14.09.2026): „Wächter: an offline voice-and-vision assistant for my front door". Quelle ist der vom Nutzer gelieferte Artikel, übernommen ohne inhaltliche Änderungen: `src/content/lab-notes/waechter.md`. Verknüpft als Technischer Bericht beim Projekt Wächter.
- `helpy` (Englisch, 05.10.2026): „Helpy: capturing an expert's judgment while they work". Quelle: README und docs des Repos maxRN/helpy sowie der Screenshot-Benchmark vom 04.10.2026. Verknüpft als Technischer Bericht beim Projekt Helpy.
- `one-policy-four-balance-modes` (Englisch, 14.09.2026): „One Policy, Four Balance Modes". Quelle ist der vom Nutzer gelieferte Artikel zum Doppelpendel-Training. Ergänzt: Hardware (gleicher Laptop wie Wächter, laut Nutzer) und der Absatz zur Web-Umsetzung aus `README.md`. Motivations-Platzhalter entfernt, weil dazu keine Angaben vorliegen. Verknüpft über die Bildunterschrift der Hero-Demo.

KI-Hinweis, klein und unauffällig auf der Übersicht und unter jedem Artikel. Englisch **wörtlich** so (einschließlich Gedankenstrich):

- EN: The projects, experiments, measurements and bugs are mine. Claude helps turn my notes into readable articles. I review the technical content before publishing — AI saves me writing time, not engineering time.
- DE: Die Projekte, Experimente, Messwerte und Bugs sind meine. Claude hilft mir, aus meinen Notizen lesbare Artikel zu machen. Die technischen Inhalte prüfe ich vor der Veröffentlichung. KI spart mir Schreibzeit, keine Ingenieurszeit.

---

## Werkzeuge und Technologien

**DE** (nach praktischem Einsatz gruppiert, keine Prozentbalken, keine Sterne, nur was in Projekten tatsächlich verwendet wurde)
- **Reinforcement Learning und Simulation:** Gymnasium, Stable-Baselines3 (PPO, SAC, TQC), MuJoCo, Feder-Masse-Simulation
- **Lokale KI und Sprache:** faster-whisper, Piper TTS, Ollama, ONNX / DirectML, LLMs über OpenRouter
- **Software und Web:** Python, TypeScript, JavaScript, C#, .NET, WinUI 3, Next.js, Astro, PostgreSQL, Drizzle, MapLibre
- **Automatisierung und Werkzeuge:** n8n, Claude Code, Codex, Git
- **Hardware:** 3D-Druck
- **Sprachen:** Deutsch (Muttersprache), Englisch (C1)

**EN**
- **Reinforcement learning & simulation:** Gymnasium, Stable-Baselines3 (PPO, SAC, TQC), MuJoCo, spring-mass simulation
- **Local AI & speech:** faster-whisper, Piper TTS, Ollama, ONNX / DirectML, LLMs via OpenRouter
- **Software & web:** Python, TypeScript, JavaScript, C#, .NET, WinUI 3, Next.js, Astro, PostgreSQL, Drizzle, MapLibre
- **Automation & tooling:** n8n, Claude Code, Codex, Git
- **Hardware:** 3D printing
- **Languages:** German (native), English (C1)


---

## Lebenslauf (PDF)

Eine Seite A4 je Sprache, gleiche URLs wie oben. Nach Änderungen an `docs/cv/*.html` die PDFs neu drucken (Edge/Chrome headless, `--print-to-pdf`, `--no-pdf-header-footer`) und prüfen, dass jedes genau eine Seite hat.

Stand Oktober 2026:
- Abschnitte: Profil, Ausbildung, Hackathons (alle drei wie oben, beim Mobile Robotics Hackathon „TU Dresden“ und der 1. Platz direkt neben dem Namen), Projekte, Kenntnisse.
- Profil endet mit dem Sesame Robot (wie „Gerade dran“).
- Projekte, nur die stärksten: Düsen-Offset-Kalibrierung bei KUKA (zuerst, längstes Projekt), Developer Island, Sesame Robot (läuft), Doppelpendel mit einer TQC-Policy (09/2026), Helpy. Baulify steht nur noch über die Hackathon-Zeile im Lebenslauf. Wächter, Planen-Editor, Wispr-Flow-Klon und n8n stehen nur auf der Website.
- Kenntnisse: wie auf der Website (also mit C#, .NET, WinUI 3), ohne Feder-Masse-Simulation (Planen-Editor fehlt im Lebenslauf) und ohne die Zeile Hardware (steckt im Kalibrierungsprojekt).
- Fakten zu Developer Island stammen aus der Lab Note `developer-island` (06.10.2026), zum Doppelpendel aus `one-policy-four-balance-modes`.

---

## Kontakt

**DE:** Du organisierst einen Hackathon, baust etwas mit Robotern oder willst einfach reden? Schreib mir auf LinkedIn oder per E-Mail.
**EN:** Running a hackathon, building something with robots or just want to talk? Message me on LinkedIn or send an email.

Links: LinkedIn · E-Mail (m.koehlenbeck@koehlenbeck.com) · GitHub · Lebenslauf (PDF)

## Footer

- DE: © 2026 Maximilian Köhlenbeck · Impressum · Datenschutz · Gebaut mit Astro und KI-Agenten
- EN: © 2026 Maximilian Köhlenbeck · Legal notice · Privacy · Built with Astro and AI agents

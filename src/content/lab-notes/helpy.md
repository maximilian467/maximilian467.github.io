---
title: "Helpy: capturing an expert's judgment while they work"
summary: "A screen-and-voice assistant that watches an expert do a task, asks about decisions during natural pauses, and turns the session into a Work Map of steps, rules and reasons. A new colleague then practices against those rules. Screenshots are OCR'd and redacted in the browser in roughly 0.4–1.5 seconds."
description: "A hackathon project that records an expert's workflow, asks for the reasoning behind decisions and turns it into a Work Map, with a guided practice mode that catches mistakes before they are saved."
metaTitle: "Helpy — Capturing Expert Judgment | Maximilian Köhlenbeck"
metaDescription: "A technical write-up of Helpy, built at Hack-Nation 7: screen and voice capture, in-browser OCR and PII redaction, question timing and a Work Map with guardrails."
lang: en
published: 2026-10-05
stack: [TypeScript, React 19, TanStack Start, Convex, Anthropic, ElevenLabs, Tesseract.js, Railway]
architecture:
  - label: Capture
    nodes: [Screen and narration, OCR and redaction in the browser, Questions at pauses]
  - label: Map and teach
    nodes: [Debrief and teach-back, Work Map, Practice with guardrails]
metrics:
  - label: Screenshot pipeline, sparse screen
    value: "378 ms end to end (OCR 232 ms, PII 107 ms)"
    highlight: "~0.4 s"
  - label: Screenshot pipeline, dense screen
    value: "1,512 ms end to end (OCR 1,041 ms, PII 417 ms)"
  - label: Policy call / TTS
    value: "~1.5–2.5 s / ~0.3–0.5 s"
  - label: Capture interval
    value: "every 2 s, full-resolution JPEG"
links:
  demo: https://sabine-ai-production.up.railway.app
---

## What I wanted to build

An experienced employee knows which invoice needs a second approval, which supplier double-bills at quarter-end, and when the usual rule does not apply. A checklist rarely captures that judgment. Writing everything down interrupts the expert, and the document drifts away from the work.

Helpy watches the expert work, listens to their narration and asks about decisions at natural pauses. The result is a **Work Map**: the steps, the rules and the expert's reasons. A new colleague can then practice with guidance that catches mistakes before saving, in a demo ERP built for the project. I built it at Hack-Nation 7 in October 2026.

> **Scope:** The demo uses synthetic accounts-payable data. The guardrails run inside the demo ERP; they do not intercept arbitrary external software. The app has public access and a fixed demo identity, without authentication, so it is not meant for real data.

## How it works

Three modes share one session: **Capture**, **Map** and **Teach**.

```
Screen + microphone (browser)
   ↓  screenshot every 2 s
Tesseract OCR → PII detection → masked copy
   ↓  redacted frame
Vision description + question policy (Claude)
   ↓  asked at a pause, spoken by TTS
Debrief + teach-back (ElevenLabs agent)
   ↓
Work Map: steps, rules, reasons  →  Teach mode with guardrails
```

The browser coordinates capture, OCR and redaction. TanStack Start server routes call Anthropic and ElevenLabs, and Convex stores projects, tasks, files, events and Work Maps.

## Technical implementation

- **Redaction happens before anything is described.** Every screenshot goes through Tesseract.js in a worker, then PII detection, then a black mask over the matched regions. The vision model receives the redacted image. Original screenshots and audio are still stored in Convex, which is why the privacy note says to use synthetic data.
- **Questions are timed, not constant.** One policy call takes about 1.5–2.5 s and TTS about 0.3–0.5 s. So Helpy starts thinking 1.2 s after a new screen event while the expert is still busy, asks a prepared question the moment a pause begins, and fetches the audio of a held question while it waits.
- **Live questions don't use a voice agent.** An agent's microphone would hear the narration, it only speaks English and it rephrases. Plain TTS avoids all three. The ElevenLabs agents are used for the debrief and the tutor.
- **Helpy answers only when addressed.** Turns that might be meant for it go to a separate route where Claude decides whether Helpy was spoken to. Those turns stay out of the debrief and the Work Map.
- **Screen context is always current.** Each request carries what is on screen right now, with timestamps. Vision requests run one at a time and the latest changed frame wins, so there is no backlog and an older description never replaces a newer one.

## Measurements

Measured on 4 October 2026 in headless Chrome 151 with a synthetic 1920 × 1080 JPEG, five runs per layout after one excluded warm-up run. Both screens contained a name, email, phone number and German IBAN.

| Screen | OCR | PII | Mask and PNG | Upload both files | End to end |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sparse (34 words) | 232 ms | 107 ms | 11 ms | 19 ms | 378 ms |
| Dense (234 words) | 1,041 ms | 417 ms | 22 ms | 20 ms | 1,512 ms |

Initial model startup took 11.46 s in a fresh browser context and is not part of those numbers. Every painted pixel was checked to be black and every pixel outside the masks to be unchanged.

## What failed

- **Redaction can miss.** It does not cover names in speech, and it can miss personal information on screen. That is the reason the project stays on synthetic data.
- **Capture depends on the browser.** Suspension, screen locking or sleep can delay or interrupt screenshots, and closing the tab ends screen sharing. Audio stays in browser memory until the task is saved, so losing the tab can lose it.
- **Live voice depends on permissions, model downloads and provider availability.** The demo ships a hand-written example Work Map so the Teach mode can be shown without any of that.

## What I learned

The hard part was not the model calls but the timing around them. An assistant that interrupts is worse than no assistant, so most of the design is deciding when to stay quiet.

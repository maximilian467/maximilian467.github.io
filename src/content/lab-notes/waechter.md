---
title: "Wächter: an offline voice-and-vision assistant for my front door"
summary: "A camera, a microphone and a 4B multimodal model on a laptop with no dedicated GPU. It gets to the first spoken word in about 2.6–2.9 seconds, and most of the work was finding out where the time actually goes."
description: "A fully local voice-and-vision assistant running on an ordinary laptop, with a focus on perception, conversational latency, benchmarking and the engineering failures behind a sub-3-second response target."
metaTitle: "Wächter — Offline Voice & Vision Assistant | Maximilian Köhlenbeck"
metaDescription: "A technical write-up on building a fully local voice-and-vision assistant on consumer hardware, including YOLO, Whisper, Gemma, Piper, latency benchmarks and engineering failures."
lang: en
published: 2026-09-14
project: waechter
stack: [Python, YOLO11n, onnxruntime-directml, llama.cpp, Gemma 3 4B, faster-whisper, Silero VAD, Piper TTS, FastAPI]
metrics:
  - label: Time to first spoken word
    value: "~2.6 s (questions 1–4), ~2.9 s once the history window is full"
    highlight: "~2.6–2.9 s"
  - label: LLM text generation
    value: "17–19 tok/s (component benchmark); ~10.6 tok/s in the endurance run"
  - label: YOLO11n, DirectML (Iris Xe)
    value: "17–18 ms"
  - label: RAM
    value: "~5.3 GB (llama-server 4.7 GB + Wächter 0.5 GB)"
  - label: Runtime
    value: "Fully local, no dedicated GPU"
---

## What I wanted to build

I built this out of curiosity. I wanted to see how well local AI, image processing and audio processing work together when everything runs on one ordinary machine. The concrete use case was a small assistant that watches the area in front of a door, notices when someone approaches, and can talk to them.

It had three hard constraints:

- **Fully local.** No cloud APIs and no network access at runtime. The web UI binds to `127.0.0.1` only.
- **Ordinary hardware.** A Lenovo ThinkBook 16 G6 IRL: i7-13700H (6 P-cores + 8 E-cores), 32 GB DDR5, Intel Iris Xe iGPU, Windows 11. No discrete GPU.
- **Conversational latency.** My target was **under 3 seconds** from the end of speech to the first spoken word of the reply.

The camera can be switched off entirely. The device is then released and nothing is processed, so it works as a plain offline voice assistant.

> **How this was built:** I wrote the project up front as a detailed specification: 12 sections, three hardware tiers, seven implementation phases and explicit acceptance criteria. Almost all of the code, config, scripts, tests and README were then written by Claude Code (Opus 5) against that spec, over roughly two days (31 Aug – 2 Sep 2026). My part was the decisions at each checkpoint (hardware tier, model choice, Python 3.11, internal camera), testing by voice, reporting failures like "no reply, can't send anything" (which led to two of the bugs below), feature requests (camera toggle, English mode, a male voice), and the system prompts.

## How it works

The core idea is a **two-stage perception** design, and the reason is functional, not just to save compute.

"Someone is approaching the door" is a *temporal* property: a bounding box grows over several frames. A vision-language model only ever sees a single frame, so it can't detect approach no matter how large it is. So a cheap, always-on stage handles time, and the expensive model only runs on demand.

```
Camera (30 fps, 1280×720)
   ↓  latest-frame ring buffer (size 1)
Motion gate (160×90 grayscale diff)
   ↓  only if something moves
YOLO11n person detection (ONNX, DirectML on iGPU)
   ↓
Tracker (stable IDs, box-height history)
   ↓
Event logic (approach / door zone / dwell time)
   ↓  selected events or a user question
Gemma 3 4B via llama-server (CPU)  ←── Microphone → Silero VAD → Whisper base
   ↓  first complete sentence
Piper TTS (persistent process)  →  Speaker   [mic hard-muted while speaking]
```

Process layout:

```
waechter (Python)                      llama-server.exe   (own process, HTTP 127.0.0.1:8080)
├── camera thread ── ring buffer ─┐
├── perception ───── events ──────┤
├── audio capture ── VAD ─────────┤
├── ASR (faster-whisper) ─────────┼──► dialog / image description
├── TTS ──────────────────────────┘            │
│      └── piper.exe (own process) ◄───────────┘
└── web UI (FastAPI, 127.0.0.1:8000)
```

The LLM and TTS run as separate processes on purpose. If `llama-server` crashes, it doesn't take the perception pipeline down with it. A supervisor loop starts 60 s after launch, checks both processes every 15 s, and restarts whichever one has died.

## Technical implementation

### Perception: cheap first, and time-aware

- **Motion gate.** A background-subtraction diff on a 160×90 grayscale frame. YOLO only runs when motion is detected, plus a 3 s tail, or while confirmed tracks exist.
- **YOLO11n as ONNX via onnxruntime-directml.** There's no PyTorch or ultralytics at runtime, only the exported model. It runs on the Iris Xe through DirectML, which leaves the P-cores free for the LLM.
- **A simple tracker** (IoU plus center distance, greedy matching, no Kalman filter). A track counts as confirmed after 3 hits, which filters out single-frame false positives.
- **Approach detection** checks that box **height** (not area) grows by at least 15 % over 1.5 s, with at least 70 % of steps non-shrinking. Height is used because a partly occluded person gets narrower but not shorter.
- **The direction check is a veto, not a requirement.** Requiring the box center to move toward the door zone fails for the most important case: if the camera hangs at the door and someone walks straight at it, the box grows but the center barely moves. So the check only rejects tracks that grow *while clearly moving away* from the zone, meaning someone walking past the door toward the camera.
- **Zone membership uses the foot point** (bottom-center of the box). The zone is stored in normalized coordinates, so it survives resolution or camera changes.

### Language: one multimodal model, used carefully

- **Gemma 3 4B (abliterated, Q4_K_M GGUF) with its mmproj** runs in llama.cpp's `llama-server`. The same model handles dialog and on-demand image description; there's no separate chat model and vision model. The abliterated variant was chosen so that behavior is defined entirely by the user-written system prompt.
- **Stable prompt prefix.** The system prompt always comes first and never changes between requests. Events and timestamps go into the *user* message after it. That keeps llama.cpp's prompt cache valid for the system prompt. As it turned out, it doesn't protect the history behind it (see Experiments).
- **Cache pre-warming.** After startup, a prompt change, a language switch, or a supervisor restart, the system prompt is processed once in the background.
- **Sentence-level streaming.** As soon as the first complete sentence arrives, it goes to Piper while the rest is still generating. The splitter has an abbreviation list so that German text like "z. B." doesn't get cut into fragments.
- **History is capped at 3 rounds**, and only events from the last 120 s are included.

### Audio: most of the Windows pain lives here

- **WASAPI doesn't resample in shared mode.** Opening the mic at 16 kHz fails with `PaErrorCode -9997`. So audio is captured at 48 kHz and decimated by exactly 3. A 61-tap windowed-sinc FIR low-pass (7 kHz cutoff) runs first, and its state persists across blocks. The filter is written by hand rather than pulling in scipy for one function. For playback (Piper outputs 22.05 kHz), WASAPI's own auto-conversion is enabled instead.
- **Silero VAD cuts out speech segments**, and only those reach Whisper. Whisper run on silence reliably hallucinates ("Untertitel von…", "Vielen Dank."), and those would otherwise end up as user input.
- **faster-whisper `base`, int8, CPU, greedy decoding**, with `condition_on_previous_text=False`. Outputs also go through a filter list of known hallucinations and a confidence floor.
- **Piper stays running permanently** and receives one sentence per line on stdin. Restarting it per sentence cost about 350 ms just to load the voice.
- **The mic gate closes before the first sound plays** and reopens after a tail period. Otherwise the system transcribes itself.
- **Language is a single switch** (German/English) that changes three things together: the Whisper language, the system prompt file, and the Piper voice. Automatic language detection was rejected because Whisper often guesses wrong on short utterances, and then the reply comes back in the wrong language.

### Configuration that documents itself

`config.yaml` is heavily commented, and most comments record the measurement behind a default. The web UI writes back to this file (door zone, camera index, toggles). With PyYAML's `safe_dump`, every comment would be deleted on the first save, so the project uses `ruamel.yaml` in round-trip mode.

## Experiments and failures

### 1. The GPU wasn't faster for dialog

On the standard `llama-bench` numbers, Vulkan on the iGPU looked like the obvious choice: 310 t/s prompt processing (pp256) vs 87 t/s on CPU. Broken down by prompt length, the picture changes:

| Prompt tokens | 16 | 32 | 64 | 128 | 256 |
|---|---|---|---|---|---|
| Vulkan (t/s) | 62 | 122 | 234 | 290 | 299 |
| CPU (t/s) | **77** | 82 | 67 | 74 | 74 |

Vulkan has a fixed per-call overhead that only pays off above roughly 64 tokens. With a warm prompt cache, each dialog turn only adds about 25–30 new tokens, which is exactly the range where the CPU wins. In the running app, time to first token was **1520 ms on CPU vs 2029 ms on Vulkan**, so the dialog runs on CPU. (The 1520 ms is an average across both history regimes described in #5.)

Thread scaling on the CPU build (tg64): 4 threads → 16.8 t/s, 6 → 18.3, **10 → 19.4**, 14 → 19.1, 20 → 15.7. Using all 20 threads is clearly slower, presumably because E-cores and SMT threads slow down the slowest thread. It's set to 10.

I also compared image description once per backend: 25.2 s on CPU, 38.5 s on Vulkan. That comparison isn't trustworthy. It's a single run each, and Vulkan ran first on a freshly started server while the CPU server and the app were also loaded. All I can say is that image description takes around 25 s.

### 2. The smaller Whisper model won

I expected `small` to be the safe default. On five German test sentences (synthesized with Piper, 1.4–2.9 s each), `base` took **476 ms** and `small` took **1404 ms**. Word error rates came out at 24.0 % vs 26.5 %, but those are inflated. The reference sentences were written without umlauts ("draussen", "Tuer") while Whisper outputs "draußen" and "Tür", so the numbers are only useful as a rough comparison, not as absolute accuracy.

The ~930 ms difference decided whether the 3 s target was reachable at all. Recognition latencies from my runtime logs (real microphone, mixed conditions) show a similar ratio: `base` median **610 ms** (n=17) vs `small` median **1181 ms** (n=29).

### 3. A confidence threshold that belonged to the wrong model

When I tested by voice, the system seemed to simply ignore me. The Whisper `avg_logprob` rejection threshold (−0.9) had been calibrated with `small`. After switching to `base`, it silently discarded correctly recognized sentences. The logs show "Ich bin jetzt in der Nähe." rejected at logprob −2.07. Through a real microphone, room reverb and short segments push the values much lower than on clean synthetic speech.

The fix was conceptual: VAD does the real filtering, and the threshold is only a safety net, so it's now deliberately loose (−2.5). A threshold that's too strict is the worse failure, because the system just appears to ignore you.

### 4. Whisper stalled on non-speech

Whisper's default temperature fallback retries decoding up to six times. On a non-speech signal every attempt falls into a repetition loop: **18 s to process 2 s of audio**. The first ASR benchmark used a synthetic tone and ended up measuring this hallucination instead of recognition. The fixes:

- `max_new_tokens=120`
- a shortened temperature chain `[0.0, 0.2]`
- a benchmark that uses real (Piper-synthesized) speech

### 5. The prompt cache stops helping once the history window is full

The prompt cache matters a lot. With a short system prompt, the first answer takes 3016 ms cold vs 572 ms warm; with a long one, 4139 ms vs 2495 ms. Hence the stable system-prompt prefix and the pre-warming.

What I missed at first is the history behind the system prompt. Time to first token jumps at **question 5**, in both the benchmark and the endurance run:

| | Questions 1–4 | From question 5 on |
|---|---|---|
| Benchmark (TTFT) | 1098, 903, 897, 871 ms | 1914, 1814, 1857, 1766 ms |
| Endurance run (TTFT, questions 2–4 vs rest) | 736, 793, 693 ms | ~2.5 s, consistently |

The likely explanation comes from reading the code, and I haven't confirmed it experimentally. With a 3-round history limit, the window is full from question 5 on. After that, every request drops the oldest round at the front. So the tokens right after the system prompt change every time, the KV cache no longer matches past that point, and the whole remaining history is processed again.

Two related things didn't pan out:

- **A suspected tokenization bug.** At one point the assistant's reply was stored with `.strip()`, which changes the leading token and in theory breaks the cache. Removing the strip made no measurable difference (2029 → 2122 ms). The code comment claiming "about 1000 ms" is wrong. The change that actually helped was moving from Vulkan to CPU.
- **History length.** An earlier in-app measurement (0 → 6 rounds: ~930 → ~2000 ms) was taken on the Vulkan backend. In an isolated test, 6 rounds only cost 477 → 555 ms. The real cost seems to come from the sliding window invalidating the cache, not from the number of rounds itself.

### 6. The motion gate that kept itself open

An earlier version updated the background model very slowly during motion (α = 0.001), to keep standing people in the foreground. The background model effectively froze, the difference stayed large, and "motion" kept itself active. It measured **85 % changed pixels for minutes**, so YOLO ran constantly and the gate did nothing.

The fix was to separate responsibilities. The gate only decides whether an *empty* scene needs YOLO, and it adapts quickly again (α 0.06 at rest, 0.02 during motion). Keeping a standing person detected is now the tracker's job: YOLO keeps running while confirmed tracks exist. `tests/test_bewegungsgate.py` specifically checks that the gate closes again after motion stops.

### 7. Windows camera quirks

- **Camera index 0 is not the webcam.** It's my Brother printer's scanner, which registers as a video device (640×480). The built-in camera is index 1.
- **DSHOW reported success but delivered black frames** on this camera; MSMF delivered real images. Both claim success, so "opened OK" means nothing.
- **MSMF delivers a frozen, byte-identical placeholder frame** for about a second after opening. It looks like real content.

So `warte_auf_echtes_bild()` accepts a frame only if it has content *and* changes between frames (real sensors always have noise). It also distinguishes a covered lens (frames change but mean ≈ 0) from a frozen placeholder. That turned out to be useful: my lens shutter was closed for most of development, and the log reported exactly that.

### 8. A thread leak in the error path

During the endurance run, the Wächter process grew by about 155 MB/h. OpenCV on this platform doesn't release the threads of `VideoCapture` objects, even after `release()`. Ten consecutive camera scans cost about +18 threads and +16 MB each, and never levelled off.

The trigger was the error handling. When opening the camera failed (lens shutter closed), the code ran a full device scan just to build a helpful error message, and it did that on every toggle. The fix was to cache the scan result for five minutes, and to abort a scan after two consecutive missing indices. Over 12 on/off cycles with the shutter closed:

| | per cycle |
|---|---|
| before | +30 threads, +23 MB |
| after | +16 threads, +11 MB |
| after, cache warm | **+1.4 threads, +3.8 MB** |

It isn't fully gone: every open attempt still creates a `VideoCapture`. In normal operation the camera opens once and stays open, and memory stayed flat between toggles.

### 9. The UI that looked fine but was dead

This was the other half of my "no reply, can't send anything" report. A newline had got into a JavaScript string literal in `index.html`. That aborted the whole script at load time. The live image and status bar kept working because they come before the error, but no button, toggle or save action responded. From outside it looked like a hung server while the backend was perfectly fine.

`tests/test_oberflaeche.py` now runs `node --check` on the script if Node is available. It also checks that every element ID the script references exists, looks for unbalanced brackets, and checks that every WebSocket message type has a handler.

### 10. Packaging trap: two onnxruntime packages

`faster-whisper` pulls in plain `onnxruntime`, which shares a module name with `onnxruntime-directml`. Whichever gets installed last wins, and if it's the CPU one, the DirectML provider silently disappears. `setup.ps1` checks the available providers at the end and reinstalls only the DirectML variant if needed.

## Results

All measurements are on the laptop described above.

**Latency budget to first spoken word** (component benchmarks, short dialog sentences):

| Step | Questions 1–4 | Once the history window is full |
|---|---|---|
| VAD detects end of speech | 350 ms | 350 ms |
| Whisper `base` transcribes | 494 ms | 494 ms |
| LLM to first complete sentence | 1737 ms | ~2050 ms (median) |
| Piper starts speaking | ~30 ms | ~30 ms |
| **Total** | **~2.6 s** | **~2.9 s** |

Both stay under the 3 s target, but the second column is the one a longer conversation actually sees.

**Component measurements:**

| Component | Value |
|---|---|
| YOLO11n, DirectML (Iris Xe) | 17–18 ms (live: 16.3–17.5 ms) |
| YOLO11n, CPU | 30–33 ms (~30–33 fps) |
| DirectML session, first build | ~21 s (kernel compilation); later < 0.5 s from driver cache |
| LLM text generation | 17–19 tok/s (component benchmark) |
| Piper real-time factor | 0.083 (voice load 0.35 s) |
| Image description | ~25 s (single runs) |
| Idle CPU, whole system | 12–15 % |
| RAM | ~5.3 GB (llama-server 4.7 GB + Wächter 0.5 GB) |
| Model files | Gemma Q4_K_M 2.3 GiB + mmproj 0.8 GiB, YOLO11n ONNX 10.2 MiB |

**Endurance run (30 minutes, not the planned 4 hours):** 43 questions with no crash. `llama-server` and `piper` memory stayed flat. The Wächter process grew, which led to the leak described above.

Latency in that run was worse than in the benchmark: **median TTFT 2564 ms at ~10.6 tok/s**. I checked whether the failing camera scans were responsible:

| Answers | n | Median TTFT | tok/s |
|---|---|---|---|
| ≤ 15 s after a failed camera open | 4 | 2706 ms | 8.9 |
| all others | 39 | 2564 ms | 10.8 |

The camera isn't the cause. The TTFT difference is mostly the history-window effect from #5, plus a longer system prompt than in the benchmark (344 vs 99 characters). Generation speed (~10 tok/s instead of 17–19) was already low on the very first answer, so the thread leak can't explain it either. **Why generation was slower in that run is still unexplained.**

**Self-recovery:** after killing `llama-server` and `piper`, everything was back about **43 s** later. Most of that is the supervisor: it waits 60 s after startup before its first check, so the kill was only detected ~34 s later. `llama-server` then took 7 s to come back, and Piper was back 2 s after that, with the prompt cache re-warmed. In normal operation, past the startup grace period, recovery should take roughly 10–25 s.

**Real-image triggers:** the log contains several real `person_naehert_sich` events with the shutter open (31 Aug evening and 2 Sep). In all of the 31 Aug cases, the person was sitting in front of the laptop. That shows the logic fires on real frames, but not that it detects someone walking 5 m toward a door.

**Tests without hardware:** approach logic and zone geometry (17 checks: 10 approach trajectories with ±6–8 px box jitter, 6 zone cases, 1 empty zone), the motion-gate self-latching case, anti-aliasing of the 48→16 kHz decimation, sentence splitting, and the static UI check.

## What I learned

- **Benchmark the workload you actually have.** "GPU is faster" was true for 256-token prompts and false for a cached dialog turn. The per-prompt-length breakdown reversed the decision.
- **A stable system prompt isn't a stable prefix.** Keeping the system prompt fixed protected only that part. A sliding history window shifts everything behind it on every request, and the cache quietly stops helping after four turns.
- **Averages hide regimes.** "1520 ms" blended two very different phases of a conversation. The question-by-question view showed a step, not noise.
- **Check that a fix actually fixed something.** The `.strip()` change sounded right, came with a confident comment, and measured no improvement.
- **Some capabilities need time, not a bigger model.** Approach detection is a question about box height over 1.5 s, and a single-frame VLM can't answer it at any size.
- **Design heuristics as vetoes when the common case breaks the requirement.** The frontal-approach case would have been suppressed by the more "obvious" rule.
- **Separate responsibilities in feedback loops.** The motion gate failed because it was doing two jobs (gating an empty scene *and* holding standing people). Splitting them fixed the self-latching.
- **Thresholds belong to a model.** Swapping Whisper `small` for `base` silently invalidated a confidence threshold. Every tuned constant needs to note what it was calibrated against.
- **"Opened successfully" is not evidence on Windows media APIs.** Camera backends report success with black or frozen frames. Validate the data, not the return code.
- **Error paths need the same resource discipline as the happy path.** The only real leak came from code written to produce a *nicer error message*.
- **Voice testing finds what unit tests don't.** Both "it ignores me" bugs (dead UI script, wrong threshold) surfaced from simply talking to it.

## Limitations

- **Detecting a real 5 m walk toward a door is untested.** Approach events have fired on real frames, but only with someone in front of the laptop. The rest is covered by synthetic tests.
- **Events that arrive while an answer is running are dropped**, not queued. The log shows approach and door-zone events discarded this way.
- **Latency degrades once the history window is full** (~2.9 s instead of ~2.6 s), and generation speed in the endurance run was low for reasons I haven't found yet.
- **The endurance run was 30 minutes, not 4 hours.**
- **Image description takes about 25 s**, so it's on-demand only. It doesn't run automatically on events.
- **No barge-in.** You can't interrupt the assistant by speaking; the mic is hard-muted during playback.
- **No automatic language detection.** It's a manual German/English switch. The English voice (Ryan) is installed and configured, but its playback hasn't been verified.
- **Windows-only**, tuned to one specific laptop (device names, camera index, backend order).
- **Single instance.** `start.bat` kills any running `llama-server`/`piper`, including those of another running instance.
- **It needs a logged-in user session** (deliberately not a Windows service, because camera and audio access need one). After a reboot, nothing runs until someone logs in.
- **The door zone only limits event evaluation, not what the camera sees.** Privacy and legal compliance (GDPR for cameras covering shared or public areas) depend on physically aiming the camera.
- **YOLO11n is AGPL-3.0**, which matters if this is ever distributed or offered as a service.

## Next steps

- Confirm the history-window explanation experimentally, then fix it: for example, drop history in blocks instead of one round at a time, or reset it at a natural boundary, so the prefix stays cache-stable for longer.
- Find out why generation ran at ~10 tok/s during the endurance run, logging CPU load, power state and thermals alongside each request.
- Queue events that arrive during an answer instead of dropping them.
- Run the real 4-hour endurance test.
- Measure the full perception chain with an actual walk toward a door, from first frame to `person_naehert_sich`.
- Redo the image-description backend comparison properly (several runs, same load).
- Re-measure word error rate with correctly spelled references and real microphone recordings, and re-calibrate the confidence threshold on those.
- Verify the English voice end-to-end.
- Evaluate barge-in with echo cancellation instead of a hard mic gate.
- Bring the README back in sync with `config.yaml` (confidence threshold, English voice, recovery time, test count).

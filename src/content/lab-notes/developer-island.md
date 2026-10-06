---
title: "Developer Island: a Dynamic Island for the Windows desktop"
summary: "A native WinUI 3 capsule that shows Claude Code and Codex usage, music, focus timer, meetings and machine health. It idles at 55 MB and 0.03 % of one CPU core, and most of the work went into a transparent window that morphs without ever being resized."
description: "A native Windows status capsule built with .NET 10 and WinUI 3: a fixed-size transparent window, spring morphs, event-driven providers that read local usage logs, and an idle cost measured in milliseconds."
metaTitle: "Developer Island — A Native Windows Status Capsule | Maximilian Köhlenbeck"
metaDescription: "A technical write-up of Developer Island: a transparent WinUI 3 window with spring morphs, incremental parsing of Claude Code and Codex logs, a race-safe state machine and idle cost measurements."
lang: en
published: 2026-10-06
stack: [C#, .NET 10, WinUI 3, Windows App SDK, SQLite, LibreHardwareMonitor, xUnit, Inno Setup]
architecture:
  - label: Data
    nodes: [Local logs, media sessions and sensors, Providers, Immutable snapshots, SQLite history]
  - label: Display
    nodes: [View models, State machine, Fixed-size transparent window, Composition springs]
metrics:
  - label: Idle, compact, 60 s window
    value: "55 MB working set, 16 ms CPU (0.03 % of one core)"
    highlight: "0.03 % CPU"
  - label: First scan, 42 Claude transcripts
    value: "about 14k events in 1.6 s, on a background thread"
  - label: Warm start
    value: "47 ms (only the changed transcript is re-read)"
  - label: System module sampling, 60 s
    value: "125 ms CPU (0.2 % of one core)"
  - label: Morph, compact to expanded
    value: "about 250 ms spring on the compositor thread"
  - label: Tests
    value: "382 unit tests"
links:
  github: https://github.com/maximilian467/Developer-Island
draft: true
---

## What I wanted to build

macOS has the notch and the Dynamic Island idea. Windows has nothing in that spot. I spend my day between a terminal, a media player, a calendar and Task Manager, and I also wanted to see how much of my Claude Code and Codex plan I had used without opening anything.

So I built a small capsule at the top of the screen. At rest it shows one thing, for example `Claude 1.12M · 72%`. On hover it shows a short peek, and on a click or **Ctrl + Alt + Space** it opens into a full view with usage, music, focus timer, calendar, tasks, Git, GitHub and system health.

I set these constraints early:

- **Native.** WinUI 3 on .NET 10, no web view and no Electron.
- **Local-first.** No account, no telemetry, no cloud sync. Usage is read from the tools' own logs, and only counts, model names, timestamps and session IDs are extracted. Prompt and code content is never stored or shown.
- **Cheap enough to run all day.** A module that is switched off runs no watcher, timer or process.

> **How this was built:** I specified the behavior and made the decisions at each step. Most of the code and the tests were written with Claude Code. The repository is public under the MIT license. The first version, 0.1.0, was released on 1 October 2026, about three days after the first commit.

## Architecture

The solution has two projects and a test project. `DeveloperIsland.Core` holds everything that does not need Windows UI: parsers, providers, pricing, storage, the island state machine and the module logic. The WinUI app adds views, windowing and Windows integration. Data flows one way:

```
local logs / media sessions / timers        (background threads)
        ↓
Provider → immutable snapshot → ProviderHost (isolation)
        ↓                              ↓
UsageHistoryService (SQLite)     marshalled to the UI thread
        ↓
View model (display strings) → View (compiled x:Bind, no parsing)
```

Providers never touch the UI. A view model formats numbers, durations and currency; a view only binds. An exception inside a provider becomes an error snapshot plus a log entry, so it cannot take the app down.

## Reading usage without polling

Claude Code writes one transcript line per content block and repeats the `usage` block on each of them, so counting lines would multiply the numbers. Events are de-duplicated by `message.id` plus `requestId`; Codex events by `response_id`. Only the usage fields, model, IDs, timestamp and working directory are read.

- **Cursors.** For every file, the app stores its length, write time and byte offset. After a restart, unchanged files are skipped and changed files are read from where they ended. That is why a warm start takes 47 ms instead of a full rescan.
- **Complete lines only.** A reader that sees half a JSON line leaves it for the next read.
- **Events, not polling.** A `FileSystemWatcher`, debounced by 0.9 s, drives incremental reads. A buffer overflow schedules a single rescan. Only two one-shot timers exist: one at local midnight and one that clears the "active" flag after 3 minutes of quiet.
- **Cheap filtering.** Lines are pre-filtered by substring before any JSON parsing.
- **Plan usage is reported, not computed.** Claude's 5-hour and weekly percentages come from Claude Code's documented status line input. The app registers itself as the status line command on request (with a backup, and never replacing an existing status line), keeps only those numbers and exits. Codex's windows come from its own rollout records. Nothing is derived from token counts.

The estimated API equivalent uses public list prices. A model without a known price stays unpriced and the total is marked partial, rather than borrowing a guess.

## The window

The hard part was not the data but making a floating, rounded, transparent window behave on Windows.

| Problem | Solution |
| --- | --- |
| Per-pixel transparency in WinUI 3 | A custom `SystemBackdrop` with a fully transparent composition brush, plus the DWM sheet-of-glass setup |
| Morph without resize jank | The window has a **fixed size** (the largest capsule plus a margin). Only a composition shape animates, with springs that can be retargeted mid-flight |
| Transparent areas blocking clicks | `SetWindowRgn` follows the capsule; during a morph it covers both shapes and shrinks when the springs settle |
| Shadow | `DropShadow` renders opaque on a transparent window, so a pre-rendered nine-grid texture is stretched instead |
| Focus stealing | `WS_EX_NOACTIVATE`: hover, click and drag never take focus. Esc returns focus to the previous window |
| Multiple monitors and DPI | Placement is pure math in physical pixels per monitor, recalculated after any DPI change |

All motion is composition animation. There is no render loop, nothing redraws while idle and there are no perpetual animations. Ticking values such as a focus countdown or a CPU percentage reserve the width of their widest form and use tabular figures, so the capsule does not re-measure and re-morph every second.

## The state machine and its races

`IslandStateMachine` decides between Hidden, Retracted (the 5 px notch), Compact, Activity (the peek) and Expanded, with dragging as a flag. Its inputs are named (`PointerEntered`, `HoverDelayElapsed`, `Clicked`, `ClickedOutside`, `ActiveAppChanged`, `ModuleEvent` and so on) and it lives in the tested core.

Most of the bugs in a window like this are races, so the rules are strict:

- Every timer carries a generation number. A timer that was overtaken by a newer input never acts.
- When a timer fires, a pointer probe reports where the pointer really is, so a lost pointer-exit cannot keep a peek open.
- A click counts only after the pointer moved onto the capsule. A capsule that grows under a resting mouse therefore cannot turn the next click into an expansion.
- While expanded, a low-level mouse hook closes the island on any press outside it. The hook exists only in that state.

**Auto-hide** retracts the island into the notch while Chrome, Edge, Firefox or any listed app is in front. A coordinator numbers every foreground change. Stepping aside applies at once, a return waits 80 ms and is verified against the real foreground window, and only the newest version may apply. The foreground watcher judges the root owner of the window that is actually in front, so a queued event from a fast switch or a browser popup cannot decide.

## What failed

- **The island vanished on every Alt+Tab.** The fullscreen detection treated the Alt+Tab switcher and Task View as fullscreen apps, because they cover the monitor without a caption. A policy in the core now ignores maximized windows, captioned windows, the app's own windows and shell surfaces.
- **Other always-on-top windows covered it.** Windows orders the topmost band by recency, so another app's topmost window that came to the front later sat above the island. The island now takes the top of the band again on every foreground switch with `SetWindowPos(HWND_TOPMOST, SWP_NOACTIVATE)`, which never activates it.
- **The usage graph ignored the mouse.** Pointer input went to the scroll area behind it.
- **Alt+F4 removed the island until the next start.** A close request while it is open is now cancelled and closes the island like Esc. Only Quit ends the app.
- **Helper processes outlived the app.** `git` and `gh` now run in a kill-on-close job object, so a call still running ends with the app.

Some limits are not bugs. CPU temperatures need administrator rights on many machines and many laptops expose no fan speed. Such sensors are hidden instead of estimated. Claude plan usage arrives only from Claude Code terminal sessions, because the VS Code extension does not provide the status line input.

## Measurements

Measured on 1 October 2026 on a Lenovo laptop (i7-13700H, Intel Iris Xe, on battery) with Windows 11, a 1920 × 1200 display at 125 % plus a 2560 × 1440 second monitor, a Release build, self-contained and x64. CPU time is from `Get-Process` over a 60 s window after the startup scan.

| Scenario | Working set | CPU |
| --- | ---: | ---: |
| Idle, compact, before the optimizations | 204 MB | 250 ms / 30 s (0.8 %) |
| Idle, compact, after | 55 MB | 16 ms / 60 s (0.03 %) |
| System module sampling at 1 Hz | not measured | 125 ms / 60 s (0.2 %) |

What brought idle cost down: events instead of polling, cursors instead of rescans, no re-layout on ticks, one compacting GC and a working-set trim after the first scan, and shipping only the Windows App SDK components the app needs, which saves about 45 MB. Workstation GC without concurrent background threads and ReadyToRun help the start. The System module's sensor library adds memory while it is on (113 MB working set in the measuring process), and turning the module off closes it.

## What I learned

A floating window is easy to draw and hard to make well-behaved. The visible part, the morph, was a small share of the work. The rest was deciding who owns focus, who owns the top of the z-order and what happens when two events arrive in the wrong order. Putting that logic in a UI-free core with named inputs and generation numbers made every one of those races testable.

## What I would do differently

I would write the fullscreen policy as tested core logic from the start instead of fixing it after it hid the island on every app switch. The installer is also not code-signed yet, so Windows SmartScreen asks for confirmation. Code signing, a winget package and update notifications are next.

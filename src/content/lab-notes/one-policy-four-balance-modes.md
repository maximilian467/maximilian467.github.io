---
title: "One Policy, Four Balance Modes"
summary: "Training a single reinforcement learning policy to swing, catch and hold a double pendulum on a cart in each of its four equilibria, and to switch between them on a keypress."
lang: en
published: 2026-09-14
stack: [Python, Gymnasium, MuJoCo, Stable-Baselines3, sb3-contrib (TQC), pygame, TypeScript]
metrics:
  - label: Best total success (TQC)
    value: "100 % at 1.7M steps (4×4 matrix, 5 episodes per cell, one seed)"
    highlight: "100 %"
  - label: SAC after 10.5M steps
    value: "Best total success 81 %, transitions into phase 1 still 0 %"
  - label: TQC training
    value: "~110 env steps/s, 1.7M steps in 269 min"
  - label: Hardware
    value: "Laptop CPU (i7-13700H), no NVIDIA GPU"
---

## What I wanted to build

This project continues a small RL learning path that is visible in the repository. First I trained PPO on Gymnasium's CartPole-v1 (100k steps). Then I trained PPO on the MuJoCo-based InvertedDoublePendulum-v5 (2M steps).

The next step was harder. The goal was not just to keep a double pendulum upright, but to move between all four equilibrium configurations on demand:

| Phase | Lower pole | Upper pole |
|---|---|---|
| 1 | up | up |
| 2 | up | down (hangs from the joint) |
| 3 | down | up (stands on the hanging pole) |
| 4 | down | down |

"Up" and "down" are absolute, measured against the world. Pressing 1–4 selects the target phase. I also wanted to nudge either pole at any time, including in the middle of a transition, and watch the policy recover.

## How it works

```
Keyboard (1–4)          MuJoCo state
      │                (x, ẋ, q1, q2, q̇1, q̇2)
      ▼                        │
 target phase                  ▼
  (one-hot, 4)        observation builder
      │               x, ẋ, sin/cos φ1, sin/cos φ2, ω1, ω2   (8)
      └──────────┬─────────────┘
                 ▼
        12-dim observation
                 ▼
     TQC actor (MLP 256–256, tanh)
                 ▼
        action ∈ [−1, 1] × 40 N
                 ▼
   MuJoCo step (4 × 5 ms, RK4)  ◄── optional nudge (external force on a pole)
                 ▼
            next state
```

There is one policy for all phases. The target phase is part of the observation, so "switching phase" only changes four input numbers.

During training, three extra parts run around this loop:

- a reward function,
- a curriculum that controls start states, target switches and random nudges,
- an evaluation step that scores every start→target transition and feeds the curriculum.

## Technical implementation

### Why a custom environment

InvertedDoublePendulum-v5 is built for upright balancing only:

- its rail is ±1 m,
- the episode ends as soon as the pendulum drops,
- the reward is fixed to "upright".

Swinging between configurations needs free rotation, a longer rail and a target-dependent reward. So I wrote a custom Gymnasium environment (`double_cartpole_env.py`) with its own MuJoCo model:

| Parameter | Value |
|---|---|
| Physics timestep / integrator | 5 ms, RK4 |
| Control rate | 50 Hz (frame skip 4) |
| Cart mass / pole mass / pole length | 1.0 kg / 0.5 kg / 0.6 m |
| Max motor force | 40 N |
| Rail | hard stop at ±2.4 m, episode fails beyond ±2.3 m (−10 penalty) |
| Training episode length | 20 s |

The environment is rendered with pygame as a 2D view instead of the MuJoCo 3D viewer. The system is planar, and pygame made keyboard control, a "ghost" target pose and a HUD straightforward.

### Observation and action

- **Observation (12 values):**
  - cart position and velocity (scaled),
  - sin/cos of both absolute pole angles,
  - both angular velocities (scaled),
  - the one-hot target phase.
- **Action:** a single value in [−1, 1], mapped to the cart force.

Sin/cos encoding avoids the angle wrap-around at ±π.

### One goal-conditioned policy instead of four

I chose a single goal-conditioned policy over four separate "hold" policies. The transitions are the hard part. Separate policies would still need swing-up controllers plus hand-written hand-over logic ("close enough to switch controllers?"). With one policy, a transition is simply what happens after the target input changes. A nudge is handled the same way, as recovery from an off-target state.

This was a design decision. I did not build the four-policy alternative for comparison.

### Reward (final version)

```
pose     = 0.5 · coarse + 0.5 · fine        # coarse: product of (1+cos(error))/2 per pole
                                             # fine:   exp(−(d1² + d2²) / (2 · 0.3²))
still    = exp(−0.05 · (ω1² + ω2²) − 0.1 · ẋ²)
energy   = 0.5 / (1 + (ΔE/2)²) + 0.5 · exp(−(ΔE/0.5)²)
upright  = 1 if within 0.2 rad and 1.5 rad/s of the target, else 0
center   = 1 − 0.5 · (x / 2.4)²

reward = (0.6 · pose · (0.4 + 0.6 · still) + 0.2 · energy + 0.2 · upright) · center − 0.005 · a²
```

ΔE is the mechanical energy of the poles minus the resting energy of the target configuration:

| Phase | Resting energy |
|---|---|
| 1 | +5.9 J |
| 2 | +2.9 J |
| 3 | −2.9 J |
| 4 | −5.9 J |

The energy term was added late. Why it matters is described below.

### Curriculum

The curriculum advances automatically based on the evaluation:

1. **Hold only.** Start near the target equilibrium. Advance at ≥ 90 % hold success.
2. **Transitions.** Start in one equilibrium, the target is usually a different one. Advance at ≥ 50 % transition success.
3. **Stage 3 adds:**
   - target switches every 3–7 s mid-episode,
   - stronger random nudges (up to 6 N for 0.1 s instead of 3 N).
4. **Stage 4 adds:**
   - "catch starts": 30 % of episodes start near the target, but tilted and with angular velocity;
   - adaptive target sampling: phases with low transition or catch success are sampled more often.

### Evaluation

Mean episode reward turned out to be a poor progress signal. Instead, every 100k steps the policy is scored deterministically on:

1. **A 4×4 success matrix.** Rows are start phases, columns are target phases, 5 episodes per cell, 10 s each. An episode counts as a success if the target is held stable for ≥ 1 s at the end (within 0.2 rad and 1.5 rad/s) and the cart stayed on the rail.
2. **A catch test.** 10 starts per phase, up to ±0.3 rad tilted with up to ±1.8 rad/s angular velocity.
3. **Maximum cart excursion per cell.**

### Deployment export

`export_web_policy.py` exports only the actor of the trained TQC model to a JSON file (weights base64-encoded as float32). The file also contains the observation layout, the phase targets and the physics constants.

Before exporting, the script checks the compiled MuJoCo model against the expected constants: masses, inertia, damping, gear, integrator. It also generates reference data for the website:

- 50 observation→action pairs from real rollouts, covering all phases, switches and nudges,
- 20 open-loop MuJoCo trajectories.

On the website, no MuJoCo engine is loaded. The actor's forward pass (two 256-unit ReLU layers, tanh output, deterministic) and the model's dynamics (RK4, 5 ms, 4 substeps per 50 Hz action) are reimplemented in TypeScript and run in the browser, using the constants from the exported JSON. Against the MuJoCo reference, the physics deviates only by rounding errors (max |Δ qpos| 2.8e-14). The site's tests check the forward pass on the 50 reference observations (max |Δ action| < 1e-4), the 20 open-loop trajectories (max |Δ qpos| < 1e-5, |Δ qvel| < 1e-4) and the 4×4 start/target matrix (every cell ≥ 80 %, mean ≥ 95 %). Only the actor weights are published. Visitors pick a pose and can nudge a pole with 3 N for 0.1 s; if the cart leaves the rail, the figure fades and restarts hanging.

A three-minute endurance benchmark with a pose switch every 20 s and a nudge every 4 s is not part of the tests, because the exported model itself does not pass it reliably: it stayed on the rail in 6 of 20 runs in MuJoCo (`model.predict`) and 9 of 20 in the TypeScript version. During long holds the cart also drifts from the center, most clearly when switching from up · up to down · down after holding for a while (MuJoCo: 4 of 10 stable after a 20 s hold).

## Experiments and failures

### 1. PPO lost what it had learned (previous project)

On InvertedDoublePendulum-v5, the best evaluation reward was ~9360. The final evaluations had dropped to 146–286. The best checkpoint had to be used instead of the last model.

### 2. PPO vs SAC on the phase-switching task

I ran both at the same time:

| | PPO (12 envs) | SAC (8 envs) |
|---|---|---|
| Throughput | ~7,500 env steps/s | ~250 env steps/s |
| Training steps | 150M | 8M |
| Best total success | 25 % | 81 % |
| Final total success | 13.8 % | ~76–81 % |

PPO was far cheaper per step but never learned the task with these settings. I did not tune PPO's hyperparameters.

### 3. SAC plateaued at exactly 81 %

81 % was not "almost solved". The matrix showed that 13 of 16 cells worked and every transition into phase 1 (both poles up) failed:

- Holding phase 1 from a near-upright start worked.
- Transitions 2→1, 3→1 and 4→1 were at 0 % from ~1.8M to 8M steps.

In ad-hoc rollouts (scripts not in the repo), the policy swung close to upright (within ~0.07 rad) but kept rotating through the top instead of stopping. It was stuck in a local optimum: every pass collects a little pose reward, while a failed catch costs more.

### 4. Two reward iterations did not fix it

SAC was resumed twice with changes.

**v2 (resumed at 8M steps):**

- added stage 4 (catch starts, adaptive target weights),
- stronger "stillness" weight,
- stronger cart-centering (the cart had drifted up to ~2 m during holds).

**v3 (resumed at 9.4M steps):**

- added the energy term,
- added the upright bonus,
- concentrated catch starts in the physically recoverable range,
- added the catch test to the evaluation.

After 10.5M total SAC steps, transitions into phase 1 were still at 0 %. Phase 1 catch success stayed between 0 and 20 %. Each reward change also caused a temporary performance drop on the pretrained agent: 81 % → 56 % in a short test after the v3 change.

### 5. Checking physics before blaming the algorithm

To see whether the phase 1 catch was physically possible, I built a discrete-time LQR controller from a finite-difference linearization of the MuJoCo model. I tested it on the same random catch starts as the RL policy. These were ad-hoc scripts, not in the repo.

| Start perturbation (angle / ang. velocity) | LQR, 40 N | SAC v2 policy |
|---|---|---|
| ±0.1 rad / ±0.6 rad/s | 20/20 | 15/20 |
| ±0.2 rad / ±1.2 rad/s | 18/20 | 9/20 |
| ±0.3 rad / ±1.8 rad/s | 12/20 | 3/20 |
| ±0.5 rad / ±3.0 rad/s | 3/20 | 1/20 |

With 80 N, LQR caught 8/20 at ±0.5 rad. Two conclusions:

- The recoverable region around phase 1 is small. The policy was arriving at ~5 rad/s with ~1.8 J of excess energy, far outside it.
- The policy caught worse than a simple linear controller. That made it a learning problem, not a physics limit.

This is what motivated the energy term: it rewards arriving at the target with roughly the right energy, even before the target is reached.

### 6. The compute bottleneck was real, not overhead

SAC and TQC were slow. SB3-contrib's TQC ran at ~140 env steps/s. So I profiled before switching frameworks. Everything below comes from ad-hoc scripts, not in the repo.

- **Environment only:** ~16,000 steps/s.
- **One SAC update:** ~13 ms. The profile shows nearly all of it in backward passes, linear layers and Adam. Replay buffer sampling took 0.08 ms.
- **One TQC update:** ~18–22 ms.
- **For comparison,** a single raw 256×256 MLP update: ~1.2–1.5 ms. A SAC update contains several network passes (actor, critics, target critics), so the cost adds up.
- **SBX (JAX):** no gain on this machine (SAC 249 vs 238 steps/s, TQC 142 vs 142). Its first install failed on Windows' path length limit, inside a dependency (orbax-checkpoint).
- **Bigger batches:** 4× the batch size gave only ~1.4× the samples processed per second.
- **Hardware:** a laptop CPU without an NVIDIA GPU. It is the same machine as in [Wächter](/lab-notes/waechter/): a Lenovo ThinkBook 16 G6 IRL with an i7-13700H (6 P-cores + 8 E-cores), 32 GB DDR5, Intel Iris Xe iGPU, Windows 11.

### 7. Smaller bugs found along the way

- **Resuming with an empty replay buffer.** When loading a saved off-policy model, `learning_starts` counts against the already reached step count, so learning would restart immediately on a nearly empty buffer. Fixed by pushing `learning_starts` 20k steps ahead of the current step.
- **Energy formula mismatch.** The first kinetic-energy formula treated the poles as ideal rods and was off by up to ~6 % against MuJoCo, because the poles are capsules. Fixed by reading the inertia from the compiled MuJoCo model; the check then showed 0.00 % deviation.
- **Invisible poles.** In phases 2 and 3 the two poles overlap and one hid the other. Fixed by drawing the upper pole thinner.
- **Misleading success.** A 1→3 transition counted as a success although the cart reached ~2.03 m, close to the 2.3 m limit. That led to adding cart excursion to the evaluation.

### 8. Switching to TQC, trained from scratch

After ~10.5M SAC steps without progress on phase 1, I switched to TQC (sb3-contrib). It was trained from scratch with the final reward and the automatic curriculum (1 → 2 → 4). Settings otherwise matched SAC: 8 envs, batch 256, 4 gradient steps per env step, [256, 256] networks. TQC used 2 critics with 25 quantiles each and dropped the top 2 quantiles per critic.

## Results

| Run | Steps | Best total success | Transitions into phase 1 | Phase 1 catch test |
|---|---|---|---|---|
| PPO | 150M | 25 % | – | not measured |
| SAC (v1) | 8M | 81 % | 0 % | not measured |
| SAC v2 (resumed) | 9.4M | 81 % | 0 % | not measured |
| SAC v3 (resumed) | 10.5M | 81 % | 0 % | 0–20 % |
| TQC (from scratch) | 1.7M | 100 % | 100 % | 100 % |

TQC progression:

| Steps | Wall clock | Stage | Hold | Transitions | Total | Catch (Z1/Z2/Z3/Z4) |
|---|---|---|---|---|---|---|
| 1.0M | 195 min | 2 | 100 % | 65 % | 74 % | 70 / – / – / – % |
| 1.4M | 239 min | 4 | 100 % | 97 % | 98 % | 100 / – / – / – % |
| 1.7M | 269 min | 4 | 100 % | 100 % | 100 % | 100 / 100 / 90 / 100 % |
| 2.0M | 299 min | 4 | 100 % | 95 % | 96 % | 90 / 100 / 100 / 100 % |
| 2.1M | 309 min | 4 | 100 % | 97 % | 98 % | 100 / 100 / 100 / 100 % |

Training throughput for TQC was ~110 env steps/s.

## What I learned

- **A per-transition success matrix beats mean reward.** "81 %" hid one structural failure, not general weakness.
- **Check physical feasibility with a classical controller first.** The LQR comparison separated "impossible" from "not learned yet" and showed which quantity mattered: the energy at arrival.
- **Local optima in shaped rewards can be very stable.** A policy that rotates through the goal earns periodic reward and has no incentive to risk a catch.
- **Changing the reward on a pretrained off-policy agent is not free.** Performance dropped first while the critic re-adjusted.
- **Profile before changing frameworks.** The bottleneck was genuine network computation, so a faster framework could not help on this CPU.
- **I cannot attribute the success to TQC alone.** The TQC run changed several things at once:
  - a different algorithm,
  - a fresh start instead of a resumed agent,
  - the final reward and curriculum from the beginning.

## Limitations

- **Small-sample evaluation.** One seed per run, 5 episodes per matrix cell and 10 catch episodes per phase, with fixed evaluation seeds. Results fluctuate between evaluations: at 2.1M steps, 4→1 was 60 % and the cart reached 2.33 m in that cell, beyond the 2.3 m limit.
- **Confounded comparison.** SAC was never trained from scratch with the final reward and curriculum.
- **Nudges are not evaluated.** They are trained (up to 6 N) but not part of the metrics.
- **Simulation only.** Full state observation, an ideal motor, simple joint damping, no sensor noise or delay.
- **PPO hyperparameters were not tuned.**

## Next steps

- Controlled ablation: SAC from scratch with the final reward and curriculum, several seeds for both SAC and TQC.
- Nudge robustness as a proper metric (success vs. nudge force per phase).
- CrossQ as an additional off-policy baseline.
- Commit the diagnostic scripts (LQR baseline, profiling) so the failure analysis is reproducible.
- Tighter cart usage for the 4→1 transition.

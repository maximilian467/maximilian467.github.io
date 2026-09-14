// Endurance benchmark for the trained double pendulum model. Not part of CI: it measures the model, not the implementation.
// Scenario: 20 seeds, 3 minutes each, a switch to a random other pose every 20 s, a 3 N / 0.1 s nudge every 4 s.
// Reference (14.09.2026): this TypeScript simulation 9/20 without leaving the rail; real MuJoCo with model.predict 6/20.
// Main weakness: holding a pose drifts the cart off centre, and the next transition then runs out of rail.
import { readFileSync } from 'node:fs';
import {
  act, createNetwork, createSimulation, equilibriumStart, failed, nudge, observe, setTarget, stable, step, type Policy,
} from '../src/lib/double-pendulum.ts';

const policy: Policy = JSON.parse(readFileSync('public/models/double-pendulum-policy.json', 'utf8'));
const network = createNetwork(policy);
const STEPS_PER_SECOND = Math.round(1 / (policy.physics.timestep * policy.physics.frameSkip));
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sim = createSimulation(policy), obs = new Float32Array(12), results: string[] = [];
let survived = 0, reached = 0, windows = 0;
for (let seed = 1; seed <= 20; seed++) {
  const random = seeded(seed * 7919);
  equilibriumStart(sim, 3, random);
  setTarget(sim, 3);
  let alive = true, failStep = -1;
  for (let k = 0; k < 3 * 60 * STEPS_PER_SECOND; k++) {
    if (k % (20 * STEPS_PER_SECOND) === 0) {
      if (k > 0) { windows++; if (stable(sim)) reached++; }
      setTarget(sim, (sim.target + 1 + Math.floor(random() * 3)) % 4);
    }
    if (k > 0 && k % (4 * STEPS_PER_SECOND) === 0) nudge(sim, random() < .5 ? 1 : 2, random() < .5 ? -3 : 3, .1);
    step(sim, act(network, observe(sim, policy, obs)));
    if (failed(sim)) { alive = false; failStep = k; break; }
  }
  if (alive) { survived++; windows++; if (stable(sim)) reached++; }
  results.push(alive ? `${seed}:ok` : `${seed}:out@${(failStep / STEPS_PER_SECOND).toFixed(1)}s`);
}
console.log(`Endurance: ${survived}/20 runs without leaving the rail; pose held stably at the end of ${reached}/${windows} 20 s windows.`);
console.log(results.join(' '));

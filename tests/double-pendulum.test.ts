import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  act, createNetwork, createSimulation, equilibriumStart, failed, nudge, observe, setTarget, stable, step, type Policy,
} from '../src/lib/double-pendulum.ts';

const policy: Policy = JSON.parse(readFileSync('public/models/double-pendulum-policy.json', 'utf8'));
const reference = JSON.parse(readFileSync('tests/fixtures/double-pendulum-reference.json', 'utf8'));
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

test('Gate A: forward pass matches model.predict on 50 reference observations', () => {
  let worst = 0;
  for (const pair of reference.pairs) {
    const delta = Math.abs(act(network, Float32Array.from(pair.obs)) - pair.action);
    worst = Math.max(worst, delta);
  }
  console.log(`  forward pass: ${reference.pairs.length} pairs, max |Δ action| = ${worst.toExponential(2)}`);
  assert.ok(worst < 1e-4, `max |Δ action| ${worst}`);
});

test('Gate A: observation matches the reference rollout', () => {
  // Rebuild the observation from the state implied by the reference observation and compare after float32 rounding.
  const sim = createSimulation(policy), out = new Float32Array(12);
  for (const pair of reference.pairs) {
    const [xs, vs, s1, c1, s2, c2, o1, o2] = pair.obs as number[];
    sim.qpos[0] = xs! * policy.observation.xScale; sim.qvel[0] = vs! * policy.observation.xdotScale;
    const phi1 = Math.atan2(s1!, c1!), phi2 = Math.atan2(s2!, c2!);
    sim.qpos[1] = phi1; sim.qpos[2] = phi2 - phi1;
    sim.qvel[1] = o1! * policy.observation.omegaScale; sim.qvel[2] = (o2! - o1!) * policy.observation.omegaScale;
    sim.target = pair.target;
    observe(sim, policy, out);
    for (let i = 0; i < 12; i++) assert.ok(Math.abs(out[i]! - pair.obs[i]) < 1e-6, `obs ${i}: ${out[i]} vs ${pair.obs[i]}`);
  }
});

test('Gate A: open-loop trajectories match MuJoCo', () => {
  let worstPos = 0, worstVel = 0;
  const sim = createSimulation(policy);
  reference.trajectories.forEach((trajectory: any, index: number) => {
    sim.qpos.set(trajectory.qpos0); sim.qvel.set(trajectory.qvel0); sim.nudgeStepsLeft = 0;
    let pos = 0, vel = 0;
    trajectory.actions.forEach((action: number, k: number) => {
      for (const n of trajectory.nudges) if (n.step === k) nudge(sim, n.pole, n.force);
      step(sim, action);
      for (let i = 0; i < 3; i++) {
        pos = Math.max(pos, Math.abs(sim.qpos[i]! - trajectory.qpos[k][i]));
        vel = Math.max(vel, Math.abs(sim.qvel[i]! - trajectory.qvel[k][i]));
      }
    });
    assert.ok(pos < 1e-5 && vel < 1e-4, `trajectory ${index}: max |Δ qpos| ${pos}, max |Δ qvel| ${vel}`);
    worstPos = Math.max(worstPos, pos); worstVel = Math.max(worstVel, vel);
  });
  console.log(`  open loop: ${reference.trajectories.length} trajectories × 50 steps, max |Δ qpos| = ${worstPos.toExponential(2)}, max |Δ qvel| = ${worstVel.toExponential(2)}`);
});

test('Gate B: 4x4 start/target matrix, 5 episodes per cell, 10 s', () => {
  const sim = createSimulation(policy), obs = new Float32Array(12);
  const matrix: number[][] = [];
  let seed = 12345;
  for (let start = 0; start < 4; start++) {
    const row: number[] = [];
    for (let target = 0; target < 4; target++) {
      let successes = 0;
      for (let episode = 0; episode < 5; episode++) {
        equilibriumStart(sim, start, seeded(seed++));
        setTarget(sim, target);
        let alive = true;
        for (let k = 0; k < 10 * STEPS_PER_SECOND; k++) {
          step(sim, act(network, observe(sim, policy, obs)));
          if (failed(sim)) { alive = false; break; }
        }
        if (alive && stable(sim)) successes++;
      }
      row.push(successes / 5);
    }
    matrix.push(row);
  }
  const mean = matrix.flat().reduce((a, b) => a + b, 0) / 16;
  console.log('  matrix (row = start, column = target):');
  for (const row of matrix) console.log('   ', row.map(v => `${Math.round(v * 100)}%`.padStart(5)).join(' '));
  console.log(`  mean ${Math.round(mean * 100)}%`);
  assert.ok(matrix.flat().every(v => v >= .8), 'a cell is below 80%');
  assert.ok(mean >= .95, `mean ${mean}`);
});

// The three-minute endurance run measures the trained model, not this implementation: real MuJoCo with
// model.predict leaves the rail in the same scenario too. It lives in scripts/bench-double-pendulum.ts.

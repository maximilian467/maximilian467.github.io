import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { action, step, failed, initialState, type Policy, type State } from '../src/lib/cartpole.ts';
const policy: Policy = JSON.parse(readFileSync('public/models/cartpole-policy.json', 'utf8'));
test('Gymnasium Euler reference from the zero state', () => {
  const actual = step([0, 0, 0, 0], 1, policy.physics);
  const expected = [0, .1951219512195122, 0, -.2926829268292683];
  actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]!) < 1e-12));
});
test('Argmax breaks a tie to the first action', () => {
  const tie = { ...policy, hidden: [], action: { W: [[0,0,0,0], [0,0,0,0]], b: [0,0] } };
  assert.equal(action(tie, [0,0,0,0]), 0);
});
test('20 seeded ten-minute runs survive nudges every five seconds', () => {
  for (let seed = 1; seed <= 20; seed++) {
    let rng = seed;
    const random = () => { rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0; return rng / 4294967296; };
    let state: State = initialState(random);
    for (let i = 0; i < 30000; i++) {
      if (i > 0 && i % 250 === 0) state[3] += random() < .5 ? -.6 : .6;
      state = step(state, action(policy, state), policy.physics);
      assert.ok(!failed(state, policy.physics), `seed ${seed}, step ${i}`);
    }
  }
});

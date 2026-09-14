// Double pendulum on a cart: the trained TQC actor and a reimplementation of the MuJoCo model it was trained in.
// Coordinates follow MuJoCo: qpos = [x, q1, q2] with q2 relative to pole 1, qvel = [xdot, v1, v2].
// Absolute angles: phi1 = q1, phi2 = q1 + q2; 0 = upright, pi = hanging.
export interface Physics {
  timestep: number; frameSkip: number; gravity: number;
  cartMass: number; poleMass: number; poleLength: number; poleCom: number; poleInertia: number;
  damping: [number, number, number]; motorGear: number;
  railLimit: number; xTerminate: number; nudgeForce: number; nudgeSeconds: number;
  stableAngle: number; stableOmega: number; stableSeconds: number;
}
export interface LayerSpec { name: string; in: number; out: number; activation: 'relu' | 'tanh'; weight: string; bias: string; }
export interface Policy {
  format: string; algorithm: string; layers: LayerSpec[];
  observation: { size: number; xScale: number; xdotScale: number; omegaScale: number; clip: number; };
  phases: [number, number][]; physics: Physics;
}
interface Layer { inputs: number; outputs: number; relu: boolean; weight: Float32Array; bias: Float32Array; output: Float64Array; }
export interface Network { layers: Layer[]; }

function float32(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  // Copy through DataView so the weights are read as little-endian on every platform.
  const view = new DataView(bytes.buffer), values = new Float32Array(bytes.length / 4);
  for (let i = 0; i < values.length; i++) values[i] = view.getFloat32(i * 4, true);
  return values;
}
export function createNetwork(policy: Policy): Network {
  const layers = policy.layers.map(spec => {
    const weight = float32(spec.weight), bias = float32(spec.bias);
    if (weight.length !== spec.in * spec.out || bias.length !== spec.out) throw new Error(`Invalid layer ${spec.name}`);
    return { inputs: spec.in, outputs: spec.out, relu: spec.activation === 'relu', weight, bias, output: new Float64Array(spec.out) };
  });
  if (layers[0]?.inputs !== policy.observation.size || layers[layers.length - 1]?.outputs !== 1) throw new Error('Invalid network shape');
  return { layers };
}
/** Deterministic TQC action: tanh(mu(relu(W2 relu(W1 obs + b1) + b2))). */
export function act(network: Network, observation: ArrayLike<number>) {
  let input: ArrayLike<number> = observation;
  for (const layer of network.layers) {
    const { inputs, outputs, weight, bias, output } = layer;
    for (let i = 0; i < outputs; i++) {
      let sum = bias[i]!;
      const row = i * inputs;
      for (let j = 0; j < inputs; j++) sum += weight[row + j]! * input[j]!;
      output[i] = layer.relu ? (sum > 0 ? sum : 0) : sum;
    }
    input = output;
  }
  return Math.tanh(input[0]!);
}

export interface Simulation {
  physics: Physics; phases: [number, number][];
  qpos: Float64Array; qvel: Float64Array;
  target: number; stableSteps: number; steps: number;
  nudgePole: 1 | 2; nudgeForce: number; nudgeStepsLeft: number;
  // Scratch buffers for RK4, allocated once.
  work: Float64Array;
}
export function createSimulation(policy: Policy): Simulation {
  return {
    physics: policy.physics, phases: policy.phases,
    qpos: new Float64Array(3), qvel: new Float64Array(3),
    target: 3, stableSteps: 0, steps: 0, nudgePole: 2, nudgeForce: 0, nudgeStepsLeft: 0,
    work: new Float64Array(3 * 8),
  };
}
export function setState(sim: Simulation, x: number, phi1: number, phi2: number, xdot: number, w1: number, w2: number) {
  sim.qpos[0] = x; sim.qpos[1] = phi1; sim.qpos[2] = phi2 - phi1;
  sim.qvel[0] = xdot; sim.qvel[1] = w1; sim.qvel[2] = w2 - w1;
}
/** Start near a phase's equilibrium with small uniform noise, like the evaluation reset. */
export function equilibriumStart(sim: Simulation, phase: number, random: () => number = Math.random, noise = .05) {
  const [t1, t2] = sim.phases[phase]!;
  const u = (a: number) => (random() * 2 - 1) * a;
  // Same draw order as _equilibrium_start: x, phi1, phi2, xdot, w1, w2.
  const x = u(.3), phi1 = t1 + u(noise), phi2 = t2 + u(noise), xdot = u(.1), w1 = u(noise), w2 = u(noise);
  setState(sim, x, phi1, phi2, xdot, w1, w2);
  sim.stableSteps = 0; sim.steps = 0; sim.nudgeStepsLeft = 0;
}
export function setTarget(sim: Simulation, phase: number) {
  sim.target = phase; sim.stableSteps = 0;
}
/** Horizontal force on pole 1 (lower) or 2 (upper), applied at its center of mass. Positive pushes right. */
export function nudge(sim: Simulation, pole: 1 | 2, force = sim.physics.nudgeForce, seconds = sim.physics.nudgeSeconds) {
  sim.nudgePole = pole; sim.nudgeForce = force;
  sim.nudgeStepsLeft = Math.max(1, Math.round(seconds / (sim.physics.timestep * sim.physics.frameSkip)));
}

/** Generalized accelerations from Lagrange's equations, written into out[offset..offset+2]. */
function acceleration(p: Physics, qpos: ArrayLike<number>, qvel: ArrayLike<number>, force: number, nudgePole: number, nudgeForce: number, out: Float64Array, offset: number) {
  const m = p.poleMass, L = p.poleLength, c = p.poleCom, I = p.poleInertia, g = p.gravity;
  const phi1 = qpos[1]!, phi2 = qpos[1]! + qpos[2]!;
  const w1 = qvel[1]!, w2 = qvel[1]! + qvel[2]!;
  const s1 = Math.sin(phi1), c1 = Math.cos(phi1), s2 = Math.sin(phi2), c2 = Math.cos(phi2);
  const s12 = Math.sin(phi1 - phi2), c12 = Math.cos(phi1 - phi2);
  // Mass matrix in absolute coordinates [x, phi1, phi2] (symmetric).
  const a11 = p.cartMass + 2 * m, a12 = m * (c + L) * c1, a13 = m * c * c2;
  const a22 = m * c * c + I + m * L * L, a23 = m * L * c * c12, a33 = m * c * c + I;
  // Viscous damping acts on MuJoCo's generalized velocities; map it to absolute coordinates with T^-T.
  const tx = -p.damping[0] * qvel[0]!, t1 = -p.damping[1] * qvel[1]!, t2 = -p.damping[2] * qvel[2]!;
  let r1 = force + m * (c + L) * s1 * w1 * w1 + m * c * s2 * w2 * w2 + tx;
  let r2 = -m * L * c * s12 * w2 * w2 + m * g * (c + L) * s1 + t1 - t2;
  let r3 = m * L * c * s12 * w1 * w1 + m * g * c * s2 + t2;
  if (nudgeForce !== 0) {
    // Force at the pole's center of mass, mapped through the Jacobian of that point's x coordinate.
    r1 += nudgeForce;
    if (nudgePole === 1) r2 += nudgeForce * c * c1;
    else { r2 += nudgeForce * L * c1; r3 += nudgeForce * c * c2; }
  }
  // Solve the symmetric 3x3 system with Cramer's rule.
  const m11 = a22 * a33 - a23 * a23, m12 = a13 * a23 - a12 * a33, m13 = a12 * a23 - a13 * a22;
  const det = a11 * m11 + a12 * m12 + a13 * m13;
  const m22 = a11 * a33 - a13 * a13, m23 = a12 * a13 - a11 * a23, m33 = a11 * a22 - a12 * a12;
  const xacc = (m11 * r1 + m12 * r2 + m13 * r3) / det;
  const p1acc = (m12 * r1 + m22 * r2 + m23 * r3) / det;
  const p2acc = (m13 * r1 + m23 * r2 + m33 * r3) / det;
  out[offset] = xacc; out[offset + 1] = p1acc; out[offset + 2] = p2acc - p1acc;
}

/** One MuJoCo RK4 step of `timestep` with constant control and applied force. */
function rk4(sim: Simulation, force: number, nudgeForce: number) {
  const { physics: p, qpos, qvel, work } = sim;
  const h = p.timestep;
  // work layout: [0..11] accelerations of stages 1 to 4, [12..14] stage qpos, [15..17] stage qvel,
  // [18..23] velocities of stages 2 and 3. The stage 4 velocity stays in the stage qvel buffer.
  const sq = work.subarray(12, 15), sv = work.subarray(15, 18), vel = work.subarray(18, 24);
  acceleration(p, qpos, qvel, force, sim.nudgePole, nudgeForce, work, 0);
  for (let i = 0; i < 3; i++) { sq[i] = qpos[i]! + h / 2 * qvel[i]!; sv[i] = qvel[i]! + h / 2 * work[i]!; vel[i] = sv[i]!; }
  acceleration(p, sq, sv, force, sim.nudgePole, nudgeForce, work, 3);
  for (let i = 0; i < 3; i++) { sq[i] = qpos[i]! + h / 2 * vel[i]!; sv[i] = qvel[i]! + h / 2 * work[3 + i]!; vel[3 + i] = sv[i]!; }
  acceleration(p, sq, sv, force, sim.nudgePole, nudgeForce, work, 6);
  for (let i = 0; i < 3; i++) { sq[i] = qpos[i]! + h * vel[3 + i]!; sv[i] = qvel[i]! + h * work[6 + i]!; }
  acceleration(p, sq, sv, force, sim.nudgePole, nudgeForce, work, 9);
  for (let i = 0; i < 3; i++) {
    const dq = qvel[i]! / 6 + vel[i]! / 3 + vel[3 + i]! / 3 + sv[i]! / 6;
    const dv = work[i]! / 6 + work[3 + i]! / 3 + work[6 + i]! / 3 + work[9 + i]! / 6;
    qpos[i] = qpos[i]! + h * dq; qvel[i] = qvel[i]! + h * dv;
  }
}

/** One control step (50 Hz): applies a pending nudge, integrates frameSkip RK4 steps, updates stability. */
export function step(sim: Simulation, action: number) {
  const p = sim.physics;
  const force = p.motorGear * Math.min(1, Math.max(-1, action));
  let nudgeForce = 0;
  if (sim.nudgeStepsLeft > 0) { nudgeForce = sim.nudgeForce; sim.nudgeStepsLeft--; }
  for (let i = 0; i < p.frameSkip; i++) rk4(sim, force, nudgeForce);
  sim.steps++;
  sim.stableSteps = stableNow(sim) ? sim.stableSteps + 1 : 0;
}

export function wrapAngle(a: number) {
  const tau = 2 * Math.PI;
  return ((a + Math.PI) % tau + tau) % tau - Math.PI;
}
export function angles(sim: Simulation) {
  return { phi1: sim.qpos[1]!, phi2: sim.qpos[1]! + sim.qpos[2]!, w1: sim.qvel[1]!, w2: sim.qvel[1]! + sim.qvel[2]! };
}
export function stableNow(sim: Simulation) {
  const p = sim.physics, [t1, t2] = sim.phases[sim.target]!;
  const phi1 = sim.qpos[1]!, phi2 = phi1 + sim.qpos[2]!, w1 = sim.qvel[1]!, w2 = w1 + sim.qvel[2]!;
  return Math.abs(wrapAngle(phi1 - t1)) < p.stableAngle && Math.abs(wrapAngle(phi2 - t2)) < p.stableAngle
    && Math.abs(w1) < p.stableOmega && Math.abs(w2) < p.stableOmega;
}
/** True once the target pose has been held for stableSeconds. */
export function stable(sim: Simulation) {
  const p = sim.physics;
  return sim.stableSteps * p.timestep * p.frameSkip >= p.stableSeconds - 1e-9;
}
export function failed(sim: Simulation) {
  for (let i = 0; i < 3; i++) if (!Number.isFinite(sim.qpos[i]!) || !Number.isFinite(sim.qvel[i]!)) return true;
  return Math.abs(sim.qpos[0]!) > sim.physics.xTerminate;
}
/** Observation exactly like _obs(): float32, clipped to [-clip, clip]. */
export function observe(sim: Simulation, policy: Policy, out: Float32Array) {
  const o = policy.observation, clip = o.clip;
  const phi1 = sim.qpos[1]!, phi2 = phi1 + sim.qpos[2]!, w1 = sim.qvel[1]!, w2 = w1 + sim.qvel[2]!;
  // Writing into a Float32Array performs numpy's astype(float32) rounding.
  out[0] = sim.qpos[0]! / o.xScale; out[1] = sim.qvel[0]! / o.xdotScale;
  out[2] = Math.sin(phi1); out[3] = Math.cos(phi1); out[4] = Math.sin(phi2); out[5] = Math.cos(phi2);
  out[6] = w1 / o.omegaScale; out[7] = w2 / o.omegaScale;
  // ±clip is exact in float32, so clipping after the rounding matches np.clip before it.
  for (let i = 0; i < 8; i++) out[i] = Math.min(clip, Math.max(-clip, out[i]!));
  for (let i = 0; i < 4; i++) out[8 + i] = i === sim.target ? 1 : 0;
  return out;
}

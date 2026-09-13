export type State = [number, number, number, number];
export interface Layer { W: number[][]; b: number[]; }
export interface Physics {
  gravity: number; masscart: number; masspole: number; length: number;
  force_mag: number; tau: number; theta_threshold_rad: number; x_threshold: number;
}
export interface Policy { hidden: Layer[]; action: Layer; physics: Physics; }
function linear(layer: Layer, input: number[]) {
  return layer.W.map((row, i) => row.reduce((sum, w, j) => sum + w * input[j]!, layer.b[i]!));
}
export function action(policy: Policy, state: State): 0 | 1 {
  let h: number[] = state;
  for (const layer of policy.hidden) h = linear(layer, h).map(Math.tanh);
  const logits = linear(policy.action, h);
  return logits[1]! > logits[0]! ? 1 : 0;
}
export function step(state: State, choice: 0 | 1, p: Physics): State {
  const [x, velocity, theta, angularVelocity] = state;
  const force = choice === 1 ? p.force_mag : -p.force_mag;
  const cos = Math.cos(theta), sin = Math.sin(theta);
  const totalMass = p.masscart + p.masspole;
  const polemassLength = p.masspole * p.length;
  const temp = (force + polemassLength * angularVelocity ** 2 * sin) / totalMass;
  const thetaAcc = (p.gravity * sin - cos * temp) / (p.length * (4 / 3 - p.masspole * cos ** 2 / totalMass));
  const xAcc = temp - polemassLength * thetaAcc * cos / totalMass;
  // Gymnasium's explicit Euler order: positions use velocities from the old state.
  return [x + p.tau * velocity, velocity + p.tau * xAcc, theta + p.tau * angularVelocity, angularVelocity + p.tau * thetaAcc];
}
export function failed(state: State, p: Physics) {
  return state.some(v => !Number.isFinite(v)) || Math.abs(state[0]) > p.x_threshold || Math.abs(state[2]) > p.theta_threshold_rad;
}
export function initialState(random = Math.random): State {
  return [random() * .1 - .05, random() * .1 - .05, random() * .1 - .05, random() * .1 - .05];
}

import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;

/** Spring helper starting at `delay` frames. */
export const spr = (frame: number, delay = 0, config: Partial<{ damping: number; stiffness: number; mass: number }> = {}, durationInFrames?: number) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping: 12, stiffness: 140, mass: 0.8, ...config }, durationInFrames });

/** Clamped interpolate with optional easing. */
export const lerp = (frame: number, input: [number, number], output: [number, number], easing: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Multi-keyframe interpolation, clamped, eased per segment. */
export const keys = (frame: number, input: number[], output: number[], easing: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const easeOutBack = Easing.out(Easing.back(1.7));
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);

/** Deterministic pseudo-random in [0,1) from a numeric seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Smooth deterministic noise in [-1,1]. */
export const noise1 = (t: number, seed = 0) => {
  const i = Math.floor(t);
  const f = t - i;
  const a = rand(i + seed * 1000) * 2 - 1;
  const b = rand(i + 1 + seed * 1000) * 2 - 1;
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
};

/** Camera shake offset that decays after `start`. */
export const shake = (frame: number, start: number, intensity = 20, duration = 12) => {
  const t = frame - start;
  if (t < 0 || t > duration) return { x: 0, y: 0 };
  const k = 1 - t / duration;
  return { x: noise1(t * 1.7, 1) * intensity * k, y: noise1(t * 1.7, 2) * intensity * k };
};

/** Periodic natural blink (0..1). */
export const autoBlink = (frame: number, offset = 0, period = 84) => {
  const t = (frame + offset) % period;
  if (t > 6) return 0;
  return t < 3 ? t / 3 : (6 - t) / 3;
};

/** Squash & stretch factor driven by a landing spring. */
export const squash = (frame: number, at: number, amount = 0.25) => {
  const t = frame - at;
  if (t < 0) return { sx: 1, sy: 1 };
  const s = Math.exp(-t / 6) * Math.cos(t * 0.7) * amount;
  return { sx: 1 + s, sy: 1 - s };
};

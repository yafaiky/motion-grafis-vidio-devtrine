// Devtrine Studio — procedural audio generator.
// Synthesizes every sound effect and the scored background music from scratch,
// so all audio in the project is original and free to use (no third-party samples).
//
// Usage: npm run audio   →  writes WAV files to public/audio/sfx and public/audio/bgm

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SFX_DIR = path.join(ROOT, "public/audio/sfx");
const BGM_DIR = path.join(ROOT, "public/audio/bgm");
fs.mkdirSync(SFX_DIR, { recursive: true });
fs.mkdirSync(BGM_DIR, { recursive: true });

const SR = 44100;
const TAU = Math.PI * 2;

// ---------- utilities ----------
let seed = 20251110;
const rnd = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const expInterp = (a, b, x) => a * Math.pow(b / a, clamp(x, 0, 1));

const makeBuf = (sec) => {
  const n = Math.ceil(sec * SR);
  return { L: new Float32Array(n), R: new Float32Array(n), n };
};

/** Add mono sample with constant-power pan (-1..1). */
const put = (buf, i, v, pan = 0) => {
  if (i < 0 || i >= buf.n) return;
  const a = (pan + 1) * 0.25 * Math.PI;
  buf.L[i] += v * Math.cos(a);
  buf.R[i] += v * Math.sin(a);
};

class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
  }
  set(type, freq, q = 0.707) {
    const w = (TAU * clamp(freq, 20, SR * 0.45)) / SR;
    const cos = Math.cos(w);
    const alpha = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    const a0 = 1 + alpha;
    if (type === "lp") {
      b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = (1 - cos) / 2;
    } else if (type === "hp") {
      b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2;
    } else {
      b0 = alpha; b1 = 0; b2 = -alpha; // band-pass (constant peak gain)
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = (-2 * cos) / a0; this.a2 = (1 - alpha) / a0;
    return this;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

const writeWav = (file, buf, peakDb = -1) => {
  let peak = 1e-9;
  for (let i = 0; i < buf.n; i++) peak = Math.max(peak, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  const gain = Math.pow(10, peakDb / 20) / peak;
  const data = Buffer.alloc(buf.n * 4);
  for (let i = 0; i < buf.n; i++) {
    // short fade at the very edges to avoid clicks
    const edge = Math.min(1, i / 64, (buf.n - 1 - i) / 64);
    data.writeInt16LE(Math.round(clamp(buf.L[i] * gain * edge, -1, 1) * 32767), i * 4);
    data.writeInt16LE(Math.round(clamp(buf.R[i] * gain * edge, -1, 1) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
};

// ---------- building blocks ----------
/** Oscillator with a frequency function f(t) → phase-accurate sweep. */
const osc = (buf, start, dur, freqFn, ampFn, { pan = 0, shape = "sine" } = {}) => {
  let ph = 0;
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * freqFn(t)) / SR;
    let v;
    if (shape === "sine") v = Math.sin(ph);
    else if (shape === "square") v = Math.sin(ph) >= 0 ? 0.6 : -0.6;
    else if (shape === "tri") v = (2 / Math.PI) * Math.asin(Math.sin(ph));
    else v = ((ph / TAU) % 1) * 2 - 1; // saw
    const p = typeof pan === "function" ? pan(t) : pan;
    put(buf, s0 + i, v * ampFn(t), p);
  }
};

/** Filtered noise with time-varying filter frequency. */
const noiseBurst = (buf, start, dur, ampFn, { type = "bp", freq = () => 1000, q = 1, pan = 0 } = {}) => {
  const f = new Biquad();
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (i % 16 === 0) f.set(type, freq(t), q);
    const p = typeof pan === "function" ? pan(t) : pan;
    put(buf, s0 + i, f.run(noise()) * ampFn(t), p);
  }
};

const dec = (tau) => (t) => Math.exp(-t / tau);
const attDec = (att, tau) => (t) => (t < att ? t / att : Math.exp(-(t - att) / tau));

// ---------- SFX ----------
const sfx = {};

sfx.whoosh = () => {
  const d = 0.6, b = makeBuf(d);
  noiseBurst(b, 0, d, (t) => Math.pow(Math.sin(Math.PI * Math.pow(t / d, 0.8)), 2), {
    freq: (t) => expInterp(350, 3200, t / d), q: 1.4, pan: (t) => -0.8 + 1.6 * (t / d),
  });
  return b;
};
sfx.whoosh_small = () => {
  const d = 0.32, b = makeBuf(d);
  noiseBurst(b, 0, d, (t) => Math.pow(Math.sin((Math.PI * t) / d), 2), {
    freq: (t) => expInterp(1200, 5200, t / d), q: 1.8, pan: (t) => -0.5 + (t / d),
  });
  return b;
};
sfx.whoosh_reverse = () => {
  const b = sfx.whoosh();
  b.L.reverse(); b.R.reverse();
  osc(b, 0, 0.6, (t) => expInterp(120, 900, t / 0.6), (t) => 0.12 * Math.pow(t / 0.6, 3));
  return b;
};
sfx.pop = () => {
  const b = makeBuf(0.15);
  osc(b, 0, 0.15, (t) => expInterp(1100, 260, t / 0.07), dec(0.03));
  noiseBurst(b, 0, 0.01, dec(0.002), { type: "hp", freq: () => 3000 });
  return b;
};
sfx.boing = () => {
  const d = 0.55, b = makeBuf(d);
  const f = (t) => 230 + 220 * (t / d) + 70 * Math.sin(TAU * 13 * t) * Math.exp(-4 * t);
  osc(b, 0, d, f, (t) => 0.8 * attDec(0.005, 0.16)(t));
  osc(b, 0, d, (t) => f(t) * 2.01, (t) => 0.25 * dec(0.08)(t));
  return b;
};
sfx.bonk = () => {
  const b = makeBuf(0.45);
  osc(b, 0, 0.45, (t) => expInterp(210, 80, t / 0.15), dec(0.09));
  osc(b, 0, 0.2, () => 880, (t) => 0.35 * dec(0.03)(t));
  osc(b, 0, 0.2, () => 1320, (t) => 0.15 * dec(0.02)(t));
  noiseBurst(b, 0, 0.05, (t) => 0.6 * dec(0.01)(t), { type: "lp", freq: () => 2500 });
  return b;
};
sfx.impact = () => {
  const b = makeBuf(1.1);
  osc(b, 0, 1.1, (t) => expInterp(95, 38, t / 0.5), (t) => Math.tanh(1.8 * dec(0.28)(t)));
  noiseBurst(b, 0, 0.5, (t) => 0.7 * dec(0.07)(t), { type: "lp", freq: (t) => expInterp(5000, 300, t / 0.4) });
  return b;
};
sfx.cinematic_hit = () => {
  const b = makeBuf(2.6);
  osc(b, 0, 2.6, (t) => expInterp(70, 32, t / 1.2), (t) => Math.tanh(2 * dec(0.6)(t)));
  noiseBurst(b, 0, 2.4, (t) => 0.5 * attDec(0.004, 0.5)(t), { type: "lp", freq: (t) => expInterp(6000, 200, t / 2) });
  for (const [f, p] of [[220, -0.4], [330, 0.4], [440, 0], [659, 0.2]]) osc(b, 0, 2.5, () => f, (t) => 0.07 * attDec(0.01, 0.8)(t), { pan: p, shape: "saw" });
  return b;
};
sfx.glitch = () => {
  const d = 0.4, b = makeBuf(d);
  let t = 0;
  while (t < d) {
    const seg = 0.015 + rnd() * 0.03;
    const kind = rnd();
    const pan = noise();
    if (kind < 0.45) osc(b, t, seg, () => 200 + rnd() * 1800, () => 0.45, { shape: "square", pan });
    else if (kind < 0.85) noiseBurst(b, t, seg, () => 0.8, { type: "bp", freq: () => 800 + rnd() * 5000, q: 3, pan });
    t += seg + (rnd() < 0.2 ? 0.02 : 0);
  }
  return b;
};
sfx.notification = () => {
  const b = makeBuf(0.8);
  for (const [st, f] of [[0, 1046.5], [0.1, 1568]]) {
    osc(b, st, 0.7, () => f, (t) => 0.6 * attDec(0.004, 0.22)(t));
    osc(b, st, 0.7, () => f * 2.76, (t) => 0.12 * dec(0.06)(t));
  }
  return b;
};
sfx.click = () => {
  const b = makeBuf(0.06);
  noiseBurst(b, 0, 0.006, () => 0.8, { type: "hp", freq: () => 2500 });
  osc(b, 0, 0.05, () => 2400, dec(0.006));
  return b;
};
const keystroke = (b, at, amp = 1, pan = 0) => {
  noiseBurst(b, at, 0.03, (t) => amp * dec(0.006)(t), { type: "bp", freq: () => 2500 + rnd() * 1500, q: 1.2, pan });
  osc(b, at, 0.04, () => 180 + rnd() * 60, (t) => 0.5 * amp * dec(0.01)(t), { pan });
};
sfx.typing = () => {
  const d = 1.6, b = makeBuf(d);
  let t = 0.01;
  while (t < d - 0.05) {
    keystroke(b, t, 0.6 + rnd() * 0.4, noise() * 0.3);
    t += 0.055 + rnd() * 0.09;
  }
  return b;
};
sfx.ticking = () => {
  const d = 3.2, b = makeBuf(d);
  for (let i = 0; i * 0.32 < d - 0.1; i++) {
    const f = i % 2 ? 2100 : 3000;
    osc(b, i * 0.32, 0.06, () => f, (t) => 0.5 * dec(0.008)(t), { pan: i % 2 ? 0.3 : -0.3 });
    noiseBurst(b, i * 0.32, 0.03, (t) => 0.4 * dec(0.004)(t), { type: "hp", freq: () => 4000 });
    osc(b, i * 0.32, 0.1, () => 420, (t) => 0.15 * dec(0.02)(t));
  }
  return b;
};
sfx.paper = () => {
  const d = 0.7, b = makeBuf(d);
  noiseBurst(b, 0, d, (t) => Math.sin((Math.PI * t) / d) * (0.4 + 0.6 * Math.abs(Math.sin(TAU * 17 * t + 3 * Math.sin(TAU * 5 * t)))), {
    type: "hp", freq: () => 1800, pan: (t) => 0.5 - t,
  });
  return b;
};
sfx.retro_beep = () => {
  const b = makeBuf(1.0);
  const notes = [880, 1320, 660, 990, 1760];
  notes.forEach((f, i) => osc(b, i * 0.16, 0.09, () => f, (t) => (t < 0.08 ? 0.5 : 0), { shape: "square", pan: (i % 2 ? 0.3 : -0.3) }));
  return b;
};
sfx.data = () => {
  const d = 1.6, b = makeBuf(d);
  for (let t = 0; t < d - 0.03; t += 0.028) {
    osc(b, t, 0.022, () => 700 + rnd() * 2600, (x) => 0.25 * (1 - x / 0.022), { shape: "square", pan: noise() * 0.6 });
  }
  return b;
};
sfx.machine_hum = () => {
  const d = 3.5, b = makeBuf(d);
  const env = (t) => Math.min(1, t / 0.4, (d - t) / 0.6);
  for (const [f, a] of [[60, 0.5], [120, 0.3], [180, 0.15], [240, 0.08]]) osc(b, 0, d, () => f, (t) => a * env(t) * (0.85 + 0.15 * Math.sin(TAU * 2 * t)));
  noiseBurst(b, 0, d, (t) => 0.25 * env(t), { type: "lp", freq: () => 500 });
  for (let i = 0; i < 9; i++) noiseBurst(b, 0.2 + rnd() * (d - 0.6), 0.02, (t) => 0.5 * dec(0.004)(t), { type: "hp", freq: () => 3000, pan: noise() });
  return b;
};
sfx.loading = () => {
  const d = 3.0, b = makeBuf(d);
  const env = (t) => Math.min(1, t / 0.5, (d - t) / 0.4);
  noiseBurst(b, 0, d, (t) => 0.6 * env(t) * (0.7 + 0.3 * Math.sin(TAU * 7 * t)), { type: "bp", freq: (t) => 350 + 250 * (t / d), q: 2 });
  osc(b, 0, d, (t) => 290 + 40 * (t / d), (t) => 0.12 * env(t), { shape: "tri" });
  return b;
};
sfx.puff = () => {
  const b = makeBuf(0.6);
  noiseBurst(b, 0, 0.6, attDec(0.02, 0.12), { type: "lp", freq: (t) => expInterp(2500, 300, t / 0.5) });
  return b;
};
sfx.rimshot = () => {
  const b = makeBuf(1.4);
  const tom = (at, f) => {
    osc(b, at, 0.3, (t) => expInterp(f * 1.4, f, t / 0.05), (t) => 0.8 * dec(0.08)(t));
    noiseBurst(b, at, 0.12, (t) => 0.4 * dec(0.03)(t), { type: "bp", freq: () => 1800 });
  };
  tom(0, 180); tom(0.17, 130);
  noiseBurst(b, 0.36, 1.0, (t) => 0.9 * dec(0.06)(t), { type: "bp", freq: () => 2200, q: 0.8 });
  noiseBurst(b, 0.36, 1.0, (t) => 0.6 * dec(0.35)(t), { type: "hp", freq: () => 7000, pan: 0.3 });
  return b;
};
sfx.record_scratch = () => {
  const d = 0.55, b = makeBuf(d);
  const fm = (t) => 900 + 800 * Math.sin(TAU * 7 * t + Math.PI);
  noiseBurst(b, 0, d, (t) => (Math.sin(TAU * 7 * t) > -0.6 ? 0.9 : 0.15) * (1 - t / d), { type: "bp", freq: fm, q: 4 });
  osc(b, 0, d, (t) => fm(t) * 0.3, (t) => 0.25 * (1 - t / d), { shape: "saw" });
  return b;
};
sfx.stamp = () => {
  const b = makeBuf(0.5);
  osc(b, 0, 0.5, (t) => expInterp(140, 55, t / 0.2), (t) => Math.tanh(2 * dec(0.1)(t)));
  noiseBurst(b, 0, 0.12, (t) => 0.9 * dec(0.025)(t), { type: "lp", freq: () => 3500 });
  return b;
};
sfx.digital_sweep = () => {
  const d = 0.65, b = makeBuf(d);
  const f = (t) => expInterp(300, 2600, t / d);
  osc(b, 0, d, f, (t) => 0.5 * Math.sin((Math.PI * t) / d) * (0.6 + 0.4 * Math.sin(TAU * 32 * t)), { pan: (t) => -0.6 + 1.2 * (t / d) });
  osc(b, 0, d, (t) => f(t) / 2, (t) => 0.15 * Math.sin((Math.PI * t) / d), { shape: "square" });
  return b;
};
sfx.ai_chime = () => {
  const b = makeBuf(1.8);
  [1046.5, 1318.5, 1568, 1975.5, 2637].forEach((f, i) => {
    osc(b, i * 0.07, 1.6, () => f, (t) => 0.4 * attDec(0.005, 0.45)(t), { pan: -0.4 });
    osc(b, i * 0.07, 1.6, () => f * 1.004, (t) => 0.4 * attDec(0.005, 0.45)(t), { pan: 0.4 });
  });
  return b;
};
sfx.activation = () => {
  const b = makeBuf(1.3);
  osc(b, 0, 0.8, (t) => expInterp(180, 1400, t / 0.8), (t) => 0.4 * Math.pow(t / 0.8, 1.5));
  noiseBurst(b, 0, 0.8, (t) => 0.3 * Math.pow(t / 0.8, 2), { type: "bp", freq: (t) => expInterp(500, 6000, t / 0.8), q: 1.5 });
  for (const f of [523.25, 659.25, 783.99, 1046.5]) osc(b, 0.8, 0.5, () => f, (t) => 0.25 * dec(0.18)(t), { shape: "tri" });
  return b;
};
sfx.confirm = () => {
  const b = makeBuf(0.45);
  osc(b, 0, 0.12, () => 880, (t) => 0.5 * dec(0.06)(t), { shape: "tri" });
  osc(b, 0.1, 0.35, () => 1318.5, (t) => 0.5 * dec(0.12)(t), { shape: "tri" });
  return b;
};
sfx.running = () => {
  const d = 1.8, b = makeBuf(d);
  for (let i = 0; i * 0.085 < d - 0.05; i++) {
    const at = i * 0.085, p = i % 2 ? 0.35 : -0.35;
    osc(b, at, 0.07, (t) => expInterp(160, 70, t / 0.05), (t) => 0.7 * dec(0.018)(t), { pan: p });
    noiseBurst(b, at, 0.03, (t) => 0.25 * dec(0.008)(t), { type: "bp", freq: () => 1200, pan: p });
  }
  return b;
};
sfx.shimmer = () => {
  const d = 1.8, b = makeBuf(d);
  for (let i = 0; i < 46; i++) {
    const at = rnd() * (d - 0.4), f = 2000 + rnd() * 4500;
    osc(b, at, 0.4, () => f, (t) => 0.15 * attDec(0.002, 0.08)(t), { pan: noise() });
  }
  osc(b, 0, d, (t) => expInterp(400, 1600, t / d), (t) => 0.06 * Math.sin((Math.PI * t) / d));
  return b;
};
sfx.tape_rewind = () => {
  const d = 1.3, b = makeBuf(d);
  osc(b, 0, d, (t) => expInterp(500, 2600, t / d) * (1 + 0.08 * Math.sin(TAU * 18 * t)), (t) => 0.25 * Math.min(1, t / 0.1, (d - t) / 0.1), { shape: "saw" });
  noiseBurst(b, 0, d, (t) => 0.3 * Math.min(1, t / 0.1, (d - t) / 0.1), { type: "bp", freq: (t) => expInterp(1500, 6000, t / d), q: 2 });
  return b;
};
sfx.tape_stop = () => {
  const d = 0.9, b = makeBuf(d);
  for (const f of [220, 277.2, 329.6, 110]) osc(b, 0, d, (t) => Math.max(5, f * Math.pow(1 - t / d, 2)), (t) => 0.25 * (1 - t / d), { shape: "saw" });
  return b;
};
sfx.squeak = () => {
  const b = makeBuf(0.3);
  osc(b, 0, 0.3, (t) => expInterp(900, 2300, t / 0.25) * (1 + 0.03 * Math.sin(TAU * 40 * t)), (t) => 0.5 * Math.sin((Math.PI * t) / 0.3));
  return b;
};
sfx.confetti = () => {
  const b = makeBuf(1.0);
  for (let i = 0; i < 10; i++) {
    const at = rnd() * 0.5, f0 = 800 + rnd() * 900;
    osc(b, at, 0.1, (t) => expInterp(f0, f0 / 3, t / 0.06), (t) => 0.4 * dec(0.025)(t), { pan: noise() });
  }
  noiseBurst(b, 0, 0.9, (t) => 0.15 * dec(0.25)(t), { type: "hp", freq: () => 6000 });
  return b;
};
sfx.ai_ambience = () => {
  const d = 5.5, b = makeBuf(d);
  const env = (t) => Math.min(1, t / 1, (d - t) / 1.2);
  for (const [f, p] of [[110, -0.3], [164.8, 0.3], [220.5, -0.1], [329.3, 0.2]]) osc(b, 0, d, (t) => f * (1 + 0.003 * Math.sin(TAU * 0.3 * t)), (t) => 0.2 * env(t) * (0.7 + 0.3 * Math.sin(TAU * 0.5 * t + f)), { pan: p });
  return b;
};
sfx.cartoon_laugh_pops = () => {
  // bouncy "ha-ha-ha" made of pitched hiccups (non-vocal, cartoony)
  const b = makeBuf(1.1);
  for (let i = 0; i < 6; i++) {
    const f0 = 520 - i * 25;
    osc(b, i * 0.15, 0.12, (t) => f0 * (1 + 0.25 * Math.sin((Math.PI * t) / 0.12)), (t) => 0.5 * Math.sin((Math.PI * t) / 0.12), { shape: "tri", pan: i % 2 ? 0.2 : -0.2 });
  }
  return b;
};

for (const [name, fn] of Object.entries(sfx)) {
  writeWav(path.join(SFX_DIR, `${name}.wav`), fn(), name === "ai_ambience" ? -6 : -1);
}
console.log(`SFX: ${Object.keys(sfx).length} files → ${path.relative(ROOT, SFX_DIR)}`);

// ---------- BACKGROUND MUSIC (scored to the scene timeline) ----------
const timeline = JSON.parse(fs.readFileSync(path.join(ROOT, "src/timeline-data.json"), "utf8"));
const starts = {};
{
  let acc = 0;
  for (const s of timeline.scenes) {
    starts[s.id] = acc / timeline.fps;
    acc += s.duration;
  }
  starts.end = acc / timeline.fps;
}

const BPM = 120;
const STEP = 60 / BPM / 4; // 16th note
const total = starts.end + 0.5;
const music = makeBuf(total);

// section map (seconds) — each scene gets its own flavour
const sectionAt = (t) => {
  if (t < starts.plotTwist) return t < 2 ? "intro" : "main";
  if (t < starts.plotTwist + 1.5) return "silence"; // dramatic pause before "Plot twist"
  if (t < starts.skillIssue) return "history";
  if (t < starts.machine) return "main";
  if (t >= starts.otp && t < starts.otp + 0.75) return "silence"; // record scratch freeze
  if (t < starts.evolution) return "chip";
  if (t < starts.ai) return "main";
  if (t < starts.closing) return "future";
  if (t < starts.end - 1.5) return "main";
  if (t < starts.end - 1.0) return "outro-hit";
  return "silence";
};

// A minor: Am – F – C – G (one chord per bar)
const CHORDS = [
  { root: 110.0, tones: [220.0, 261.63, 329.63] },
  { root: 87.31, tones: [174.61, 220.0, 261.63] },
  { root: 130.81, tones: [261.63, 329.63, 392.0] },
  { root: 98.0, tones: [196.0, 246.94, 293.66] },
];

const kick = (at) => {
  osc(music, at, 0.35, (t) => expInterp(150, 45, t / 0.08), (t) => 0.9 * dec(0.12)(t));
  noiseBurst(music, at, 0.01, () => 0.3, { type: "hp", freq: () => 3000 });
};
const clap = (at) => {
  for (const off of [0, 0.01, 0.022]) noiseBurst(music, at + off, 0.15, (t) => 0.35 * dec(0.03)(t), { type: "bp", freq: () => 1500, q: 1 });
  noiseBurst(music, at + 0.03, 0.25, (t) => 0.2 * dec(0.08)(t), { type: "bp", freq: () => 1200, q: 0.8 });
};
const hat = (at, amp = 0.18, open = false) => noiseBurst(music, at, open ? 0.25 : 0.06, (t) => amp * dec(open ? 0.08 : 0.015)(t), { type: "hp", freq: () => 8000, pan: 0.25 });
const bassNote = (at, f, dur = STEP * 2) => {
  const lp = new Biquad().set("lp", 600, 1.2);
  const s0 = Math.floor(at * SR), n = Math.floor(dur * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (TAU * f) / SR;
    const saw = ((ph / TAU) % 1) * 2 - 1;
    const v = lp.run(saw + 0.6 * Math.sin(ph)) * 0.45 * attDec(0.004, 0.14)(t) * Math.min(1, (dur - t) / 0.01);
    put(music, s0 + i, v, 0);
  }
};
const pluck = (at, f, amp = 0.16, pan = 0, tau = 0.09, shape = "tri") => osc(music, at, tau * 5, () => f, (t) => amp * attDec(0.002, tau)(t), { pan, shape });
const harpsi = (at, f, amp = 0.14, pan = 0) => {
  osc(music, at, 0.6, () => f, (t) => amp * attDec(0.001, 0.18)(t), { pan, shape: "saw" });
  osc(music, at, 0.6, () => f * 2, (t) => amp * 0.4 * dec(0.08)(t), { pan: -pan });
};
const padChord = (at, tones, dur, amp = 0.05, bright = 1) => {
  for (const f of tones) {
    for (const det of [0.997, 1.003]) {
      const lp = new Biquad().set("lp", 900 * bright, 0.7);
      const s0 = Math.floor(at * SR), n = Math.floor(dur * SR);
      let ph = rnd() * TAU;
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        ph += (TAU * f * det) / SR;
        const saw = ((ph / TAU) % 1) * 2 - 1;
        const env = Math.min(1, t / 0.15, (dur - t) / 0.2);
        put(music, s0 + i, lp.run(saw) * amp * env, det < 1 ? -0.5 : 0.5);
      }
    }
  }
};

const stepsTotal = Math.floor(total / STEP);
const CHIP_MELODY = [0, 2, 1, 2, 0, 1, 2, 1]; // indices into chord tones per 8th
for (let s = 0; s < stepsTotal; s++) {
  const t = s * STEP;
  const sec = sectionAt(t);
  if (sec === "silence") continue;
  const bar = Math.floor(s / 16), inBar = s % 16;
  const ch = CHORDS[bar % 4];
  const beat = inBar % 4 === 0;

  if (sec === "outro-hit") {
    if (sectionAt(t - STEP) !== "outro-hit") {
      kick(t);
      clap(t);
      padChord(t, [220, 261.63, 329.63, 440], 1.2, 0.08, 2);
      bassNote(t, 110, 1.0);
    }
    continue;
  }

  if (sec === "intro") {
    if (inBar % 2 === 0) pluck(t, ch.tones[(inBar / 2) % 3] * 2, 0.14, inBar % 4 ? 0.4 : -0.4);
    if (inBar % 4 === 2) hat(t, 0.12);
    continue;
  }

  if (sec === "history") {
    // playful baroque-ish harpsichord + clock-like woodblocks, no kick
    if (inBar % 2 === 0) harpsi(t, ch.tones[[0, 1, 2, 1][(inBar / 2) % 4]] * 2, 0.12, inBar % 4 ? 0.3 : -0.3);
    if (beat) harpsi(t, ch.root * 2, 0.1, 0);
    if (inBar % 4 === 2) osc(music, t, 0.06, () => 1800, (x) => 0.08 * dec(0.01)(x), { pan: 0.5 });
    if (inBar === 0) padChord(t, ch.tones, 2, 0.025, 0.8);
    continue;
  }

  if (sec === "chip") {
    if (beat) kick(t);
    if (inBar % 4 === 2) hat(t, 0.15);
    if (inBar % 2 === 0) osc(music, t, STEP * 1.6, () => ch.root * 2, (x) => (x < STEP * 1.5 ? 0.12 : 0), { shape: "square" });
    // fast chiptune arpeggio
    osc(music, t, STEP * 0.9, () => ch.tones[s % 3] * 4, (x) => (x < STEP * 0.8 ? 0.05 : 0), { shape: "square", pan: 0.3 });
    if (inBar % 2 === 0) {
      const f = ch.tones[CHIP_MELODY[(inBar / 2) % 8]] * 2;
      osc(music, t, STEP * 1.8, () => f * (1 + 0.004 * Math.sin(TAU * 6 * t)), (x) => (x < STEP * 1.7 ? 0.07 : 0), { shape: "square", pan: -0.3 });
    }
    continue;
  }

  // main / future
  if (beat) kick(t);
  if (inBar === 4 || inBar === 12) clap(t);
  if (inBar % 4 === 2) hat(t, 0.16, inBar === 14);
  else if (inBar % 2 === 1) hat(t, 0.06);
  if (inBar % 2 === 0) bassNote(t, inBar % 8 === 6 ? ch.root * 2 : ch.root);
  const arpTones = [...ch.tones, ch.tones[0] * 2];
  pluck(t, arpTones[[0, 1, 2, 3, 2, 1][s % 6]] * 2, sec === "future" ? 0.1 : 0.08, s % 2 ? 0.45 : -0.45, 0.07, sec === "future" ? "sine" : "tri");
  if (inBar === 0) padChord(t, ch.tones, 2, sec === "future" ? 0.05 : 0.03, sec === "future" ? 2.2 : 1);
}

writeWav(path.join(BGM_DIR, "bgm.wav"), music, -3);
console.log(`BGM: ${total.toFixed(1)}s → ${path.relative(ROOT, BGM_DIR)}/bgm.wav`);

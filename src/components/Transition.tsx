import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";
import { Sfx } from "./SoundEffect";
import { easeIn, easeOut, keys, lerp, rand } from "../lib/anim";

export const BLINK_DURATION = 16;

/**
 * Devtrine signature transition — the logo "blinks":
 * two cyan eyelids close over the frame, the pupil flashes, then they open on the next scene.
 */
export const BlinkWipe: React.FC<{ sfx?: boolean }> = ({ sfx = true }) => {
  const frame = useCurrentFrame();
  const half = BLINK_DURATION / 2;
  const p = frame < half ? lerp(frame, [0, half], [0, 1], easeIn) : lerp(frame, [half, BLINK_DURATION], [1, 0], easeOut);
  const lid = p * (H / 2 + 140);
  const curve = 160 * (1 - p * 0.6);
  const pupil = keys(frame, [half - 2, half, half + 3], [0, 1, 0]);
  const pupilScale = frame < half ? lerp(frame, [half - 2, half], [0.3, 1]) : lerp(frame, [half, half + 3], [1, 0.2]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <path d={`M0,0 H${W} V${lid - curve} Q${W / 2},${lid + curve} 0,${lid - curve} Z`} fill={C.cyan} />
        <path d={`M0,${lid - curve} Q${W / 2},${lid + curve} ${W},${lid - curve}`} stroke={C.cyanLight} strokeWidth={28} fill="none" opacity={p > 0.02 ? 1 : 0} />
        <path d={`M0,${H} H${W} V${H - lid + curve} Q${W / 2},${H - lid - curve} 0,${H - lid + curve} Z`} fill={C.cyan} />
        <path d={`M0,${H - lid + curve} Q${W / 2},${H - lid - curve} ${W},${H - lid + curve}`} stroke={C.cyanLight} strokeWidth={28} fill="none" opacity={p > 0.02 ? 1 : 0} />
        <circle cx={W / 2} cy={H / 2} r={150 * pupilScale} fill={C.charcoal} opacity={pupil} />
      </svg>
      {sfx && <Sfx name="whoosh_small" at={0} volume={0.45} />}
    </AbsoluteFill>
  );
};

/** RGB-split + slice displacement glitch overlay applied to children. */
export const Glitch: React.FC<{ start: number; duration?: number; children: React.ReactNode }> = ({ start, duration = 10, children }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const active = t >= 0 && t < duration;
  if (!active) return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = 1 - t / duration;
  const off = (rand(frame * 1.3) * 2 - 1) * 40 * k;
  const slices = 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-off}px)`, opacity: 0.7, filter: "hue-rotate(160deg) saturate(3)", mixBlendMode: "multiply" }}>
        {children}
      </AbsoluteFill>
      {Array.from({ length: slices }, (_, i) => {
        const y0 = (i / slices) * 100;
        const dx = (rand(frame * 7 + i) * 2 - 1) * 70 * k;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${y0}% 0 ${100 - y0 - 100 / slices}% 0)`, transform: `translateX(${dx}px)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** Quick white flash (used on impacts). */
export const Flash: React.FC<{ at: number; color?: string; duration?: number; max?: number }> = ({ at, color = C.white, duration = 8, max = 0.85 }) => {
  const frame = useCurrentFrame();
  const o = keys(frame, [at, at + 1, at + duration], [0, max, 0]);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

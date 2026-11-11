import React, { useId } from "react";
import { C } from "../theme";

/**
 * Devtrine — the studio mascot, built 1:1 from the Devtrine Studio logo geometry.
 * Units: ring outer radius = 100 (logo measured at 2000px: ring r=312, pupil r=158).
 *
 *   wings  = the two upper corners of the logo triangle (triangular hands that gesture / flap)
 *   ring   = the eye (cyan light), inner white = eyeball, charcoal disc = pupil
 *   notch  = negative space cutout at bottom tip of logo (no mouth, expressions purely via eyes, wings, and brow)
 */

export type Expression =
  | "neutral"
  | "happy"
  | "curious"
  | "shocked"
  | "confused"
  | "laughing"
  | "amazed"
  | "panic"
  | "annoyed"
  | "dizzy";

type Brow = { l: number; r: number; arch: number; y?: number } | null;
type Preset = {
  top: number;
  bottom: number;
  pupil: number;
  brow: Brow;
  wingL: number;
  wingR: number;
  pupilType?: PupilType;
};
type PupilType = "normal" | "spiral" | "star";

const PRESETS: Record<Expression, Preset> = {
  neutral: { top: 0, bottom: 0, pupil: 1, brow: null, wingL: 0, wingR: 0 },
  happy: { top: 0, bottom: 0.32, pupil: 1, brow: { l: 4, r: 4, arch: 14 }, wingL: -18, wingR: 18 },
  curious: { top: 0.12, bottom: 0.04, pupil: 0.9, brow: { l: -14, r: 8, arch: 8 }, wingL: 16, wingR: -10 },
  shocked: { top: 0, bottom: 0, pupil: 0.48, brow: { l: -4, r: -4, arch: 24, y: -14 }, wingL: -28, wingR: 28 },
  confused: { top: 0.22, bottom: 0.08, pupil: 0.85, brow: { l: 14, r: -14, arch: -2 }, wingL: -12, wingR: 20 },
  laughing: { top: 0.48, bottom: 0.45, pupil: 1, brow: { l: 2, r: 2, arch: 18 }, wingL: -22, wingR: 22 },
  amazed: { top: 0, bottom: 0.08, pupil: 1.15, brow: { l: -4, r: -4, arch: 22, y: -10 }, wingL: -20, wingR: 20, pupilType: "star" },
  panic: { top: 0, bottom: 0, pupil: 0.42, brow: { l: 14, r: 14, arch: 20, y: -6 }, wingL: -36, wingR: 36 },
  annoyed: { top: 0.46, bottom: 0.1, pupil: 0.9, brow: { l: 6, r: 6, arch: -6 }, wingL: 12, wingR: 12 },
  dizzy: { top: 0.05, bottom: 0.05, pupil: 1, brow: { l: 10, r: -6, arch: 4 }, wingL: 18, wingR: -18, pupilType: "spiral" },
};

export type MascotProps = {
  x: number;
  y: number;
  /** ring diameter in px */
  size?: number;
  expression?: Expression;
  lookX?: number;
  lookY?: number;
  blink?: number;
  rotate?: number;
  sx?: number;
  sy?: number;
  wingL?: number;
  wingR?: number;
  mouth?: number; // Kept for backwards compatibility, mouth rendering removed
  pupilScale?: number;
  pupil?: PupilType;
  legs?: boolean; // Kept for backwards compatibility, legs rendering removed
  legPhase?: number; // Kept for backwards compatibility
  hat?: boolean;
  mustache?: boolean;
  sweat?: number;
  tears?: number;
  frame?: number;
  opacity?: number;
  hideBrow?: boolean;
  shadow?: boolean;
};

const rot = (p: [number, number], deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
};
const pts = (arr: [number, number][]) => arr.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");

// Logo geometry (units)
const LEFT_WING: [number, number][] = [[-129.2, -67.6], [0, -64.2], [0, 10], [-94.5, -32.9]];
const RIGHT_WING: [number, number][] = [[134.3, -60.6], [0, -64.2], [0, 10], [97.2, -23.5]];
// Clean chin path with natural logo notch cutout (no separate mouth)
const CHIN_PATH = "M -70.5,70 L 66.1,70 L 10.9,123.4 L 9.3,110 Q 9.3,106 5.3,106 L -12.4,106 Q -16.4,106 -16.6,110 L -18,123.4 Z";

const RING_R = 87.2;
const RING_W = 25.6;
const EYE_R = 74.4;
const PUPIL_R = 50.6;

const starPath = (outer: number, inner: number) => {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    p.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${p.join(" L")} Z`;
};

const spiralPath = () => {
  let d = "M0,0";
  for (let i = 1; i <= 80; i++) {
    const a = i * 0.32;
    const r = i * 0.68;
    d += ` L${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }
  return d;
};
const SPIRAL = spiralPath();
const STAR = starPath(60, 26);

export const DevtrineMascot: React.FC<MascotProps> = ({
  x,
  y,
  size = 300,
  expression = "neutral",
  lookX = 0,
  lookY = 0,
  blink = 0,
  rotate = 0,
  sx = 1,
  sy = 1,
  wingL,
  wingR,
  pupilScale,
  pupil,
  hat = false,
  mustache = false,
  sweat = 0,
  tears = 0,
  frame = 0,
  opacity = 1,
  hideBrow = false,
  shadow = false,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = PRESETS[expression];
  const top = Math.min(1, p.top + blink * (1 - p.top));
  const bottom = p.bottom;
  const closed = top + bottom >= 0.95;
  const pScale = pupilScale ?? p.pupil;
  const pType = pupil ?? p.pupilType ?? "normal";
  const brow = hideBrow ? null : p.brow;

  const yT = -EYE_R + top * EYE_R * 2;
  const yB = EYE_R - bottom * EYE_R * 2;

  // Triangular hands (wings): use explicit prop if provided, else expressive preset
  const actualWingL = wingL !== undefined ? wingL : p.wingL;
  const actualWingR = wingR !== undefined ? wingR : p.wingR;
  const lw = LEFT_WING.map((q) => rot(q, actualWingL));
  const rw = RIGHT_WING.map((q) => rot(q, -actualWingR));

  const w = size * 2;
  const h = size * 2.2;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size,
        top: y - size * 1.1,
        width: w,
        height: h,
        transform: `rotate(${rotate}deg) scale(${sx}, ${sy})`,
        transformOrigin: "50% 78%",
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="-200 -220 400 440" width={w} height={h} style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={`eye${uid}`}>
            <circle r={EYE_R + 0.5} />
          </clipPath>
        </defs>

        {/* Gentle floating drop shadow (no legs) */}
        {shadow && <ellipse cx={0} cy={142} rx={60} ry={8} fill={C.charcoal} opacity={0.12} />}

        {/* Body: Logo triangular hands & chin geometry */}
        <polygon points={pts(lw)} fill={C.cyan} />
        <polygon points={pts(rw)} fill={C.cyan} />
        <path d={CHIN_PATH} fill={C.cyan} />

        {/* Eye: Cyan ring & white eyeball */}
        <circle r={RING_R} fill={C.white} stroke={C.cyanLight} strokeWidth={RING_W} />
        <g clipPath={`url(#eye${uid})`}>
          <g transform={`translate(${lookX * 18}, ${lookY * 16}) scale(${pScale})`}>
            {pType === "normal" && (
              <>
                <circle r={PUPIL_R} fill={C.charcoal} />
                <circle cx={-17} cy={-19} r={9} fill={C.white} opacity={0.9} />
                <circle cx={14} cy={15} r={4} fill={C.white} opacity={0.6} />
              </>
            )}
            {pType === "spiral" && (
              <path d={SPIRAL} transform={`rotate(${frame * 14})`} fill="none" stroke={C.charcoal} strokeWidth={7} strokeLinecap="round" />
            )}
            {pType === "star" && (
              <g transform={`rotate(${Math.sin(frame / 6) * 8}) scale(${1 + Math.sin(frame / 3) * 0.06})`}>
                <path d={STAR} fill={C.charcoal} strokeLinejoin="round" stroke={C.charcoal} strokeWidth={6} />
                <circle cx={-10} cy={-12} r={6} fill={C.white} opacity={0.9} />
              </g>
            )}
          </g>
          {top > 0.001 && <path d={`M-90,-90 L90,-90 L90,${yT} Q0,${yT + 16 * (1 - top)} -90,${yT} Z`} fill={C.cyanLight} />}
          {bottom > 0.001 && <path d={`M-90,90 L90,90 L90,${yB} Q0,${yB - 34} -90,${yB} Z`} fill={C.cyanLight} />}
        </g>
        {closed && <path d="M-44,12 Q0,-34 44,12" fill="none" stroke={C.charcoal} strokeWidth={11} strokeLinecap="round" />}

        {/* Eyebrow: primary emotional indicator */}
        {brow && (
          <path
            d={`M-44,${-126 + (brow.y ?? 0) + brow.l} Q0,${-126 + (brow.y ?? 0) - brow.arch} 44,${-126 + (brow.y ?? 0) + brow.r}`}
            fill="none"
            stroke={C.charcoal}
            strokeWidth={11}
            strokeLinecap="round"
          />
        )}

        {mustache && (
          <path
            d="M-4,98 C-14,90 -30,92 -40,102 C-46,108 -56,106 -58,98 C-54,112 -36,116 -22,108 C-14,104 -8,104 -4,106 C0,104 6,104 14,108 C28,116 46,112 50,98 C48,106 38,108 32,102 C22,92 6,90 -4,98 Z"
            fill={C.charcoal}
          />
        )}

        {hat && (
          <g transform="translate(6,-92) rotate(-9)">
            <ellipse cx={0} cy={0} rx={68} ry={11} fill={C.charcoal} />
            <rect x={-42} y={-86} width={84} height={86} rx={6} fill={C.charcoal} />
            <rect x={-42} y={-22} width={84} height={13} fill={C.cyan} />
          </g>
        )}

        {sweat > 0 &&
          [0, 1].map((i) => {
            const t = ((frame * 0.06 + i * 0.5) % 1) * sweat;
            return (
              <path
                key={i}
                d="M0,-14 C6,-4 10,2 10,8 A10,10 0 0 1 -10,8 C-10,2 -6,-4 0,-14 Z"
                transform={`translate(${i ? -112 : 108}, ${-84 + t * 70}) scale(${1.2 - t * 0.4})`}
                fill="#7FD8F0"
                stroke={C.charcoal}
                strokeWidth={3}
                opacity={sweat * (1 - t)}
              />
            );
          })}

        {tears > 0 &&
          [-1, 1].map((side) =>
            [0, 1, 2].map((k) => {
              const t = (frame * 0.08 + k / 3) % 1;
              return (
                <circle
                  key={`${side}${k}`}
                  cx={side * (78 + t * 70)}
                  cy={-10 - Math.sin(t * Math.PI) * 40 + t * 30}
                  r={9 * (1 - t * 0.5)}
                  fill="#7FD8F0"
                  opacity={tears * (1 - t)}
                />
              );
            }),
          )}
      </svg>
    </div>
  );
};

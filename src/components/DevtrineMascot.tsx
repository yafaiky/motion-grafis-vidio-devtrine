import React, { useId } from "react";
import { C } from "../theme";

/**
 * Devtrine — the studio mascot, built 1:1 from the Devtrine Studio logo geometry.
 * Units: ring outer radius = 100 (logo measured at 2000px: ring r=312, pupil r=158).
 *
 *   wings  = the two upper corners of the logo triangle (they flap / point)
 *   ring   = the eye (cyan light), inner white = eyeball, charcoal disc = pupil
 *   notch  = the white slot at the bottom tip → mouth
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
type Preset = { top: number; bottom: number; pupil: number; brow: Brow; mouth: number; pupilType?: PupilType };
type PupilType = "normal" | "spiral" | "star";

const PRESETS: Record<Expression, Preset> = {
  neutral: { top: 0, bottom: 0, pupil: 1, brow: null, mouth: 0 },
  happy: { top: 0, bottom: 0.32, pupil: 1, brow: { l: 4, r: 4, arch: 10 }, mouth: 0.35 },
  curious: { top: 0.12, bottom: 0.04, pupil: 0.9, brow: { l: -12, r: 8, arch: 6 }, mouth: 0 },
  shocked: { top: 0, bottom: 0, pupil: 0.55, brow: { l: -4, r: -4, arch: 22, y: -12 }, mouth: 0.85 },
  confused: { top: 0.22, bottom: 0.08, pupil: 0.85, brow: { l: 12, r: -14, arch: -2 }, mouth: 0.12 },
  laughing: { top: 0.52, bottom: 0.5, pupil: 1, brow: { l: 2, r: 2, arch: 16 }, mouth: 1 },
  amazed: { top: 0, bottom: 0.08, pupil: 1.12, brow: { l: -4, r: -4, arch: 20, y: -8 }, mouth: 0.7, pupilType: "star" },
  panic: { top: 0, bottom: 0, pupil: 0.45, brow: { l: 12, r: 12, arch: 18 }, mouth: 0.8 },
  annoyed: { top: 0.46, bottom: 0.1, pupil: 0.9, brow: { l: 4, r: 4, arch: -4 }, mouth: 0 },
  dizzy: { top: 0.05, bottom: 0.05, pupil: 1, brow: { l: 10, r: -6, arch: 4 }, mouth: 0.4, pupilType: "spiral" },
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
  mouth?: number;
  pupilScale?: number;
  pupil?: PupilType;
  legs?: boolean;
  legPhase?: number;
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
const CHIN: [number, number][] = [[-70.5, 70], [66.1, 70], [10.9, 123.4], [-18, 123.4]];
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
  wingL = 0,
  wingR = 0,
  mouth,
  pupilScale,
  pupil,
  legs = false,
  legPhase = 0,
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
  const m = mouth ?? p.mouth;
  const brow = hideBrow ? null : p.brow;

  const yT = -EYE_R + top * EYE_R * 2;
  const yB = EYE_R - bottom * EYE_R * 2;
  const lw = LEFT_WING.map((q) => rot(q, wingL));
  const rw = RIGHT_WING.map((q) => rot(q, -wingR));

  const w = size * 2;
  const h = size * 2.2;
  const legSwing = Math.sin(legPhase) * 32;

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

        {shadow && <ellipse cx={0} cy={legs ? 172 : 158} rx={70} ry={10} fill={C.charcoal} opacity={0.12} />}

        {/* legs (only when running / standing) */}
        {legs && (
          <g stroke={C.charcoal} strokeWidth={8} strokeLinecap="round" fill={C.charcoal}>
            {[-1, 1].map((side) => {
              const sw = side * legSwing;
              const hx = side < 0 ? -11 : 4;
              const [fx, fy] = rot([0, 46], sw);
              return (
                <g key={side}>
                  <line x1={hx} y1={118} x2={hx + fx} y2={118 + fy} />
                  <ellipse cx={hx + fx + 6} cy={118 + fy + 2} rx={13} ry={6} stroke="none" />
                </g>
              );
            })}
          </g>
        )}

        {/* body: logo triangle parts */}
        <polygon points={pts(lw)} fill={C.cyan} />
        <polygon points={pts(rw)} fill={C.cyan} />
        <polygon points={pts(CHIN)} fill={C.cyan} />

        {/* eye */}
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

        {/* brow */}
        {brow && (
          <path
            d={`M-44,${-126 + (brow.y ?? 0) + brow.l} Q0,${-126 + (brow.y ?? 0) - brow.arch} 44,${-126 + (brow.y ?? 0) + brow.r}`}
            fill="none"
            stroke={C.charcoal}
            strokeWidth={11}
            strokeLinecap="round"
          />
        )}

        {/* mouth = logo notch */}
        {m < 0.05 ? (
          <path d="M-17.3,124.5 L-16.6,110 Q-16.4,106 -12.4,106 L5.3,106 Q9.3,106 9.3,110 L9.3,124.5 Z" fill={C.white} />
        ) : (
          <g>
            <ellipse cx={-4} cy={110 + 4 * m} rx={15 + 6 * m} ry={4 + 12 * m} fill={C.charcoal} />
            {m > 0.45 && <ellipse cx={-4} cy={110 + 12 * m} rx={9 * m} ry={4 * m} fill={C.red} />}
            <rect x={-10} y={106 - 2 * m} width={12} height={7} rx={2} fill={C.white} />
          </g>
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

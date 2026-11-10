import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";
import { rand } from "../lib/anim";

export type BgVariant = "light" | "sepia" | "dark" | "retro";

const SHAPES = Array.from({ length: 12 }, (_, i) => ({
  kind: i % 3, // 0 triangle, 1 circle, 2 ring
  x: rand(i * 3.1) * W,
  y: rand(i * 7.7) * H,
  size: 40 + rand(i * 5.3) * 110,
  depth: 0.3 + rand(i * 9.1) * 0.9,
  rot: rand(i * 2.2) * 360,
}));

/** Floating geometric shapes in 3 parallax depths (brand language: triangle + circle). */
const FloatingShapes: React.FC<{ color: string; opacity: number; drift: number }> = ({ color, opacity, drift }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {SHAPES.map((s, i) => {
        const y = ((s.y - frame * s.depth * drift) % (H + 300) + H + 300) % (H + 300) - 150;
        const x = s.x + Math.sin((frame + i * 40) / 50) * 18 * s.depth;
        const r = s.rot + frame * 0.4 * s.depth;
        const o = opacity * (0.5 + s.depth * 0.5);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity={o}>
            {s.kind === 0 && (
              <polygon
                points={`${-s.size / 2},${-s.size / 3} ${s.size / 2},${-s.size / 3} 0,${s.size / 2}`}
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeLinejoin="round"
              />
            )}
            {s.kind === 1 && <circle r={s.size / 5} fill={color} />}
            {s.kind === 2 && <circle r={s.size / 2.5} fill="none" stroke={color} strokeWidth={6} />}
          </g>
        );
      })}
    </svg>
  );
};

export const Background: React.FC<{ variant?: BgVariant; drift?: number; children?: React.ReactNode }> = ({ variant = "light", drift = 1, children }) => {
  const frame = useCurrentFrame();

  if (variant === "sepia") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #F6ECD8 0%, ${C.sepia} 45%, #D4BC93 100%)` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "multiply" }}>
          <filter id="paperNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={4} />
            <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.7 0" />
          </filter>
          <rect width={W} height={H} filter="url(#paperNoise)" />
        </svg>
        <FloatingShapes color={C.sepiaDark} opacity={0.08} drift={drift * 0.5} />
        {children}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(59,44,30,0.45) 100%)" }} />
      </AbsoluteFill>
    );
  }

  if (variant === "dark") {
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #23292E 0%, #15181B 70%)" }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }, (_, i) => {
            const y0 = 160 + i * 200;
            const len = 1400;
            const off = len - ((frame * 9 + i * 160) % (len * 2));
            const d = `M-20,${y0} H${200 + rand(i) * 200} l60,60 H${700 + rand(i + 3) * 200} l60,-60 H1100`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={C.cyan} strokeOpacity={0.09} strokeWidth={3} />
                <path d={d} fill="none" stroke={C.cyanLight} strokeOpacity={0.5} strokeWidth={3} strokeDasharray={`120 ${len}`} strokeDashoffset={off} />
              </g>
            );
          })}
        </svg>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(12,192,223,0.18) 0%, transparent 45%)` }} />
        {children}
      </AbsoluteFill>
    );
  }

  if (variant === "retro") {
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24302C 0%, #141A18 80%)" }}>
        {children}
        <AbsoluteFill
          style={{
            background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 6px)",
            transform: `translateY(${(frame * 2) % 6}px)`,
          }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      </AbsoluteFill>
    );
  }

  // light (brand default)
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.cyan}33 2.5px, transparent 2.5px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${-frame * 0.6 * drift}px`,
        }}
      />
      <FloatingShapes color={C.cyan} opacity={0.14} drift={drift} />
      {children}
    </AbsoluteFill>
  );
};

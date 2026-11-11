import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { easeOut, easeOutBack, lerp, rand, spr } from "../lib/anim";

type Variant = "pop" | "slam" | "rise" | "glitch" | "type";

/**
 * Word-by-word kinetic typography.
 * Highlighted words get the Devtrine cyan marker bar (drawn in after the word lands).
 */
export const KineticText: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  size?: number;
  color?: string;
  highlight?: string[];
  highlightColor?: string;
  variant?: Variant;
  weight?: number;
  align?: "center" | "left";
  lineHeight?: number;
  font?: string;
  italic?: boolean;
  exitAt?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  start = 0,
  stagger = 4,
  size = 96,
  color = C.charcoal,
  highlight = [],
  highlightColor = C.cyanLight,
  variant = "pop",
  weight = 900,
  align = "center",
  lineHeight = 1.08,
  font = FONT.sans,
  italic = false,
  exitAt,
  letterSpacing = -0.02,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const exit = exitAt !== undefined ? lerp(frame, [exitAt, exitAt + 8], [1, 0], easeOut) : 1;
  let charCount = 0;

  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        letterSpacing: `${letterSpacing}em`,
        fontStyle: italic ? "italic" : "normal",
        opacity: exit,
        transform: `translateY(${(1 - exit) * -30}px)`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const d = start + i * stagger;
        const s = spr(frame, d, variant === "slam" ? { damping: 14, stiffness: 260 } : { damping: 10, stiffness: 170 });
        const cleanW = w.replace(/[?!.,…]/g, "");
        const isHi = highlight.some((h) => h.replace(/[?!.,…]/g, "") === cleanW);
        const bar = lerp(frame, [d + 5, d + 13], [0, 1], easeOut);
        let transform = "";
        let opacity = 1;
        let filter: string | undefined;
        let content: React.ReactNode = w;

        if (variant === "pop") {
          transform = `scale(${s}) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg)`;
          opacity = frame >= d ? 1 : 0;
        } else if (variant === "slam") {
          const sc = lerp(frame, [d, d + 6], [2.6, 1], easeOut);
          transform = `scale(${sc})`;
          opacity = lerp(frame, [d, d + 3], [0, 1]);
          filter = frame < d + 6 ? `blur(${lerp(frame, [d, d + 6], [8, 0])}px)` : undefined;
        } else if (variant === "rise") {
          transform = `translateY(${(1 - s) * 110}%)`;
        } else if (variant === "glitch") {
          const g = frame - d;
          const j = g >= 0 && g < 10 ? (rand(frame + i * 9) * 2 - 1) * 18 * (1 - g / 10) : 0;
          transform = `translateX(${j}px)`;
          opacity = g >= 0 ? (g < 6 && rand(frame * 3 + i) < 0.3 ? 0.2 : 1) : 0;
          if (g >= 0 && g < 10) filter = `drop-shadow(${-j * 0.6}px 0 0 ${C.red}) drop-shadow(${j * 0.6}px 0 0 ${C.cyan})`;
        } else if (variant === "type") {
          const visible = Math.max(0, Math.floor((frame - start) / 1.4) - charCount);
          content = w.slice(0, visible);
          opacity = visible > 0 ? 1 : 0;
        }
        charCount += w.length + 1;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: variant === "rise" ? "hidden" : "visible",
              verticalAlign: "top",
              padding: "0 0.12em",
              position: "relative",
            }}
          >
            {isHi && (
              <span
                style={{
                  position: "absolute",
                  left: "0.02em",
                  right: "0.02em",
                  top: "52%",
                  bottom: "6%",
                  background: highlightColor,
                  transform: `scaleX(${bar})`,
                  transformOrigin: "left center",
                  borderRadius: 6,
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ display: "inline-block", position: "relative", zIndex: 1, transform, opacity, filter, transformOrigin: "50% 70%" }}>
              {content}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Small rounded label (reference-inspired info pills). */
export const Pill: React.FC<{
  text: string;
  bg?: string;
  color?: string;
  at?: number;
  size?: number;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  text,
  bg = C.charcoal,
  color = C.white,
  at = 0,
  size = 26,
  icon,
  style,
}) => {
  const frame = useCurrentFrame();
  const s = spr(frame, at, { damping: 11, stiffness: 200 });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.35,
        background: bg,
        color,
        fontFamily: FONT.mono,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.12em",
        padding: `${size * 0.35}px ${size * 0.8}px`,
        borderRadius: 999,
        transform: `scale(${s})`,
        opacity: frame >= at ? 1 : 0,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

/**
 * Chapter header — mono kicker + bold title with marker, + optional pills.
 * Positioned at the top safe area.
 */
export const Header: React.FC<{
  kicker: string;
  title: string;
  highlight?: string[];
  at?: number;
  pills?: { text: string; bg?: string; color?: string; icon?: React.ReactNode }[];
  tone?: "light" | "dark" | "sepia";
  align?: "left" | "center";
  exitAt?: number;
}> = ({ kicker, title, highlight = [], at = 0, pills = [], tone = "light", align = "left", exitAt }) => {
  const frame = useCurrentFrame();
  const kickerChars = Math.max(0, Math.floor((frame - at) * 1.6));
  const ink = tone === "dark" ? C.white : tone === "sepia" ? C.sepiaInk : C.charcoal;
  const exit = exitAt !== undefined ? lerp(frame, [exitAt, exitAt + 8], [1, 0]) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 230,
        left: 90,
        right: 90,
        textAlign: align,
        opacity: exit,
        transform: `translateY(${(1 - exit) * -40}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.16em",
          color: tone === "dark" ? C.cyanLight : tone === "sepia" ? C.sepiaRed : C.cyan,
          marginBottom: 14,
          height: 36,
        }}
      >
        {kicker.slice(0, kickerChars)}
        {kickerChars < kicker.length && frame >= at ? <span style={{ opacity: 0.6 }}>▍</span> : null}
      </div>
      <KineticText
        text={title}
        start={at + 6}
        stagger={3}
        size={76}
        variant="rise"
        color={ink}
        align={align}
        highlight={highlight}
        highlightColor={tone === "sepia" ? "#E9B9A0" : C.cyanLight}
        font={tone === "sepia" ? FONT.serif : FONT.sans}
        weight={tone === "sepia" ? 700 : 800}
        letterSpacing={tone === "sepia" ? 0 : -0.02}
        style={{ marginLeft: align === "left" ? "-0.12em" : 0 }}
      />
      {pills.length > 0 && (
        <div style={{ display: "flex", gap: 14, marginTop: 20, justifyContent: align === "center" ? "center" : "flex-start" }}>
          {pills.map((p, i) => (
            <Pill key={p.text} text={p.text} bg={p.bg} color={p.color} icon={p.icon} at={at + 14 + i * 4} />
          ))}
        </div>
      )}
    </div>
  );
};

/** Callout label with leader line (points at an object). */
export const Callout: React.FC<{ text: string; x: number; y: number; tx: number; ty: number; at?: number; bg?: string; color?: string }> = ({
  text,
  x,
  y,
  tx,
  ty,
  at = 0,
  bg = C.yellow,
  color = C.charcoal,
}) => {
  const frame = useCurrentFrame();
  const line = lerp(frame, [at, at + 8], [0, 1], easeOut);
  const s = spr(frame, at + 6, { damping: 10, stiffness: 200 });
  if (frame < at) return null;
  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1080} height={1920}>
        <line x1={tx} y1={ty} x2={tx + (x - tx) * line} y2={ty + (y - ty) * line} stroke={C.charcoal} strokeWidth={4} />
        <circle cx={tx} cy={ty} r={9} fill={bg} stroke={C.charcoal} strokeWidth={4} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${s})`,
          background: bg,
          color,
          fontFamily: FONT.mono,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.1em",
          padding: "10px 22px",
          borderRadius: 999,
          border: `4px solid ${C.charcoal}`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </>
  );
};

/** Comic speech bubble attached to the mascot. */
export const SpeechBubble: React.FC<{ text: string; x: number; y: number; at: number; until?: number; tail?: "left" | "right"; size?: number; bg?: string; color?: string }> = ({
  text,
  x,
  y,
  at,
  until,
  tail = "left",
  size = 40,
  bg = C.white,
  color = C.charcoal,
}) => {
  const frame = useCurrentFrame();
  const s = spr(frame, at, { damping: 9, stiffness: 220 });
  const out = until !== undefined ? lerp(frame, [until, until + 6], [1, 0]) : 1;
  if (frame < at || out <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${s * out})`,
        transformOrigin: tail === "left" ? "15% 120%" : "85% 120%",
        background: bg,
        color,
        border: `5px solid ${C.charcoal}`,
        borderRadius: 34,
        padding: "16px 30px",
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: "nowrap",
        boxShadow: `8px 8px 0 ${C.charcoal}`,
      }}
    >
      {text}
      <svg width={50} height={40} style={{ position: "absolute", bottom: -36, [tail === "left" ? "left" : "right"]: 34 }}>
        <path d={tail === "left" ? "M4,0 L40,0 L6,34 Z" : "M10,0 L46,0 L44,34 Z"} fill={bg} stroke={C.charcoal} strokeWidth={5} strokeLinejoin="round" />
        <rect x={0} y={-6} width={50} height={9} fill={bg} />
      </svg>
    </div>
  );
};

export const popIn = (frame: number, at: number) => ({
  transform: `scale(${spr(frame, at, { damping: 10, stiffness: 180 })})`,
  opacity: frame >= at ? 1 : 0,
});

export { easeOutBack };

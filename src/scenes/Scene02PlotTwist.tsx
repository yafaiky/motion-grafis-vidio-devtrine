import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, W } from "../theme";
import { easeIn, easeOut, keys, lerp, shake, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { KineticText, Pill, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash, Glitch } from "../components/Transition";

export const Scene02PlotTwist: React.FC = () => {
  const frame = useCurrentFrame();

  // Rewind progress (f=50..112): 2026 -> 1843
  const rew = lerp(frame, [50, 112], [0, 1]);
  const year = Math.round(lerp(frame, [50, 112], [2026, 1843]));
  const isSepia = frame >= 82;

  // Dramatic zoom before "PLOT TWIST", then shake on impact
  const camScale = keys(frame, [0, 26, 32, 112, 122, 180], [1.18, 1.32, 1.0, 1.0, 1.08, 1.1]);
  const shk = shake(frame, 30, 32, 14);
  const shk2 = shake(frame, 114, 24, 12);

  // Devtrine gets spun around by the time rewind
  const spin = frame >= 52 && frame < 110 ? lerp(frame, [52, 110], [0, -720]) : 0;
  const Victorian = frame >= 92;

  // Morph modern PC -> Victorian brass gear machine
  const gearShow = spr(frame, 88, { damping: 11, stiffness: 160 });
  const pcHide = lerp(frame, [60, 88], [1, 0], easeIn);

  return (
    <Glitch start={28} duration={14}>
      <Background variant={isSepia ? "sepia" : "light"} drift={frame >= 50 && frame < 112 ? -6 : 0.8}>
        <Camera scale={camScale} x={shk.x + shk2.x} y={shk.y + shk2.y} focusX={540} focusY={920}>
          {/* Top headline area */}
          <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center" }}>
            {frame >= 28 && frame < 110 && (
              <KineticText
                text="PLOT TWIST..."
                start={28}
                stagger={5}
                size={104}
                variant="glitch"
                color={isSepia ? C.sepiaInk : C.charcoal}
                highlight={["TWIST..."]}
                highlightColor={C.red}
              />
            )}

            {frame >= 50 && (
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontWeight: 900,
                  fontSize: 118,
                  color: isSepia ? C.sepiaRed : C.cyan,
                  letterSpacing: "-0.04em",
                  textShadow: `6px 6px 0 ${C.charcoal}`,
                  transform: `scale(${frame >= 112 ? spr(frame, 112, { damping: 9, stiffness: 200 }) * 0.15 + 0.85 : 1})`,
                }}
              >
                {year}
              </div>
            )}

            {frame >= 110 && (
              <div style={{ marginTop: 8 }}>
                <Pill text="ERA VICTORIA · ABAD KE-19" bg={C.sepiaInk} color={C.sepia} at={110} size={24} />
                <KineticText
                  text="HUNDREDS OF YEARS AGO!"
                  start={114}
                  stagger={3}
                  size={78}
                  variant="slam"
                  font={FONT.serif}
                  color={C.sepiaInk}
                  highlight={["HUNDREDS"]}
                  highlightColor={C.yellow}
                  style={{ marginTop: 14 }}
                />
              </div>
            )}
          </div>

          {/* Rewind timeline strip in middle */}
          {frame >= 48 && frame < 116 && (
            <div
              style={{
                position: "absolute",
                top: 590,
                left: 0,
                width: W,
                height: 70,
                background: C.charcoal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                color: C.yellow,
                fontFamily: FONT.mono,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "0.14em",
              }}
            >
              <span>◀◀ REWIND SEJARAH</span>
              <span>•</span>
              <span>{(rew * 183).toFixed(0)} TAHUN MUNDUR</span>
            </div>
          )}

          {/* Right side: Modern PC rewinding into Classical Mechanical Computer */}
          <div style={{ position: "absolute", left: 700, top: 1010, transform: "translate(-50%, -50%)" }}>
            {/* Modern PC shrinking out */}
            {pcHide > 0.01 && (
              <div style={{ transform: `scale(${pcHide}) rotate(${(1 - pcHide) * -90}deg)`, opacity: pcHide }}>
                <svg width={320} height={280} viewBox="-160 -140 320 280">
                  <rect x={-140} y={-110} width={280} height={190} rx={20} fill={C.charcoal} />
                  <rect x={-124} y={-94} width={248} height={152} rx={10} fill={C.cyan} />
                  <text x={0} y={-8} textAnchor="middle" fill={C.charcoal} fontFamily={FONT.mono} fontSize={36} fontWeight={900}>
                    2026
                  </text>
                </svg>
              </div>
            )}

            {/* Classical Analytical Difference Machine popping in */}
            {gearShow > 0.01 && (
              <div style={{ transform: `scale(${gearShow})` }}>
                <svg width={400} height={420} viewBox="-200 -210 400 420" style={{ overflow: "visible" }}>
                  <ellipse cx={0} cy={180} rx={160} ry={18} fill={C.sepiaInk} opacity={0.22} />
                  {/* Wooden base & brass frame */}
                  <rect x={-155} y={130} width={310} height={44} rx={10} fill={C.sepiaDark} stroke={C.sepiaInk} strokeWidth={7} />
                  <rect x={-130} y={-140} width={260} height={275} rx={16} fill="#D9A441" stroke={C.sepiaInk} strokeWidth={8} />
                  <rect x={-110} y={-118} width={220} height={230} rx={8} fill="#F4E2B8" stroke={C.sepiaInk} strokeWidth={5} />
                  {/* Spinning brass gears */}
                  {[
                    { cx: -45, cy: -35, r: 54, dir: 1, col: "#C88A2B" },
                    { cx: 52, cy: 15, r: 44, dir: -1.3, col: "#E2AC48" },
                    { cx: -35, cy: 62, r: 34, dir: -1.6, col: "#B6781E" },
                  ].map((g, idx) => (
                    <g key={idx} transform={`translate(${g.cx},${g.cy}) rotate(${frame * 2.4 * g.dir})`}>
                      {Array.from({ length: 8 }, (_, k) => (
                        <rect
                          key={k}
                          x={-8}
                          y={-g.r - 10}
                          width={16}
                          height={g.r * 2 + 20}
                          rx={4}
                          fill={g.col}
                          stroke={C.sepiaInk}
                          strokeWidth={4}
                          transform={`rotate(${k * 22.5})`}
                        />
                      ))}
                      <circle r={g.r} fill={g.col} stroke={C.sepiaInk} strokeWidth={5} />
                      <circle r={g.r * 0.38} fill="#F4E2B8" stroke={C.sepiaInk} strokeWidth={5} />
                    </g>
                  ))}
                  {/* Hand crank */}
                  <g transform={`translate(130, 0) rotate(${Math.sin(frame * 0.15) * 25})`}>
                    <rect x={0} y={-8} width={48} height={16} rx={6} fill={C.sepiaInk} />
                    <circle cx={48} cy={-26} r={14} fill={C.sepiaRed} stroke={C.sepiaInk} strokeWidth={5} />
                  </g>
                  <text x={0} y={160} textAnchor="middle" fill={C.sepia} fontFamily={FONT.serif} fontSize={24} fontWeight={700}>
                    MESIN KOMPUTASI KLASIK
                  </text>
                </svg>
              </div>
            )}
          </div>

          {/* Devtrine Mascot — dramatic pause, then spins into Victorian outfit */}
          <DevtrineMascot
            x={330}
            y={1040}
            size={225}
            expression={frame < 28 ? "curious" : frame < 110 ? "shocked" : "amazed"}
            pupilScale={frame < 28 ? lerp(frame, [0, 26], [1, 0.42], easeOut) : undefined}
            lookX={frame < 28 ? 0 : 0.65}
            lookY={frame < 28 ? 0 : -0.15}
            rotate={spin}
            wingL={frame >= 30 ? -36 : 0}
            wingR={frame >= 30 ? -36 : 0}
            hat={Victorian}
            mustache={Victorian}
            sweat={frame >= 28 && frame < 95 ? 1 : 0}
            legs
            frame={frame}
            shadow
          />

          <SpeechBubble text="Tunggu... HAH?!" x={330} y={777} at={30} until={86} tail="left" size={38} bg={C.yellow} />
          <SpeechBubble text="Kok gue berkumis bangsawan?!" x={370} y={720} at={116} until={176} tail="left" size={34} />
        </Camera>

        {/* VHS scanlines during rewind */}
        {frame >= 48 && frame < 112 && (
          <AbsoluteFill
            style={{
              background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 3px, transparent 3px, transparent 9px)",
              pointerEvents: "none",
            }}
          />
        )}

        <Flash at={30} max={0.7} />
        <Flash at={112} color={C.sepia} max={0.65} />

        <Subtitles
          cues={[
            {
              from: 6,
              to: 62,
              text: "Plot twist...",
              hi: ["Plot", "twist..."],
            },
            {
              from: 62,
              to: 176,
              text: "Ternyata sejarah programming udah dimulai sejak ratusan tahun lalu!",
              hi: ["sejarah", "programming", "ratusan", "tahun"],
            },
          ]}
        />

        {/* Audio cues */}
        <Sfx name="tape_stop" at={0} volume={0.75} />
        <Sfx name="glitch" at={28} volume={0.9} />
        <Sfx name="impact" at={30} volume={0.85} />
        <Sfx name="whoosh_reverse" at={48} volume={0.9} />
        <Sfx name="tape_rewind" at={52} volume={0.75} />
        <Sfx name="pop" at={92} volume={0.85} />
        <Sfx name="cinematic_hit" at={112} volume={0.85} />
      </Background>
    </Glitch>
  );
};

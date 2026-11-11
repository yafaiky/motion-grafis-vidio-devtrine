import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, easeOut, keys, lerp, shake, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Callout, Header, SpeechBubble } from "../components/KineticTypography";
import { IconScroll, IconZap } from "../components/Icons";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash } from "../components/Transition";

const MATH_NOTES = [
  { sym: "Bₙ = ∑ Cₖ", x: 180, y: 600 },
  { sym: "Note G · 1843", x: 850, y: 580 },
  { sym: "∫ f(x) dx", x: 195, y: 900 },
  { sym: "LOOP(i=1..n)", x: 870, y: 890 },
];

export const Scene03AdaLovelace: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = lerp(frame, [158, 178], [0, 1], easeOut);

  const portraitPop = spr(frame, 10, { damping: 12, stiffness: 150 });
  const laptopPop = spr(frame, 172, { damping: 11, stiffness: 170 });
  const smackShake = shake(frame, 255, 22, 12);

  // Loading bar crawls 12% -> 99% and gets stuck forever
  const loadPct = frame < 235 ? Math.floor(lerp(frame, [180, 235], [14, 99])) : 99;

  return (
    <AbsoluteFill>
      {/* PART A — 1843 HISTORICAL ILLUSTRATION: ADA LOVELACE & ANALYTICAL ENGINE */}
      <Background variant="sepia" drift={0.6}>
        <Header
          kicker="1843 · LONDON, INGGRIS"
          title="Ada Lovelace"
          highlight={["Lovelace"]}
          tone="sepia"
          pills={[
            { text: "PROGRAMMER PERTAMA DUNIA", bg: C.sepiaInk, color: C.sepia },
            { text: "ANALYTICAL ENGINE", bg: C.sepiaRed, color: C.white },
          ]}
        />

        {/* Floating mathematical notes & Note G algorithm scroll */}
        {MATH_NOTES.map((m, i) => {
          const s = spr(frame, 22 + i * 8, { damping: 11, stiffness: 170 });
          const dy = Math.sin((frame + i * 25) * 0.08) * 12;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: m.x,
                top: m.y + dy,
                transform: `translate(-50%, -50%) scale(${s}) rotate(${(i % 2 ? 1 : -1) * 6}deg)`,
                background: "#FBF3E0",
                border: `4px solid ${C.sepiaInk}`,
                borderRadius: 14,
                padding: "10px 18px",
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: 28,
                color: C.sepiaInk,
                boxShadow: `6px 6px 0 ${C.sepiaInk}33`,
              }}
            >
              {m.sym}
            </div>
          );
        })}

        {/* Analytical Engine brass gears behind portrait */}
        <div style={{ position: "absolute", left: 730, top: 1030, transform: `translate(-50%, -50%) scale(${portraitPop})` }}>
          <svg width={360} height={360} viewBox="-180 -180 360 360">
            <rect x={-130} y={-140} width={260} height={280} rx={16} fill="#C99235" stroke={C.sepiaInk} strokeWidth={7} />
            <rect x={-108} y={-118} width={216} height={236} rx={10} fill="#F3DFB6" stroke={C.sepiaInk} strokeWidth={5} />
            {[
              { x: -38, y: -32, r: 52, spd: 2 },
              { x: 46, y: 26, r: 42, spd: -2.6 },
              { x: -32, y: 66, r: 30, spd: 3.4 },
            ].map((g, i) => (
              <g key={i} transform={`translate(${g.x},${g.y}) rotate(${frame * g.spd})`}>
                {Array.from({ length: 8 }, (_, k) => (
                  <rect key={k} x={-7} y={-g.r - 9} width={14} height={g.r * 2 + 18} rx={3} fill="#B87D20" stroke={C.sepiaInk} strokeWidth={4} transform={`rotate(${k * 22.5})`} />
                ))}
                <circle r={g.r} fill="#D9A441" stroke={C.sepiaInk} strokeWidth={5} />
                <circle r={g.r * 0.35} fill={C.sepia} stroke={C.sepiaInk} strokeWidth={4} />
              </g>
            ))}
          </svg>
        </div>

        {/* Historical Portrait of Ada Lovelace */}
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 900,
            transform: `translate(-50%, -50%) scale(${portraitPop})`,
            width: 440,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ornate Victorian Gold / Sepia Frame with the Real Historical Photo */}
          <div
            style={{
              position: "relative",
              width: 350,
              height: 420,
              borderRadius: "50%",
              background: "#C88A2B",
              border: `9px solid ${C.sepiaInk}`,
              boxShadow: `10px 10px 0 rgba(59,44,30,0.35)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 308,
                height: 380,
                borderRadius: "50%",
                border: `6px solid ${C.sepiaInk}`,
                overflow: "hidden",
                backgroundColor: "#EAD8B3",
                position: "relative",
              }}
            >
              <Img
                src={staticFile("images/Ada_lovelace.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 15%",
                }}
              />
              {/* Subtle sepia vintage tone overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#D4BC93",
                  opacity: 0.12,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Quill pen writing on parchment */}
          <svg
            width={120}
            height={120}
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              right: 15,
              bottom: 45,
              overflow: "visible",
              transform: `rotate(${Math.sin(frame * 0.25) * 10 - 15}deg)`,
              zIndex: 3,
            }}
          >
            <path d="M10,80 L85,-15 Q105,10 65,50 Z" fill={C.white} stroke={C.sepiaInk} strokeWidth={5} />
            <line x1={10} y1={80} x2={85} y2={-15} stroke={C.sepiaInk} strokeWidth={4} />
          </svg>

          {/* Ribbon banner */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              background: C.sepiaInk,
              border: `4px solid #C88A2B`,
              borderRadius: 14,
              padding: "8px 24px",
              boxShadow: `0 6px 0 rgba(0,0,0,0.25)`,
              zIndex: 4,
            }}
          >
            <div
              style={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: 26,
                color: C.sepia,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              ADA LOVELACE (1843)
            </div>
          </div>
        </div>

        <Callout text="ALGORITMA PERTAMA!" x={780} y={760} tx={650} ty={900} at={42} bg={C.yellow} />

        {/* Devtrine in 1843 admiring Ada */}
        <DevtrineMascot
          x={200}
          y={1290}
          size={175}
          expression="amazed"
          lookX={0.65}
          lookY={-0.35}
          hat
          mustache
          wingR={-35 + Math.sin(frame * 0.2) * 10}
          legs
          frame={frame}
          shadow
        />
        <SpeechBubble text="1843 udah ngoding pake bulu angsa!" x={390} y={660} at={52} until={154} tail="left" size={30} />
      </Background>

      {/* PART B — MODERN DAY CONTRAST: LAPTOP LAGGING AT 99% */}
      {wipe > 0 && (
        <AbsoluteFill
          style={{
            clipPath: `polygon(0 0, ${wipe * 145}% 0, ${ Math.max(0, wipe * 145 - 35)}% 100%, 0 100%)`,
          }}
        >
          <Background variant="light" drift={1.1}>
            <Camera scale={keys(frame, [165, 240, 260, 330], [1, 1.04, 1.08, 1.08])} x={smackShake.x} y={smackShake.y} focusX={540} focusY={960}>
              <Header
                kicker="SEMENTARA KITA SEKARANG..."
                title="Buka 2 Tab Langsung Nge-Lag!"
                highlight={["Nge-Lag!"]}
                at={170}
                pills={[
                  { text: "1843: ALGORITMA", icon: <IconScroll size={18} color={C.sepia} />, bg: C.sepiaInk, color: C.sepia },
                  { text: "2026: NGE-LAG", icon: <IconZap size={18} color={C.white} />, bg: C.red, color: C.white },
                ]}
              />

              {/* Lagging Modern Laptop with smoke & stuck loading bar */}
              <div
                style={{
                  position: "absolute",
                  left: 690,
                  top: 1030,
                  transform: `translate(-50%, -50%) scale(${laptopPop}) rotate(${frame >= 235 ? Math.sin(frame * 1.4) * 2.5 : 0}deg)`,
                }}
              >
                <svg width={470} height={410} viewBox="-235 -225 470 410" style={{ overflow: "visible" }}>
                  {/* Smoke puffs when stuck at 99% */}
                  {frame >= 235 &&
                    [0, 1, 2].map((k) => {
                      const p = ((frame - 235 + k * 18) % 54) / 54;
                      return (
                        <circle
                          key={k}
                          cx={-50 + k * 55 + Math.sin(frame * 0.2 + k) * 18}
                          cy={-165 - p * 120}
                          r={18 + p * 34}
                          fill="#9CA3AF"
                          opacity={(1 - p) * 0.65}
                        />
                      );
                    })}

                  {/* Laptop screen */}
                  <rect x={-195} y={-155} width={390} height={245} rx={20} fill={C.charcoal} />
                  <rect x={-177} y={-137} width={354} height={208} rx={10} fill="#182026" />
                  {/* Keyboard base */}
                  <path d="M-225,90 L225,90 L200,122 L-200,122 Z" fill={C.charcoal} />
                  <rect x={-55} y={96} width={110} height={10} rx={5} fill={C.cyanLight} opacity={0.5} />

                  {/* Stuck Loading UI */}
                  <text x={0} y={-90} textAnchor="middle" fill={C.white} fontFamily={FONT.mono} fontSize={18} fontWeight={800}>
                    Membuka Tugas_Skripsi_Final.js...
                  </text>
                  {/* Loading Bar */}
                  <rect x={-148} y={-62} width={296} height={36} rx={18} fill="#2E3840" stroke={C.white} strokeWidth={4} />
                  <rect
                    x={-142}
                    y={-56}
                    width={(284 * loadPct) / 100}
                    height={24}
                    rx={12}
                    fill={loadPct >= 99 ? C.red : C.cyan}
                  />
                  <text x={0} y={4} textAnchor="middle" fill={C.yellow} fontFamily={FONT.mono} fontSize={24} fontWeight={900}>
                    {loadPct}% {loadPct >= 99 ? "(NOT RESPONDING)" : ""}
                  </text>
                  <text x={0} y={42} textAnchor="middle" fill="#9CA3AF" fontFamily={FONT.mono} fontSize={18} fontWeight={700}>
                    Estimasi selesai: 348 Tahun Lagi
                  </text>
                </svg>
              </div>

              {/* Devtrine annoyed / panicking at the lagging laptop */}
              <DevtrineMascot
                x={275}
                y={1060}
                size={215}
                expression={frame < 245 ? "annoyed" : "panic"}
                blink={autoBlink(frame, 9)}
                lookX={0.85}
                lookY={0.1}
                wingR={frame >= 245 ? -42 + Math.sin(frame * 0.8) * 28 : 10}
                sweat={frame >= 230 ? 1 : 0}
                legs
                frame={frame}
                shadow
              />

              <SpeechBubble
                text="Dari 99% udah 2 jam woy!!"
                x={330}
                y={780}
                at={232}
                until={324}
                tail="left"
                size={34}
                bg={C.yellow}
              />
            </Camera>
          </Background>
        </AbsoluteFill>
      )}

      <Flash at={165} max={0.5} />

      <Subtitles
        cues={[
          {
            from: 6,
            to: 112,
            text: "Ada Lovelace, yang dikenal sebagai programmer pertama di dunia.",
            hi: ["Ada", "Lovelace,", "programmer", "pertama"],
          },
          {
            from: 112,
            to: 215,
            text: "Bayangin, zaman dulu udah mikirin coding...",
            hi: ["zaman", "dulu", "coding..."],
          },
          {
            from: 215,
            to: 326,
            tag: "storytelling",
            text: "Sementara kita sekarang masih mikirin kenapa laptop nge-lag!",
            hi: ["sekarang", "laptop", "nge-lag!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="ticking" at={0} volume={0.75} duration={160} />
      <Sfx name="paper" at={20} volume={0.8} />
      <Sfx name="paper" at={48} volume={0.7} />
      <Sfx name="whoosh" at={160} volume={0.85} />
      <Sfx name="typing" at={175} volume={0.75} duration={70} />
      <Sfx name="loading" at={195} volume={0.8} duration={130} />
      <Sfx name="puff" at={238} volume={0.85} />
      <Sfx name="bonk" at={255} volume={0.8} />
    </AbsoluteFill>
  );
};

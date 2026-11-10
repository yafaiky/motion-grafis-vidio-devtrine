import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { easeOut, keys, lerp, rand, shake, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Callout, Header, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";

const COLUMNS = Array.from({ length: 12 }, (_, i) => ({
  x: 75 + i * 84,
  spd: 5 + (i % 4) * 2.4,
  bits: Array.from({ length: 16 }, (__, j) => (Math.round(rand(i * 19 + j * 7)) ? "1" : "0")),
}));

const PILE_BITS = Array.from({ length: 14 }, (_, i) => ({
  bit: i % 2 === 0 ? "0" : "1",
  x: 135 + (i % 7) * 52 + (i > 6 ? 22 : 0),
  y: 1220 - Math.floor(i / 7) * 65,
  rot: (rand(i * 11) - 0.5) * 38,
  delay: 135 + i * 3,
}));

export const Scene05MachineLanguage: React.FC = () => {
  const frame = useCurrentFrame();

  const eniacPop = spr(frame, 8, { damping: 12, stiffness: 150 });
  const dizzy = frame >= 85;
  const buried = frame >= 145;
  const buryY = lerp(frame, [140, 175], [0, 85], easeOut);
  const camScale = keys(frame, [0, 80, 140, 225], [1, 1.04, 1.1, 1.12]);
  const shk = shake(frame, 145, 18, 16);

  return (
    <Background variant="retro">
      <Camera scale={camScale} x={shk.x} y={shk.y} focusX={480} focusY={980}>
        {/* Flowing Binary Code Rain in background */}
        <AbsoluteFill style={{ opacity: 0.34, pointerEvents: "none" }}>
          {COLUMNS.map((col, idx) => {
            const yOff = (frame * col.spd) % 960;
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: col.x,
                  top: -320 + yOff,
                  fontFamily: FONT.mono,
                  fontWeight: 800,
                  fontSize: 34,
                  lineHeight: 1.55,
                  color: idx % 2 === 0 ? C.cyanLight : C.green,
                  textShadow: `0 0 12px ${C.cyan}`,
                }}
              >
                {col.bits.map((b, j) => (
                  <div key={j}>{b}</div>
                ))}
              </div>
            );
          })}
        </AbsoluteFill>

        <Header
          kicker="ERA 1940-AN · KOMPUTER GENERASI PERTAMA"
          title="Bahasa Mesin: 0 & 1"
          highlight={["0", "1"]}
          tone="dark"
          pills={[
            { text: "BINARY CODE", bg: C.cyan, color: C.charcoal },
            { text: "UKURAN 1 RUANGAN!", bg: C.yellow, color: C.charcoal },
          ]}
        />

        {/* Retro 1940s Giant Mainframe Computer (ENIAC-inspired) */}
        <div
          style={{
            position: "absolute",
            left: 710,
            top: 970,
            transform: `translate(-50%, -50%) scale(${eniacPop})`,
          }}
        >
          <svg width={460} height={520} viewBox="-230 -260 460 520">
            {/* Cabinet body */}
            <rect x={-195} y={-230} width={390} height={450} rx={22} fill="#36423E" stroke={C.charcoal} strokeWidth={10} />
            <rect x={-172} y={-206} width={344} height={402} rx={12} fill="#252E2B" stroke={C.charcoal} strokeWidth={6} />

            {/* Dual spinning magnetic tape reels */}
            {[-88, 88].map((rx, i) => (
              <g key={i} transform={`translate(${rx}, -115) rotate(${frame * (i === 0 ? 5 : -5)})`}>
                <circle r={66} fill="#161C1A" stroke={C.cyanLight} strokeWidth={6} />
                <circle r={22} fill={C.cyan} />
                {[0, 120, 240].map((deg) => (
                  <rect key={deg} x={-7} y={-60} width={14} height={38} rx={4} fill={C.cyanLight} transform={`rotate(${deg})`} />
                ))}
              </g>
            ))}

            {/* Blinking vacuum tube lights grid */}
            {Array.from({ length: 24 }, (_, k) => {
              const gx = -138 + (k % 6) * 55;
              const gy = -15 + Math.floor(k / 6) * 36;
              const on = Math.sin(frame * 0.35 + k * 1.9) > 0;
              return (
                <circle
                  key={k}
                  cx={gx}
                  cy={gy}
                  r={10}
                  fill={on ? (k % 3 === 0 ? C.yellow : k % 2 === 0 ? C.red : C.green) : "#141A18"}
                  stroke={C.charcoal}
                  strokeWidth={3}
                />
              );
            })}

            {/* Green CRT binary readout */}
            <rect x={-148} y={120} width={296} height={58} rx={8} fill="#0B1911" stroke={C.green} strokeWidth={4} />
            <text x={0} y={158} textAnchor="middle" fill={C.green} fontFamily={FONT.mono} fontSize={28} fontWeight={800}>
              {"01001000 01001001".slice(0, 6 + (Math.floor(frame / 3) % 12))}
            </text>
          </svg>
        </div>

        {/* Binary Data Stream Ribbon flowing from Mainframe toward Devtrine */}
        {frame >= 30 && (
          <div
            style={{
              position: "absolute",
              left: 190,
              top: 780,
              width: 500,
              padding: "12px 22px",
              background: "rgba(12, 192, 223, 0.18)",
              border: `4px solid ${C.cyanLight}`,
              borderRadius: 18,
              fontFamily: FONT.mono,
              fontWeight: 900,
              fontSize: 38,
              color: C.white,
              letterSpacing: "0.14em",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transform: `rotate(-8deg) scale(${spr(frame, 30, { damping: 11, stiffness: 170 })})`,
            }}
          >
            {"011010010100111001010".slice(frame % 8, (frame % 8) + 12)}
          </div>
        )}

        <Callout text="ENIAC · 30 TON!" x={780} y={660} tx={720} ty={760} at={38} bg={C.yellow} />

        {/* Devtrine reading the binary stream -> gets dizzy -> gets buried under 0s and 1s */}
        <DevtrineMascot
          x={290}
          y={1070 + buryY}
          size={215}
          expression={dizzy ? "dizzy" : "curious"}
          lookX={dizzy ? 0 : Math.sin(frame * 0.55) * 1.1}
          lookY={-0.3}
          wingL={dizzy ? -45 + Math.sin(frame * 0.6) * 20 : -15}
          wingR={dizzy ? -45 + Math.cos(frame * 0.6) * 20 : 25}
          sweat={frame >= 65 ? 1 : 0}
          legs={!buried}
          frame={frame}
          shadow
        />

        {/* Avalanche of giant 0 & 1 blocks piling on top of Devtrine */}
        {PILE_BITS.map((b, i) => {
          if (frame < b.delay) return null;
          const s = spr(frame, b.delay, { damping: 10, stiffness: 200 });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x,
                top: lerp(s, [0, 1], [620, b.y]),
                transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                background: i % 2 === 0 ? C.cyanLight : C.yellow,
                color: C.charcoal,
                fontFamily: FONT.mono,
                fontWeight: 900,
                fontSize: 54,
                padding: "4px 20px",
                borderRadius: 16,
                border: `5px solid ${C.charcoal}`,
                boxShadow: `5px 5px 0 ${C.charcoal}`,
              }}
            >
              {b.bit}
            </div>
          );
        })}

        <SpeechBubble
          text="010101... Mata gue kram!!"
          x={330}
          y={740}
          at={78}
          until={220}
          tail="left"
          size={34}
          bg={C.yellow}
        />
      </Camera>

      <Subtitles
        cues={[
          {
            from: 4,
            to: 105,
            tag: "energetic",
            text: "Lanjut! Sekitar tahun 1940-an, programmer harus menggunakan bahasa mesin...",
            hi: ["1940-an,", "bahasa", "mesin..."],
          },
          {
            from: 105,
            to: 220,
            tag: "energetic",
            text: "Yang isinya cuma angka nol dan satu!",
            hi: ["angka", "nol", "satu!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="digital_sweep" at={0} volume={0.85} />
      <Sfx name="machine_hum" at={6} volume={0.65} duration={215} />
      <Sfx name="retro_beep" at={24} volume={0.8} />
      <Sfx name="data" at={48} volume={0.75} />
      <Sfx name="typing" at={95} volume={0.75} />
      <Sfx name="boing" at={140} volume={0.85} />
    </Background>
  );
};

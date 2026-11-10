import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, easeOut, keys, lerp, spr, squash } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Header, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";

const LANGS = [
  {
    name: "C",
    year: "1972",
    at: 30,
    x: 295,
    y: 720,
    accent: C.cyan,
    badge: "THE LEGEND",
    code: 'printf("Halo!");',
    joke: "Lupa ; langsung meledak 💥",
  },
  {
    name: "C++",
    year: "1985",
    at: 85,
    x: 785,
    y: 720,
    accent: C.cyanLight,
    badge: "OBJECT ORIENTED",
    code: 'std::cout << "Halo!";',
    joke: "C dikasih suplemen ++ 💪",
  },
  {
    name: "Java",
    year: "1995",
    at: 140,
    x: 295,
    y: 1090,
    accent: C.yellow,
    badge: "WRITE ONCE ☕",
    code: 'System.out.println("Halo!");',
    joke: "Ngetik 1 baris berasa nulis novel 📜",
  },
  {
    name: "Python",
    year: "MODERN",
    at: 195,
    x: 785,
    y: 1090,
    accent: C.green,
    badge: "FAVORIT AI 🐍",
    code: 'print("Halo!")',
    joke: "Pendek, santuy, anti ribet! ✨",
  },
];

export const Scene07ProgrammingEvolution: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which era card Devtrine is jumping between
  const stage = frame < 85 ? 0 : frame < 140 ? 1 : frame < 195 ? 2 : 3;
  const prev = LANGS[Math.max(0, stage - 1)];
  const curr = LANGS[stage];
  const jumpProg = stage === 0 ? spr(frame, 20, { damping: 12, stiffness: 160 }) : lerp(frame, [curr.at - 14, curr.at + 4], [0, 1], easeOut);
  const mx = stage === 0 ? curr.x : lerp(jumpProg, [0, 1], [prev.x, curr.x]);
  const baseMy = stage === 0 ? curr.y - 165 : lerp(jumpProg, [0, 1], [prev.y - 165, curr.y - 165]);
  const arc = stage === 0 ? 0 : Math.sin(jumpProg * Math.PI) * -150;
  const sq = squash(frame, curr.at + 4, 0.26);

  const camScale = keys(frame, [0, 40, 220, 270], [1, 1.03, 1.06, 1.02]);

  return (
    <Background variant="light" drift={1.6}>
      <Camera scale={camScale} focusX={540} focusY={920}>
        <Header
          kicker="EVOLUSI BAHASA PEMROGRAMAN"
          title="Makin Manusiawi & Modern!"
          highlight={["Manusiawi", "Modern!"]}
          pills={[
            { text: "C → C++ → JAVA → PYTHON", bg: C.charcoal, color: C.cyanLight },
          ]}
        />

        {/* Connected Timeline Path */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path
            d="M 295 720 L 785 720 L 295 1090 L 785 1090"
            fill="none"
            stroke={C.charcoal}
            strokeWidth={10}
            strokeDasharray="22 16"
            opacity={0.25}
          />
          <path
            d="M 295 720 L 785 720 L 295 1090 L 785 1090"
            fill="none"
            stroke={C.cyan}
            strokeWidth={10}
            strokeDasharray={1800}
            strokeDashoffset={1800 - lerp(frame, [30, 205], [0, 1800])}
            strokeLinecap="round"
          />
        </svg>

        {/* 4 Language Cards */}
        {LANGS.map((l, i) => {
          const pop = spr(frame, l.at, { damping: 11, stiffness: 190 });
          const active = stage === i && frame >= l.at;
          // Java gag: card stretches wider because System.out.println is so verbose!
          const extraW = l.name === "Java" && frame >= l.at + 10 ? lerp(frame, [l.at + 10, l.at + 24], [0, 36], easeOut) : 0;

          return (
            <div
              key={l.name}
              style={{
                position: "absolute",
                left: l.x,
                top: l.y,
                width: 430 + extraW,
                transform: `translate(-50%, -50%) scale(${pop * (active ? 1.05 : 1)})`,
                background: C.white,
                border: `6px solid ${C.charcoal}`,
                borderRadius: 28,
                padding: "20px 24px",
                boxShadow: active ? `12px 12px 0 ${l.accent}` : `8px 8px 0 ${C.charcoal}`,
                opacity: frame >= l.at ? 1 : 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 900,
                    fontSize: 54,
                    color: C.charcoal,
                    lineHeight: 1,
                  }}
                >
                  {l.name}
                </span>
                <span
                  style={{
                    background: l.accent,
                    color: C.charcoal,
                    fontFamily: FONT.mono,
                    fontWeight: 800,
                    fontSize: 20,
                    padding: "5px 14px",
                    borderRadius: 999,
                    border: `3px solid ${C.charcoal}`,
                  }}
                >
                  {l.year} · {l.badge}
                </span>
              </div>

              {/* Code snippet box */}
              <div
                style={{
                  background: "#161B22",
                  color: C.cyanLight,
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: l.name === "Java" ? 21 : 24,
                  padding: "12px 16px",
                  borderRadius: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {l.code.slice(0, Math.max(0, Math.floor((frame - l.at) * 1.3)))}
              </div>

              {/* Joke caption */}
              <div
                style={{
                  marginTop: 10,
                  fontFamily: FONT.sans,
                  fontWeight: 700,
                  fontSize: 21,
                  color: C.charcoal,
                }}
              >
                {l.joke}
              </div>
            </div>
          );
        })}

        {/* Devtrine jumping from card to card */}
        <DevtrineMascot
          x={mx}
          y={baseMy + arc}
          size={150}
          expression={stage === 2 ? "shocked" : "happy"}
          blink={autoBlink(frame, 11)}
          sx={sq.sx}
          sy={sq.sy}
          lookX={stage % 2 === 0 ? 0.5 : -0.5}
          lookY={0.4}
          wingL={arc < -20 ? -42 : -15}
          wingR={arc < -20 ? -42 : 15}
          legs
          legPhase={frame * 0.45}
          sweat={stage === 2 ? 1 : 0}
          frame={frame}
          shadow
        />

        <SpeechBubble text="Java panjang amat kodenya!" x={350} y={1315} at={150} until={192} tail="left" size={28} bg={C.yellow} />
        <SpeechBubble text="Python sesingkat chat gebetan!" x={720} y={1315} at={205} until={265} tail="right" size={28} bg={C.green} />
      </Camera>

      <Subtitles
        cues={[
          {
            from: 4,
            to: 95,
            tag: "excited",
            text: "Untungnya teknologi terus berkembang.",
            hi: ["teknologi", "berkembang."],
          },
          {
            from: 95,
            to: 266,
            tag: "excited",
            text: "Muncullah bahasa pemrograman seperti C, C++, Java, sampai Python!",
            hi: ["C,", "C++,", "Java,", "Python!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="digital_sweep" at={0} volume={0.8} />
      <Sfx name="pop" at={30} volume={0.85} />
      <Sfx name="boing" at={32} volume={0.75} />
      <Sfx name="typing" at={36} volume={0.65} duration={45} />
      <Sfx name="boing" at={76} volume={0.85} rate={1.08} />
      <Sfx name="pop" at={85} volume={0.85} />
      <Sfx name="boing" at={132} volume={0.85} rate={1.15} />
      <Sfx name="pop" at={140} volume={0.85} />
      <Sfx name="data" at={148} volume={0.65} duration={40} />
      <Sfx name="boing" at={186} volume={0.9} rate={1.25} />
      <Sfx name="pop" at={195} volume={0.9} />
    </Background>
  );
};

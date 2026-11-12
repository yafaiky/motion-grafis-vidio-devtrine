import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, easeOut, keys, lerp, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Header, SpeechBubble } from "../components/KineticTypography";
import { IconCoffee, IconCode, IconFlame, IconRocket, IconScroll, IconSparkle } from "../components/Icons";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";

const LANGS = [
  {
    name: "C",
    year: "1972",
    at: 30,
    x: 275,
    y: 610,
    accent: C.cyan,
    badge: "THE LEGEND",
    badgeIcon: null,
    code: 'printf("Halo!");',
    joke: "Lupa ; langsung meledak",
    jokeIcon: <IconFlame size={20} color={C.red} />,
  },
  {
    name: "C++",
    year: "1985",
    at: 85,
    x: 805,
    y: 610,
    accent: C.cyanLight,
    badge: "OOP",
    badgeIcon: null,
    code: 'std::cout << "Halo!";',
    joke: "C dikasih suplemen ++",
    jokeIcon: <IconRocket size={20} color={C.cyan} />,
  },
  {
    name: "Java",
    year: "1995",
    at: 140,
    x: 275,
    y: 1010,
    accent: C.yellow,
    badge: "WRITE ONCE",
    badgeIcon: <IconCoffee size={17} color={C.charcoal} />,
    code: 'System.out.println("Halo!");',
    joke: "Ngetik 1 baris berasa novel",
    jokeIcon: <IconScroll size={20} color={C.charcoal} />,
  },
  {
    name: "Python",
    year: "MODERN",
    at: 195,
    x: 805,
    y: 1010,
    accent: C.green,
    badge: "FAVORIT AI",
    badgeIcon: <IconCode size={17} color={C.charcoal} />,
    code: 'print("Halo!")',
    joke: "Pendek, santuy, anti ribet!",
    jokeIcon: <IconSparkle size={20} color={C.green} />,
  },
];

export const Scene07ProgrammingEvolution: React.FC = () => {
  const frame = useCurrentFrame();

  // Active language stage (0: C, 1: C++, 2: Java, 3: Python)
  const stage = frame < 85 ? 0 : frame < 140 ? 1 : frame < 195 ? 2 : 3;

  // Devtrine mascot positioning with generous margins:
  // When stage < 2 (C / C++): hovers at y = 475
  // When stage >= 2 (Java / Python): hovers at y = 810 in the spacious 230px center gap
  const targetX = stage === 0 ? 430 : stage === 1 ? 650 : 540;
  const targetY = stage < 2 ? 475 : 810;
  const mx = lerp(frame, [stage === 1 ? 80 : stage === 2 ? 135 : stage === 3 ? 190 : 25, stage === 1 ? 95 : stage === 2 ? 150 : stage === 3 ? 205 : 35], [targetX, targetX], easeOut);
  const my = targetY + Math.sin(frame * 0.12) * 8;

  const camScale = keys(frame, [0, 40, 220, 270], [1, 1.02, 1.04, 1.01]);

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

        {/* Connected Timeline Path Behind Cards */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path
            d="M 275 610 L 805 610 L 275 1010 L 805 1010"
            fill="none"
            stroke={C.charcoal}
            strokeWidth={8}
            strokeDasharray="18 14"
            opacity={0.15}
          />
          <path
            d="M 275 610 L 805 610 L 275 1010 L 805 1010"
            fill="none"
            stroke={C.cyan}
            strokeWidth={8}
            strokeDasharray="1800"
            strokeDashoffset={1800 - lerp(frame, [30, 205], [0, 1800])}
            strokeLinecap="round"
          />
        </svg>

        {/* 4 Clean Language Cards with Breathing Room */}
        {LANGS.map((l, i) => {
          const pop = spr(frame, l.at, { damping: 11, stiffness: 190 });
          const active = stage === i && frame >= l.at;

          return (
            <div
              key={l.name}
              style={{
                position: "absolute",
                left: l.x,
                top: l.y,
                width: 430,
                transform: `translate(-50%, -50%) scale(${pop * (active ? 1.04 : 1)})`,
                background: C.white,
                border: `5px solid ${C.charcoal}`,
                borderRadius: 24,
                padding: "16px 20px",
                boxShadow: active ? `10px 10px 0 ${l.accent}` : `6px 6px 0 ${C.charcoal}`,
                opacity: frame >= l.at ? 1 : 0,
                zIndex: 10,
              }}
            >
              {/* Header row: Language name & badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 900,
                    fontSize: 46,
                    color: C.charcoal,
                    lineHeight: 1,
                  }}
                >
                  {l.name}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: l.accent,
                    color: C.charcoal,
                    fontFamily: FONT.mono,
                    fontWeight: 800,
                    fontSize: 17,
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: `2.5px solid ${C.charcoal}`,
                  }}
                >
                  {l.badgeIcon}
                  <span>{l.year} · {l.badge}</span>
                </span>
              </div>

              {/* Code snippet block */}
              <div
                style={{
                  background: "#161B22",
                  color: C.cyanLight,
                  fontFamily: FONT.mono,
                  fontWeight: 700,
                  fontSize: 19,
                  padding: "9px 12px",
                  borderRadius: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  marginBottom: 10,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
                }}
              >
                {l.code.slice(0, Math.max(0, Math.floor((frame - l.at) * 1.3)))}
              </div>

              {/* Punchline with clean SVG icon (NO emoji) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT.sans,
                  fontWeight: 700,
                  fontSize: 18,
                  color: C.charcoal,
                }}
              >
                {l.jokeIcon}
                <span>{l.joke}</span>
              </div>
            </div>
          );
        })}

        {/* Devtrine Mascot: Presenter role (No mouth, No legs, Expressive eyes + brow + wings) */}
        {frame >= 25 && (
          <DevtrineMascot
            x={mx}
            y={my}
            size={105}
            expression={stage === 2 ? "shocked" : "happy"}
            blink={autoBlink(frame, 11)}
            lookX={stage === 0 ? -0.7 : stage === 1 ? 0.7 : stage === 2 ? -0.3 : 0.5}
            lookY={stage < 2 ? 0.6 : -0.2}
            wingL={stage === 0 ? 25 : stage === 2 ? -30 : Math.sin(frame * 0.25) * 18}
            wingR={stage === 1 ? 25 : stage === 2 ? 30 : -Math.cos(frame * 0.25) * 18}
            sweat={stage === 2 ? 1 : 0}
            frame={frame}
            shadow
          />
        )}

        {/* Clean Speech Bubbles positioned with translate(-50%, -100%) */}
        <SpeechBubble
          text="Java panjang amat kodenya!"
          x={360}
          y={1250}
          at={150}
          until={192}
          tail="left"
          size={28}
          bg={C.yellow}
        />
        <SpeechBubble
          text="Python sesingkat chat gebetan!"
          x={720}
          y={1300}
          at={205}
          until={265}
          tail="right"
          size={28}
          bg={C.green}
        />
      </Camera>

      <Subtitles
        cues={[
          {
            from: 4,
            to: 95,
            text: "Untungnya teknologi terus berkembang.",
            hi: ["teknologi", "berkembang."],
          },
          {
            from: 95,
            to: 266,
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

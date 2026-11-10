import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, easeOut, keys, lerp, shake, spr, squash } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { KineticText, Pill, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash } from "../components/Transition";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Devtrine rockets in from right -> slams left edge at f=12 -> settles at x=290
  const mx =
    frame < 12
      ? lerp(frame, [0, 12], [1220, 145], easeOut)
      : 145 + spr(frame, 16, { damping: 10, stiffness: 140 }) * 155;
  const my = 1040 + Math.sin(frame * 0.15) * 10;
  const wallSquash =
    frame >= 11 && frame < 18
      ? { sx: 0.62, sy: 1.38 }
      : squash(frame, 78, 0.28);

  const pcPop = spr(frame, 28, { damping: 11, stiffness: 180 });
  const qPop = spr(frame, 58, { damping: 8, stiffness: 170 });
  const qBonk = spr(frame, 74, { damping: 9, stiffness: 200 });

  // Camera punch-in on "SIAPA ORANG PERTAMA?"
  const camScale = keys(frame, [0, 82, 92, 165, 180], [1, 1, 1.13, 1.15, 1.02]);
  const shk = shake(frame, 12, 28, 12);
  const shk2 = shake(frame, 86, 20, 10);

  const expr =
    frame < 12 ? "happy" : frame < 24 ? "dizzy" : frame < 75 ? "curious" : frame < 92 ? "shocked" : "curious";

  return (
    <Background variant="light" drift={1.4}>
      <Camera scale={camScale} x={shk.x + shk2.x} y={shk.y + shk2.y} focusX={540} focusY={620}>
        {/* Top hook badge + Kinetic Headline */}
        <div style={{ position: "absolute", top: 230, left: 90, right: 90, textAlign: "center" }}>
          <Pill text="SEJARAH PROGRAMMING · EP.01" bg={C.charcoal} color={C.cyanLight} at={4} size={24} />
          <div style={{ marginTop: 22 }}>
            <KineticText
              text="SIAPA ORANG PERTAMA"
              start={80}
              stagger={4}
              size={88}
              variant="slam"
              highlight={["PERTAMA"]}
              highlightColor={C.cyanLight}
            />
            <KineticText
              text="YANG BIKIN KOMPUTER NGODING?!"
              start={94}
              stagger={3}
              size={48}
              variant="pop"
              color={C.cyan}
              highlight={["NGODING?!"]}
              highlightColor={C.yellow}
              style={{ marginTop: 10 }}
            />
          </div>
        </div>

        {/* Modern Computer Illustration */}
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 980,
            transform: `translate(-50%, -50%) scale(${pcPop}) rotate(${Math.sin(frame * 0.1) * 2}deg)`,
          }}
        >
          <svg width={460} height={420} viewBox="-230 -210 460 420" style={{ overflow: "visible" }}>
            <ellipse cx={0} cy={175} rx={165} ry={18} fill={C.charcoal} opacity={0.14} />
            {/* Stand */}
            <path d="M-35,95 L35,95 L55,155 L-55,155 Z" fill={C.charcoal} />
            <rect x={-95} y={150} width={190} height={18} rx={9} fill={C.charcoal} />
            {/* Monitor bezel */}
            <rect x={-195} y={-155} width={390} height={260} rx={26} fill={C.charcoal} stroke={C.charcoal} strokeWidth={8} />
            <rect x={-177} y={-137} width={354} height={212} rx={14} fill="#14191F" />
            {/* Window dots */}
            <circle cx={-152} cy={-114} r={7} fill={C.red} />
            <circle cx={-130} cy={-114} r={7} fill={C.yellow} />
            <circle cx={-108} cy={-114} r={7} fill={C.green} />
            {/* Funny code lines on screen */}
            <text x={-155} y={-72} fill={C.cyanLight} fontFamily={FONT.mono} fontSize={20} fontWeight={700}>
              {"function siapaBikinGue() {"}
            </text>
            <text x={-135} y={-40} fill={C.yellow} fontFamily={FONT.mono} fontSize={20} fontWeight={700}>
              {"  return ???; // HAH?!"}
            </text>
            <text x={-155} y={-8} fill={C.cyanLight} fontFamily={FONT.mono} fontSize={20} fontWeight={700}>
              {"}"}
            </text>
            {frame > 52 && (
              <g transform={`scale(${spr(frame, 52, { damping: 10, stiffness: 220 })})`}>
                <rect x={-150} y={14} width={300} height={42} rx={8} fill={C.red} />
                <text x={0} y={42} textAnchor="middle" fill={C.white} fontFamily={FONT.mono} fontSize={21} fontWeight={800}>
                  ?! ERROR: GAK TAU ?!
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Giant Question Mark launched from monitor -> bonks Devtrine */}
        {frame >= 58 && (
          <div
            style={{
              position: "absolute",
              left: lerp(qBonk, [0, 1], [670, 315]),
              top: lerp(qBonk, [0, 1], [860, 740]) - Math.sin(qBonk * Math.PI) * 140,
              transform: `translate(-50%, -50%) scale(${qPop}) rotate(${lerp(qBonk, [0, 1], [18, -14]) + Math.sin(frame * 0.25) * 6}deg)`,
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 190,
              color: C.yellow,
              WebkitTextStroke: `10px ${C.charcoal}`,
              filter: `drop-shadow(10px 12px 0 ${C.charcoal})`,
            }}
          >
            ?
          </div>
        )}

        {/* Devtrine Mascot */}
        <DevtrineMascot
          x={mx}
          y={my}
          size={215}
          expression={expr}
          blink={autoBlink(frame, 20)}
          lookX={frame < 75 ? 0.9 : 0.2}
          lookY={frame >= 74 ? -0.8 : -0.1}
          sx={wallSquash.sx}
          sy={wallSquash.sy}
          wingL={frame >= 75 ? -38 + Math.sin(frame * 0.4) * 12 : Math.sin(frame * 0.25) * 10}
          wingR={Math.cos(frame * 0.25) * 14}
          rotate={frame < 16 ? -18 : Math.sin(frame * 0.08) * 4}
          legs
          legPhase={frame < 20 ? frame * 0.9 : 0}
          sweat={frame >= 12 && frame < 40 ? 1 : 0}
          frame={frame}
          shadow
        />

        {/* Dizzy stars when Devtrine hits the wall */}
        {frame >= 12 && frame < 44 && (
          <div style={{ position: "absolute", left: mx, top: my - 210, pointerEvents: "none" }}>
            {[0, 1, 2].map((i) => {
              const a = frame * 0.22 + (i * Math.PI * 2) / 3;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: Math.cos(a) * 95,
                    top: Math.sin(a) * 32,
                    transform: "translate(-50%, -50%)",
                    fontFamily: FONT.sans,
                    fontWeight: 900,
                    fontSize: 42,
                    color: C.yellow,
                    WebkitTextStroke: `3px ${C.charcoal}`,
                  }}
                >
                  ★
                </div>
              );
            })}
          </div>
        )}

        <SpeechBubble text="Rem blong guys!!" x={350} y={800} at={13} until={48} tail="left" size={34} bg={C.yellow} />
        <SpeechBubble text="Lah, kok nanya balik?!" x={360} y={760} at={102} until={168} tail="left" size={32} />
      </Camera>

      <Flash at={84} max={0.55} />

      <Subtitles
        cues={[
          {
            from: 4,
            to: 78,
            tag: "excited",
            text: "Guys! Pernah nggak sih kalian mikir...",
            hi: ["Guys!", "mikir..."],
          },
          {
            from: 78,
            to: 176,
            tag: "excited",
            text: "Siapa orang pertama yang bikin komputer bisa ngoding?!",
            hi: ["orang", "pertama", "ngoding?!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="whoosh" at={0} volume={0.85} />
      <Sfx name="bonk" at={11} volume={0.95} />
      <Sfx name="pop" at={28} volume={0.85} />
      <Sfx name="notification" at={52} volume={0.75} />
      <Sfx name="boing" at={58} volume={0.85} />
      <Sfx name="bonk" at={74} volume={0.75} rate={1.25} />
      <Sfx name="impact" at={84} volume={0.9} />
    </Background>
  );
};

import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { keys, shake, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { KineticText, Pill, SpeechBubble } from "../components/KineticTypography";
import { IconSkull } from "../components/Icons";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash } from "../components/Transition";

export const Scene04SkillIssue: React.FC = () => {
  const frame = useCurrentFrame();

  // 8-frame comedic beat before the punchline slams in
  const punch = frame >= 8;
  const bounce = punch ? Math.sin((frame - 8) * 0.55) : 0;
  const sx = 1 + bounce * 0.24;
  const sy = 1 - bounce * 0.24;
  const jumpY = Math.abs(Math.sin((frame - 8) * 0.28)) * -65;

  const camScale = keys(frame, [0, 8, 15, 90, 105], [1, 1, 1.18, 1.22, 1.05]);
  const shk = shake(frame, 8, 28, 14);
  const drumPop = spr(frame, 30, { damping: 9, stiffness: 200 });

  return (
    <Background variant="light" drift={2.2}>
      <Camera scale={camScale} x={shk.x} y={shk.y} focusX={540} focusY={860}>
        {/* Comic starburst behind headline */}
        {punch && (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 430,
              transform: `translate(-50%, -50%) scale(${spr(frame, 8, { damping: 10, stiffness: 180 })}) rotate(${frame * 0.4}deg)`,
            }}
          >
            <svg width={760} height={420} viewBox="-380 -210 760 420">
              <polygon
                points="-340,-40 -220,-150 -110,-95 0,-195 110,-95 240,-155 340,-35 255,60 330,145 155,130 45,195 -65,130 -240,165 -265,55"
                fill={C.yellow}
                stroke={C.charcoal}
                strokeWidth={10}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Giant SKILL ISSUE?! Kinetic Typography */}
        <div style={{ position: "absolute", top: 285, left: 80, right: 80, textAlign: "center" }}>
          <Pill
            text="DIAGNOSA TEKNIS RESMI"
            icon={<IconSkull size={20} color={C.yellow} />}
            bg={C.charcoal}
            color={C.yellow}
            at={2}
            size={24}
          />
          <div style={{ marginTop: 24 }}>
            <KineticText
              text="SKILL ISSUE?!"
              start={8}
              stagger={4}
              size={118}
              variant="slam"
              color={C.charcoal}
              highlight={["ISSUE?!"]}
              highlightColor={C.cyanLight}
            />
          </div>
        </div>

        {/* Ba-Dum-Tss Mini Drum Kit Gag */}
        <div
          style={{
            position: "absolute",
            left: 800,
            top: 1080,
            transform: `translate(-50%, -50%) scale(${drumPop}) rotate(${Math.sin(frame * 0.6) * 6}deg)`,
          }}
        >
          <svg width={260} height={240} viewBox="-130 -120 260 240">
            {/* Snare drum */}
            <rect x={-85} y={10} width={110} height={68} rx={10} fill={C.red} stroke={C.charcoal} strokeWidth={6} />
            <ellipse cx={-30} cy={10} rx={55} ry={16} fill={C.white} stroke={C.charcoal} strokeWidth={6} />
            {/* Cymbal */}
            <line x1={55} y1={85} x2={55} y2={-35} stroke={C.charcoal} strokeWidth={7} />
            <ellipse
              cx={55}
              cy={-35}
              rx={52}
              ry={14}
              fill={C.yellow}
              stroke={C.charcoal}
              strokeWidth={6}
              transform={`rotate(${Math.sin(frame * 0.9) * 12}, 55, -35)`}
            />
            <text x={0} y={-72} textAnchor="middle" fill={C.charcoal} fontFamily={FONT.mono} fontSize={24} fontWeight={900}>
              BA-DUM-TSS!
            </text>
          </svg>
        </div>

        {/* Devtrine Mascot — hysterical squash & stretch laugh with tears */}
        <DevtrineMascot
          x={450}
          y={1040 + jumpY}
          size={255}
          expression={punch ? "laughing" : "curious"}
          sx={sx}
          sy={sy}
          rotate={punch ? Math.sin((frame - 8) * 0.35) * 14 : 0}
          wingL={punch ? -42 + Math.sin(frame * 0.7) * 28 : 0}
          wingR={punch ? -42 + Math.cos(frame * 0.7) * 28 : 0}
          tears={punch ? 1 : 0}
          frame={frame}
          shadow
        />

        <SpeechBubble
          text="Bukan salah laptopnya guys!"
          x={450}
          y={740}
          at={18}
          until={100}
          tail="left"
          size={36}
        />
      </Camera>

      <Flash at={8} max={0.65} />

      <Subtitles
        cues={[
          {
            from: 6,
            to: 102,
            tag: "laughing",
            text: "Skill issue banget nggak sih?!",
            hi: ["Skill", "issue"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="pop" at={2} volume={0.85} />
      <Sfx name="impact" at={8} volume={0.9} />
      <Sfx name="boing" at={10} volume={0.9} />
      <Sfx name="cartoon_laugh_pops" at={14} volume={0.85} />
      <Sfx name="rimshot" at={30} volume={0.9} />
      <Sfx name="boing" at={48} volume={0.75} rate={1.18} />
    </Background>
  );
};

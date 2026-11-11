import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { keys, lerp, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Header, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash } from "../components/Transition";

const AI_CODE_LINES = [
  { text: "✦ // AI Assistant: Auto-generating app...", col: C.cyanLight },
  { text: "export async function bikinAplikasiKece() {", col: C.white },
  { text: "  const ui = await ai.designMotion();", col: C.yellow },
  { text: "  const bugs = 0; // Zero bug dijamin!", col: C.green },
  { text: "  return ui.deploy({ kecepatan: 'KILAT' });", col: C.cyanLight },
  { text: "}", col: C.white },
];

export const Scene08ArtificialIntelligence: React.FC = () => {
  const frame = useCurrentFrame();

  const editorPop = spr(frame, 10, { damping: 12, stiffness: 170 });
  const botPop = spr(frame, 24, { damping: 10, stiffness: 190 });
  const camScale = keys(frame, [0, 30, 120, 165], [1, 1.06, 1.1, 1.04]);

  return (
    <Background variant="dark">
      <Camera scale={camScale} focusX={540} focusY={920}>
        <Header
          kicker="ERA MODERN - ARTIFICIAL INTELLIGENCE"
          title="Coding Dibantuin AI!"
          highlight={["AI!"]}
          tone="dark"
          pills={[
            { text: "✦ AUTO-COMPLETE", bg: C.cyan, color: C.charcoal },
            { text: "10X LEBIH CEPAT", bg: C.green, color: C.charcoal },
          ]}
        />

        {/* Futuristic Glowing AI Code Editor */}
        <div
          style={{
            position: "absolute",
            left: 660,
            top: 940,
            width: 620,
            transform: `translate(-50%, -50%) scale(${editorPop})`,
            background: "rgba(20, 26, 33, 0.95)",
            border: `4px solid ${C.cyan}`,
            borderRadius: 28,
            padding: "24px 28px",
            boxShadow: `0 0 42px rgba(12, 192, 223, 0.32), 10px 10px 0 ${C.charcoal}`,
          }}
        >
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.red }} />
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.yellow }} />
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.green }} />
            </div>
            <span
              style={{
                background: C.cyan,
                color: C.charcoal,
                fontFamily: FONT.mono,
                fontWeight: 800,
                fontSize: 19,
                padding: "4px 14px",
                borderRadius: 999,
              }}
            >
              ✦ AI COPILOT ACTIVE
            </span>
          </div>

          {/* Auto-generating code lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AI_CODE_LINES.map((ln, i) => {
              const startF = 24 + i * 14;
              const p = lerp(frame, [startF, startF + 12], [0, 1]);
              if (p <= 0) return null;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 22,
                    color: ln.col,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 24}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ln.text.slice(0, Math.ceil(ln.text.length * p))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating AI Sparkle Assistant Orb */}
        <div
          style={{
            position: "absolute",
            left: 850,
            top: 645 + Math.sin(frame * 0.16) * 16,
            transform: `translate(-50%, -50%) scale(${botPop})`,
            background: C.cyan,
            color: C.charcoal,
            border: `5px solid ${C.white}`,
            padding: "10px 20px",
            fontFamily: FONT.mono,
            fontWeight: 900,
            fontSize: 25,
            boxShadow: `0 0 28px ${C.cyanLight}`,
            whiteSpace: "nowrap",
          }}
        >
          SIAP BANTU BOS!
        </div>

        {/* Devtrine amazed (starry pupil) watching code write itself */}
        <DevtrineMascot
          x={245}
          y={1075 + Math.sin(frame * 0.14) * 10}
          size={215}
          expression="amazed"
          lookX={0.85}
          lookY={-0.25}
          wingL={-34 + Math.sin(frame * 0.25) * 12}
          wingR={-34 + Math.cos(frame * 0.25) * 12}
          legs
          frame={frame}
          shadow
        />

        <SpeechBubble
          text="Gue tinggal seduh kopi doang?!"
          x={330}
          y={770}
          at={48}
          until={160}
          tail="left"
          size={33}
          bg={C.yellow}
        />
      </Camera>

      <Flash at={24} color={C.cyanLight} max={0.35} />

      <Subtitles
        cues={[
          {
            from: 4,
            to: 160,
            text: "Dan sekarang, kita bahkan bisa memanfaatkan AI untuk membantu coding!",
            hi: ["sekarang,", "AI", "membantu", "coding!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="whoosh" at={0} volume={0.8} />
      <Sfx name="activation" at={10} volume={0.85} />
      <Sfx name="ai_chime" at={24} volume={0.85} />
      <Sfx name="ai_ambience" at={0} volume={0.5} duration={165} />
      <Sfx name="typing" at={32} volume={0.55} duration={75} />
    </Background>
  );
};

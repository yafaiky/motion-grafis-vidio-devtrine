import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, keys, lerp, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { Header, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";

const SNEAKY_PROMPT = "Kerjain tugas + balesin chat gebetan...";
const REAL_PROMPT = "Buatkan fungsi Fibonacci dengan Python!";

export const Scene09GoogleAIStudio: React.FC = () => {
  const frame = useCurrentFrame();

  const uiPop = spr(frame, 8, { damping: 12, stiffness: 170 });
  const runClick = frame >= 102 && frame < 112 ? 0.88 : 1;
  const respPop = spr(frame, 108, { damping: 12, stiffness: 180 });

  // Gag: Devtrine types sneaky prompt (f=16..42), deletes it fast (f=46..60), types real prompt (f=62..96)
  let promptText = "";
  if (frame < 46) {
    promptText = SNEAKY_PROMPT.slice(0, Math.floor(lerp(frame, [16, 42], [0, SNEAKY_PROMPT.length])));
  } else if (frame < 60) {
    promptText = SNEAKY_PROMPT.slice(0, Math.floor(lerp(frame, [46, 60], [SNEAKY_PROMPT.length, 0])));
  } else {
    promptText = REAL_PROMPT.slice(0, Math.floor(lerp(frame, [62, 96], [0, REAL_PROMPT.length])));
  }

  const camScale = keys(frame, [0, 95, 112, 210], [1, 1.03, 1.08, 1.04]);

  return (
    <Background variant="dark">
      <Camera scale={camScale} focusX={540} focusY={920}>
        <Header
          kicker="AI PLAYGROUND · EKSPERIMEN CODING"
          title="Google AI Studio"
          highlight={["Google", "AI", "Studio"]}
          tone="dark"
          pills={[
            { text: "PROMPT → CODE", bg: C.cyan, color: C.charcoal },
            { text: "ILUSTRASI UI", bg: C.charcoal, color: C.cyanLight },
          ]}
        />

        {/* Illustrative Google AI Studio Prompt Playground Window */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 865,
            width: 880,
            transform: `translate(-50%, -50%) scale(${uiPop})`,
            background: "#1B2129",
            border: `4px solid ${C.cyanLight}`,
            borderRadius: 30,
            padding: "24px 28px",
            boxShadow: `0 18px 48px rgba(0,0,0,0.45)`,
          }}
        >
          {/* Window Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28, color: C.cyanLight }}>✦</span>
              <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 26, color: C.white }}>
                Google AI Studio
              </span>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 16,
                  color: "#9CA3AF",
                  border: "1px solid #374151",
                  padding: "2px 10px",
                  borderRadius: 999,
                }}
              >
                Ilustrasi Antarmuka
              </span>
            </div>

            <div
              style={{
                background: frame >= 102 ? C.green : C.cyan,
                color: C.charcoal,
                fontFamily: FONT.mono,
                fontWeight: 900,
                fontSize: 22,
                padding: "8px 22px",
                borderRadius: 999,
                transform: `scale(${runClick})`,
              }}
            >
              {frame >= 108 ? "✓ DONE" : "▶ RUN PROMPT"}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div
            style={{
              background: "#11161C",
              border: `3px solid ${frame < 60 && frame >= 16 ? C.yellow : C.cyan}`,
              borderRadius: 18,
              padding: "16px 20px",
              marginBottom: 18,
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 18, color: C.cyanLight, fontWeight: 700, marginBottom: 6 }}>
              SYSTEM PROMPT · {frame < 60 ? "MODE: CURHAT (EH SALAH!)" : "MODE: CODE GENERATOR"}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 24, color: C.white, fontWeight: 700, minHeight: 36 }}>
              {promptText}
              <span style={{ color: C.cyan }}>▍</span>
            </div>
          </div>

          {/* Streaming Model Response */}
          {frame >= 108 && (
            <div
              style={{
                background: "#131C24",
                border: `3px solid ${C.green}`,
                borderRadius: 18,
                padding: "16px 20px",
                transform: `scale(${respPop})`,
                transformOrigin: "top center",
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 18, color: C.green, fontWeight: 800, marginBottom: 8 }}>
                ✦ MODEL RESPONSE · PYTHON
              </div>
              <pre
                style={{
                  margin: 0,
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  color: C.cyanLight,
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {`def fib(n):\n  return n if n <= 1 else fib(n-1) + fib(n-2)\nprint([fib(i) for i in range(8)]) # [0,1,1,2,3,5,8,13]`.slice(
                  0,
                  Math.floor(lerp(frame, [110, 165], [0, 115])),
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Devtrine experimenting at the bottom-left */}
        <DevtrineMascot
          x={245}
          y={1210}
          size={175}
          expression={frame >= 42 && frame < 62 ? "panic" : frame >= 108 ? "happy" : "curious"}
          blink={autoBlink(frame, 5)}
          lookX={frame >= 42 && frame < 62 ? 0 : 0.55}
          lookY={-0.45}
          wingR={-35 + Math.sin(frame * 0.45) * 18}
          sweat={frame >= 42 && frame < 62 ? 1 : 0}
          legs
          frame={frame}
          shadow
        />

        <SpeechBubble
          text="Eh salah ketik prompt, hapus!!"
          x={520}
          y={1145}
          at={38}
          until={66}
          tail="left"
          size={30}
          bg={C.yellow}
        />
        <SpeechBubble
          text="1 detik langsung jadi kodenya! 🤩"
          x={550}
          y={1165}
          at={116}
          until={204}
          tail="left"
          size={32}
        />
      </Camera>

      <Subtitles
        cues={[
          {
            from: 4,
            to: 95,
            text: "Contohnya Google AI Studio...",
            hi: ["Google", "AI", "Studio..."],
          },
          {
            from: 95,
            to: 206,
            text: "Yang bisa kita gunakan buat bereksperimen dengan teknologi AI!",
            hi: ["bereksperimen", "teknologi", "AI!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="typing" at={16} volume={0.75} duration={80} />
      <Sfx name="squeak" at={44} volume={0.8} />
      <Sfx name="click" at={102} volume={0.9} />
      <Sfx name="confirm" at={108} volume={0.85} />
      <Sfx name="ai_chime" at={112} volume={0.75} />
    </Background>
  );
};

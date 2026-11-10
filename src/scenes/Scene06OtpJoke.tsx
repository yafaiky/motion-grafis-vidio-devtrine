import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { autoBlink, easeOut, keys, lerp, shake, spr } from "../lib/anim";
import { Background } from "../components/Background";
import { Camera } from "../components/Camera";
import { DevtrineMascot } from "../components/DevtrineMascot";
import { KineticText, Pill, SpeechBubble } from "../components/KineticTypography";
import { Sfx } from "../components/SoundEffect";
import { Subtitles } from "../components/Subtitles";
import { Flash } from "../components/Transition";

const OTP_DIGITS = ["0", "1", "0", "1", "1", "0"];

export const Scene06OtpJoke: React.FC = () => {
  const frame = useCurrentFrame();

  const phonePop = spr(frame, 12, { damping: 11, stiffness: 180 });
  const stampSlam = lerp(frame, [54, 60], [2.8, 1], easeOut);
  const stampShow = frame >= 54;
  const shk = shake(frame, 56, 30, 14);
  const camScale = keys(frame, [0, 52, 60, 135], [1, 1.04, 1.15, 1.16]);

  return (
    <Background variant="light" drift={1.5}>
      <Camera scale={camScale} x={shk.x} y={shk.y} focusX={540} focusY={900}>
        {/* Giant 0 & 1 Headline */}
        <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center" }}>
          <Pill text="KLARIFIKASI PENTING 📱" bg={C.charcoal} color={C.cyanLight} at={2} size={24} />
          <div style={{ marginTop: 18 }}>
            <KineticText
              text="IYA, 0 DAN 1 DOANG!"
              start={4}
              stagger={3}
              size={84}
              variant="pop"
              highlight={["0", "1"]}
              highlightColor={C.cyanLight}
            />
          </div>
          {frame >= 52 && (
            <div style={{ marginTop: 12 }}>
              <KineticText
                text="BUKAN KODE OTP, GUYS!"
                start={52}
                stagger={3}
                size={76}
                variant="slam"
                color={C.red}
                highlight={["BUKAN", "OTP,"]}
                highlightColor={C.yellow}
              />
            </div>
          )}
        </div>

        {/* Smartphone OTP Mockup */}
        <div
          style={{
            position: "absolute",
            left: 695,
            top: 985,
            transform: `translate(-50%, -50%) scale(${phonePop}) rotate(${frame >= 54 ? -4 : 3}deg)`,
          }}
        >
          <svg width={400} height={580} viewBox="-200 -290 400 580" style={{ overflow: "visible" }}>
            <rect x={-165} y={-265} width={330} height={530} rx={44} fill={C.charcoal} stroke={C.charcoal} strokeWidth={10} />
            <rect x={-148} y={-242} width={296} height={484} rx={32} fill={C.white} />
            {/* Notch */}
            <rect x={-55} y={-236} width={110} height={22} rx={11} fill={C.charcoal} />

            {/* SMS Notification Card */}
            <rect x={-130} y={-188} width={260} height={95} rx={18} fill={C.cyanPale} stroke={C.charcoal} strokeWidth={4} />
            <text x={-110} y={-152} fill={C.charcoal} fontFamily={FONT.sans} fontSize={20} fontWeight={800}>
              📩 SMS · KOMPUTER 1945
            </text>
            <text x={-110} y={-122} fill={C.charcoal} fontFamily={FONT.sans} fontSize={18} fontWeight={600}>
              Jangan kasih ke siapa-siapa!
            </text>

            <text x={0} y={-50} textAnchor="middle" fill={C.charcoal} fontFamily={FONT.mono} fontSize={22} fontWeight={800}>
              MASUKKAN 6 DIGIT BINER:
            </text>

            {/* 6 OTP Boxes with giant 0 & 1 */}
            {OTP_DIGITS.map((d, i) => {
              const bx = -125 + i * 50;
              const pop = spr(frame, 18 + i * 4, { damping: 10, stiffness: 220 });
              return (
                <g key={i} transform={`translate(${bx}, 8) scale(${pop})`}>
                  <rect x={-21} y={-32} width={42} height={64} rx={10} fill={C.yellow} stroke={C.charcoal} strokeWidth={4} />
                  <text x={0} y={12} textAnchor="middle" fill={C.charcoal} fontFamily={FONT.mono} fontSize={36} fontWeight={900}>
                    {d}
                  </text>
                </g>
              );
            })}

            {/* Funny Verify Button */}
            <rect x={-120} y={76} width={240} height={58} rx={16} fill={C.cyan} stroke={C.charcoal} strokeWidth={4} />
            <text x={0} y={113} textAnchor="middle" fill={C.charcoal} fontFamily={FONT.sans} fontSize={24} fontWeight={900}>
              VERIFIKASI LOGIN
            </text>
          </svg>

          {/* Giant Red Rubber Stamp "BUKAN KODE OTP!" */}
          {stampShow && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                transform: `translate(-50%, -50%) rotate(-16deg) scale(${stampSlam})`,
                border: `10px solid ${C.red}`,
                borderRadius: 20,
                padding: "14px 28px",
                background: "rgba(255,255,255,0.94)",
                color: C.red,
                fontFamily: FONT.mono,
                fontWeight: 900,
                fontSize: 44,
                whiteSpace: "nowrap",
                boxShadow: `8px 8px 0 ${C.charcoal}`,
              }}
            >
              ❌ BUKAN OTP!
            </div>
          )}
        </div>

        {/* Devtrine confused looking at the OTP phone */}
        <DevtrineMascot
          x={280}
          y={1060}
          size={220}
          expression={frame < 54 ? "confused" : "shocked"}
          blink={autoBlink(frame, 14)}
          lookX={0.85}
          lookY={-0.1}
          wingL={-32 + Math.sin(frame * 0.25) * 8}
          wingR={28}
          rotate={frame < 54 ? -8 : 6}
          sweat={frame >= 54 ? 1 : 0}
          legs
          frame={frame}
          shadow
        />

        {/* Floating question marks around Devtrine's head */}
        {[-1, 1].map((side, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 280 + side * 145,
              top: 820 + Math.sin(frame * 0.2 + i) * 14,
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 64,
              color: C.yellow,
              WebkitTextStroke: `4px ${C.charcoal}`,
              transform: `rotate(${side * 18}deg) scale(${spr(frame, 16 + i * 6)})`,
            }}
          >
            ?
          </div>
        ))}

        <SpeechBubble
          text="Hampir gue masukin ShopeePay!"
          x={380}
          y={750}
          at={58}
          until={132}
          tail="left"
          size={30}
          bg={C.yellow}
        />
      </Camera>

      <Flash at={55} color={C.red} max={0.35} />

      <Subtitles
        cues={[
          {
            from: 4,
            to: 52,
            tag: "confused",
            text: "Iya, 0 dan 1 doang!",
            hi: ["0", "1", "doang!"],
          },
          {
            from: 52,
            to: 132,
            tag: "confused",
            text: "Bukan kode OTP, guys!",
            hi: ["Bukan", "kode", "OTP,"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="pop" at={4} volume={0.85} />
      <Sfx name="notification" at={14} volume={0.85} />
      <Sfx name="click" at={24} volume={0.8} />
      <Sfx name="click" at={32} volume={0.8} />
      <Sfx name="record_scratch" at={50} volume={0.9} />
      <Sfx name="stamp" at={55} volume={0.95} />
    </Background>
  );
};

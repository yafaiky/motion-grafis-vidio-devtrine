import React from "react"
import { Img, staticFile, useCurrentFrame } from "remotion"
import { C, FONT } from "../theme"
import { keys, lerp, rand, shake, spr } from "../lib/anim"
import { Background } from "../components/Background"
import { Camera } from "../components/Camera"
import { DevtrineMascot } from "../components/DevtrineMascot"
import {
  Header,
  KineticText,
  Pill,
  SpeechBubble,
} from "../components/KineticTypography"
import {
  IconArrowRight,
  IconCheck,
  IconHandshake,
  IconLaptop,
  IconMegaphone,
  IconMonitor,
  IconSparkles,
  IconTie,
  IconUser,
  IconUserPlus,
} from "../components/Icons"
import { Sfx } from "../components/SoundEffect"
import { Subtitles } from "../components/Subtitles"
import { Flash } from "../components/Transition"

const PANELS = [
  {
    era: "1. DULU (1940s)",
    title: "Manusia Ngajarin Komputer",
    desc: '"Nih gue colok kabel biar lu ngerti 1+1!"',
    accent: C.cyanLight,
    at: 8,
    icons: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconUser size={34} color={C.charcoal} />
        <IconArrowRight size={22} color={C.cyan} />
        <IconMonitor size={34} color={C.charcoal} />
      </div>
    ),
  },
  {
    era: "2. SEKARANG (2026)",
    title: "Komputer Bantuin Manusia",
    desc: '"Tenang bos, kodenya udah gue benerin ✦"',
    accent: C.green,
    at: 64,
    icons: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconLaptop size={34} color={C.charcoal} />
        <IconHandshake size={34} color={C.green} />
        <IconSparkles size={30} color={C.yellow} />
      </div>
    ),
  },
  {
    era: "3. MASA DEPAN",
    title: "Komputer Jadi BOS Kita!",
    desc: '"MANUSIA! KERJAIN PR GUE SEKARANG!!"',
    accent: C.red,
    at: 125,
    icons: (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconMonitor size={34} color={C.red} />
        <IconTie size={32} color={C.red} />
        <IconMegaphone size={32} color={C.red} />
      </div>
    ),
  },
]

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  ang: (i / 24) * Math.PI * 2,
  dist: 180 + rand(i * 5) * 320,
  col: i % 3 === 0 ? C.cyan : i % 2 === 0 ? C.yellow : C.red,
  rot: rand(i * 9) * 360,
}))

export const Scene10Closing: React.FC = () => {
  const frame = useCurrentFrame()
  const isOutro = frame >= 275

  // Boss PC slam at f=128
  const bossSlam = spr(frame, 125, { damping: 9, stiffness: 210 })
  const shk = shake(frame, 128, 28, 14)
  const shkOutro = shake(frame, 280, 22, 12)

  // Devtrine hovers / glides across screen in panic (f=150..265)
  const runX =
    frame < 150
      ? 260
      : frame < 215
        ? lerp(frame, [150, 215], [260, 880])
        : lerp(frame, [215, 270], [880, 220])

  // Outro Logo Reveal & Signature Wink
  const logoPop = spr(frame, 282, { damping: 10, stiffness: 170 })
  const wink =
    frame >= 345 && frame < 357 ? Math.sin(((frame - 345) / 12) * Math.PI) : 0
  const ctaPop = spr(frame, 305, { damping: 10, stiffness: 190 })
  const btnPress = frame >= 332 && frame < 342 ? 0.9 : 1

  const camScale = keys(
    frame,
    [0, 125, 135, 275, 290, 450],
    [1, 1.02, 1.08, 1, 1.04, 1.06],
  )

  return (
    <Background variant="light" drift={isOutro ? 0.8 : 2.0}>
      <Camera
        scale={camScale}
        x={shk.x + shkOutro.x}
        y={shk.y + shkOutro.y}
        focusX={540}
        focusY={920}
      >
        {/* PART A (f=0..275): 3-PANEL COMEDY EVOLUTION + BOSS COMPUTER + PANIC GLIDE */}
        {!isOutro && (
          <>
            <Header
              kicker="PLOT TWIST MASA DEPAN"
              title="Jangan Sampai Kebalik!"
              highlight={["Kebalik!"]}
            />

            {/* 3 stacked evolution cards with generous vertical spacing */}
            {PANELS.map((p, i) => {
              const s = spr(frame, p.at, { damping: 11, stiffness: 190 })
              const isBoss = i === 2
              return (
                <div
                  key={p.era}
                  style={{
                    position: "absolute",
                    left: 540,
                    top: 550 + i * 160,
                    width: 880,
                    transform: `translate(-50%, -50%) scale(${s})`,
                    background: isBoss ? "#FFF0F2" : C.white,
                    border: `5px solid ${C.charcoal}`,
                    borderRadius: 24,
                    padding: "14px 24px",
                    boxShadow: `8px 8px 0 ${p.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: frame >= p.at ? 1 : 0,
                    zIndex: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        background: p.accent,
                        color: isBoss ? C.white : C.charcoal,
                        fontFamily: FONT.mono,
                        fontWeight: 900,
                        fontSize: 18,
                        padding: "3px 12px",
                        borderRadius: 999,
                        marginBottom: 6,
                      }}
                    >
                      {p.era}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT.sans,
                        fontWeight: 900,
                        fontSize: 30,
                        color: C.charcoal,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT.mono,
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#4B5563",
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.04)",
                      padding: "10px 18px",
                      borderRadius: 18,
                      border: `2px solid ${C.charcoal}22`,
                    }}
                  >
                    {p.icons}
                  </div>
                </div>
              )
            })}

            {/* Speech bubble comfortably positioned with ample clearance below card 3 */}
            <SpeechBubble
              text="KABURRR! KOMPUTERNYA PAKE DASI!!"
              x={380}
              y={1045}
              at={134}
              until={265}
              tail="left"
              size={30}
              bg={C.yellow}
            />

            {/* Giant Boss Computer wearing a Red Necktie barking orders */}
            {frame >= 125 && (
              <div
                style={{
                  position: "absolute",
                  left: 740,
                  top: 1260,
                  transform: `translate(-50%, -50%) scale(${bossSlam}) rotate(${Math.sin(frame * 0.5) * 4}deg)`,
                  zIndex: 20,
                }}
              >
                <svg
                  width={320}
                  height={300}
                  viewBox="-160 -150 320 300"
                  style={{ overflow: "visible" }}
                >
                  <rect
                    x={-125}
                    y={-110}
                    width={250}
                    height={175}
                    rx={22}
                    fill={C.charcoal}
                  />
                  <rect
                    x={-108}
                    y={-94}
                    width={216}
                    height={142}
                    rx={12}
                    fill="#1E1418"
                  />
                  {/* Angry boss eyebrows & eyes */}
                  <line
                    x1={-68}
                    y1={-52}
                    x2={-20}
                    y2={-32}
                    stroke={C.red}
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <line
                    x1={68}
                    y1={-52}
                    x2={20}
                    y2={-32}
                    stroke={C.red}
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <circle cx={-44} cy={-20} r={12} fill={C.yellow} />
                  <circle cx={44} cy={-20} r={12} fill={C.yellow} />
                  {/* Shouting mouth */}
                  <rect
                    x={-48}
                    y={8}
                    width={96}
                    height={28}
                    rx={10}
                    fill={C.red}
                  />
                  {/* Boss Red Necktie */}
                  <polygon
                    points="-18,65 18,65 26,135 0,162 -26,135"
                    fill={C.red}
                    stroke={C.charcoal}
                    strokeWidth={5}
                  />
                </svg>
              </div>
            )}

            {/* Devtrine panicking & floating in fear (No mouth, No legs) */}
            <DevtrineMascot
              x={runX}
              y={1260 + Math.sin(frame * 0.4) * 8}
              size={165}
              expression={frame < 125 ? "happy" : "panic"}
              lookX={frame < 215 ? -0.8 : 0.8}
              lookY={-0.2}
              wingL={frame >= 125 ? -48 + Math.sin(frame * 0.9) * 22 : 0}
              wingR={frame >= 125 ? 48 + Math.cos(frame * 0.9) * 22 : 0}
              sweat={frame >= 125 ? 1 : 0}
              frame={frame}
              shadow
            />
          </>
        )}

        {/* PART B (f=275..450): DEVTRINE OUTRO & SIGNATURE WINK */}
        {isOutro && (
          <>
            {/* Confetti burst celebration */}
            {CONFETTI.map((c, i) => {
              const cp = spr(frame, 332, { damping: 14, stiffness: 180 })
              const dist = c.dist * cp
              const x = 540 + Math.cos(c.ang) * dist
              const y =
                680 +
                Math.sin(c.ang) * dist +
                (frame > 336 ? (frame - 336) * 4 : 0)
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 14,
                    height: 14,
                    background: c.col,
                    border: `2px solid ${C.charcoal}`,
                    borderRadius: i % 2 === 0 ? "50%" : 3,
                    transform: `translate(-50%, -50%) rotate(${c.rot + frame * 4}deg) scale(${frame >= 332 ? 1 : 0})`,
                    opacity: frame >= 332 ? 1 : 0,
                  }}
                />
              )
            })}

            {/* Top Outro Header */}
            <div
              style={{
                position: "absolute",
                top: 220,
                left: 80,
                right: 80,
                textAlign: "center",
              }}
            >
              <Pill
                text="TERIMA KASIH SUDAH NONTON!"
                bg={C.charcoal}
                color={C.white}
                // icon={<IconSparkle size={20} color={C.yellow} />}
                at={278}
                size={26}
              />
              <div style={{ marginTop: 18 }}>
                <KineticText
                  text="SEBELUM AI JADI BOS KITA..."
                  start={282}
                  stagger={3}
                  size={68}
                  variant="pop"
                  highlight={["BOS", "KITA..."]}
                  highlightColor={C.yellow}
                />
              </div>
            </div>

            {/* Glowing cyan halo behind mascot */}
            <div
              style={{
                position: "absolute",
                left: 540,
                top: 700,
                transform: `translate(-50%, -50%) scale(${logoPop})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 440,
                  height: 440,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${C.cyanLight}66 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Devtrine Mascot in center (No mouth, No legs, Winking eye + arched brow + waving wings) */}
            <DevtrineMascot
              x={540}
              y={690 + Math.sin(frame * 0.14) * 8}
              size={240 * logoPop}
              expression="happy"
              blink={wink}
              lookX={0}
              lookY={0}
              wingL={Math.sin(frame * 0.2) * 16}
              wingR={-28 + Math.cos(frame * 0.3) * 16}
              frame={frame}
              shadow
            />

            {/* Official Original Logo Badge + Wordmark Card */}
            <div
              style={{
                position: "absolute",
                left: 540,
                top: 990,
                transform: `translate(-50%, -50%) scale(${ctaPop})`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: C.white,
                border: `5px solid ${C.charcoal}`,
                borderRadius: 26,
                padding: "14px 30px",
                boxShadow: `8px 8px 0 ${C.charcoal}`,
              }}
            >
              <Img
                src={staticFile("images/devtrine-logo.png")}
                style={{ width: 84, height: 84, objectFit: "contain" }}
              />
              <div>
                <div
                  style={{
                    fontFamily: FONT.sans,
                    fontWeight: 900,
                    fontSize: 44,
                    color: C.charcoal,
                    lineHeight: 1.05,
                  }}
                >
                  DEVTRINE STUDIO
                </div>
                <div
                  style={{
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    fontSize: 20,
                    color: C.cyan,
                    letterSpacing: "0.08em",
                  }}
                >
                  {/* CREATIVE TECH & MOTION GRAPHICS */}
                </div>
              </div>
            </div>

            {/* CTA Button: FOLLOW DEVTRINE STUDIO with clean vector icon */}
            <div
              style={{
                position: "absolute",
                left: 540,
                top: 1200,
                transform: `translate(-50%, -50%) scale(${ctaPop * btnPress})`,
                background: frame >= 332 ? C.green : C.cyan,
                color: C.charcoal,
                border: `5px solid ${C.charcoal}`,
                borderRadius: 999,
                padding: "18px 44px",
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 38,
                whiteSpace: "nowrap",
                boxShadow: `8px 8px 0 ${C.charcoal}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {frame >= 332 ? (
                <>
                  <IconCheck size={36} color={C.charcoal} />
                  <span>FOLLOWED DEVTRINE STUDIO!</span>
                </>
              ) : (
                <>
                  <IconUserPlus size={36} color={C.charcoal} />
                  <span>FOLLOW DEVTRINE STUDIO</span>
                </>
              )}
            </div>
          </>
        )}
      </Camera>

      <Flash at={125} color={C.red} max={0.35} />
      <Flash at={275} color={C.cyanLight} max={0.65} />

      <Subtitles
        cues={[
          {
            from: 6,
            to: 118,
            text: "Dulu manusia ngajarin komputer, sekarang komputer bantuin manusia.",
            hi: ["Dulu", "manusia", "sekarang", "komputer"],
          },
          {
            from: 118,
            to: 272,
            text: "Besok-besok jangan sampai kita yang disuruh komputer ngerjain tugas!",
            hi: ["jangan", "sampai", "ngerjain", "tugas!"],
          },
          {
            from: 276,
            to: 444,
            text: "Follow dulu, sebelum AI jadi bos kita!",
            hi: ["Follow", "dulu,", "AI", "bos", "kita!"],
          },
        ]}
      />

      {/* Audio cues */}
      <Sfx name="pop" at={8} volume={0.8} />
      <Sfx name="pop" at={64} volume={0.8} />
      <Sfx name="impact" at={125} volume={0.95} />
      <Sfx name="running" at={148} volume={0.85} />
      <Sfx name="running" at={205} volume={0.85} />
      <Sfx name="whoosh" at={272} volume={0.9} />
      <Sfx name="shimmer" at={282} volume={0.85} />
      <Sfx name="click" at={332} volume={0.95} />
      <Sfx name="confetti" at={334} volume={0.85} />
      <Sfx name="boing" at={346} volume={0.75} rate={1.3} />
      <Sfx name="cinematic_hit" at={395} volume={0.9} />
    </Background>
  )
}

import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import timelineData from "./timeline-data.json";
import { C } from "./theme";
import { lerp } from "./lib/anim";
import { BLINK_DURATION, BlinkWipe } from "./components/Transition";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02PlotTwist } from "./scenes/Scene02PlotTwist";
import { Scene03AdaLovelace } from "./scenes/Scene03AdaLovelace";
import { Scene04SkillIssue } from "./scenes/Scene04SkillIssue";
import { Scene05MachineLanguage } from "./scenes/Scene05MachineLanguage";
import { Scene06OtpJoke } from "./scenes/Scene06OtpJoke";
import { Scene07ProgrammingEvolution } from "./scenes/Scene07ProgrammingEvolution";
import { Scene08ArtificialIntelligence } from "./scenes/Scene08ArtificialIntelligence";
import { Scene09GoogleAIStudio } from "./scenes/Scene09GoogleAIStudio";
import { Scene10Closing } from "./scenes/Scene10Closing";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: Scene01Hook,
  plotTwist: Scene02PlotTwist,
  ada: Scene03AdaLovelace,
  skillIssue: Scene04SkillIssue,
  machine: Scene05MachineLanguage,
  otp: Scene06OtpJoke,
  evolution: Scene07ProgrammingEvolution,
  ai: Scene08ArtificialIntelligence,
  aiStudio: Scene09GoogleAIStudio,
  closing: Scene10Closing,
};

let cursor = 0;
export const TIMELINE = timelineData.scenes.map((s) => {
  const from = cursor;
  cursor += s.duration;
  return { ...s, from };
});
export const TOTAL_FRAMES = cursor; // 2250 frames = 75.0s @ 30fps

export const MainComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      {/* Background Music with automatic fade-in/out & ducking */}
      <Audio
        src={staticFile("audio/bgm/bgm.wav")}
        volume={(f) => {
          const fadeIn = lerp(f, [0, 20], [0, 1]);
          const fadeOut = lerp(f, [TOTAL_FRAMES - 35, TOTAL_FRAMES], [1, 0]);
          return 0.34 * fadeIn * fadeOut;
        }}
      />

      {/* 10 Modular Scenes */}
      {TIMELINE.map((sc) => {
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.duration} name={sc.title}>
            <Comp />
          </Sequence>
        );
      })}

      {/* Signature Devtrine BlinkWipe Transitions at scene boundaries */}
      {TIMELINE.slice(1).map((sc) => (
        <Sequence
          key={`wipe-${sc.id}`}
          from={sc.from - BLINK_DURATION / 2}
          durationInFrames={BLINK_DURATION}
          name={`Transition → ${sc.id}`}
        >
          <BlinkWipe />
        </Sequence>
      ))}

      {/* Persistent Devtrine Studio Brand Pill (Top-Right Safe Area) */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center", 
          background: "rgba(255, 255, 255, 0.9)",
          border: `3px solid ${C.charcoal}`,
          borderRadius: "50%",    
          width: 80,               
          height: 80,              
          padding: 0,              
          boxShadow: `4px 4px 0 ${C.charcoal}`,
          zIndex: 60,
        }}
      >
        <Img src={staticFile("images/devtrine-logo-removebg.png")} style={{ width: 60, objectFit: "contain" }} />
      </div>

      {/* Subtle Timeline Progress Bar above bottom UI zone */}
      {/* <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 350,
          height: 10,
          background: "rgba(39, 39, 39, 0.2)",
          borderRadius: 999,
          overflow: "hidden",
          zIndex: 55,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: C.cyan,
            borderRadius: 999,
          }}
        />
      </div> */}
    </AbsoluteFill>
  );
};

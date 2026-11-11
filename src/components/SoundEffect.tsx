import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { AUDIO } from "../theme";

export type SfxName =
  | "whoosh"
  | "whoosh_small"
  | "whoosh_reverse"
  | "pop"
  | "boing"
  | "bonk"
  | "impact"
  | "cinematic_hit"
  | "glitch"
  | "notification"
  | "click"
  | "typing"
  | "ticking"
  | "paper"
  | "retro_beep"
  | "data"
  | "machine_hum"
  | "loading"
  | "puff"
  | "rimshot"
  | "record_scratch"
  | "stamp"
  | "digital_sweep"
  | "ai_chime"
  | "activation"
  | "confirm"
  | "running"
  | "shimmer"
  | "tape_rewind"
  | "tape_stop"
  | "squeak"
  | "confetti"
  | "ai_ambience"
  | "cartoon_laugh_pops";

/** One-shot sound effect placed at a frame (relative to the parent Sequence). */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; rate?: number; duration?: number }> = ({
  name,
  at,
  volume = 0.8,
  rate = 1,
  duration,
}) => (
  <Sequence from={at} durationInFrames={duration} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume * AUDIO.sfx} playbackRate={rate} />
  </Sequence>
);

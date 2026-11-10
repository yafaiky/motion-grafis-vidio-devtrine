import React from "react";
import { Composition } from "remotion";
import { H, W } from "./theme";
import { MainComposition, TOTAL_FRAMES } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DevtrineHistory"
      component={MainComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={W}
      height={H}
    />
  );
};

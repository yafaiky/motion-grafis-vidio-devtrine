import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Virtual camera: scale / pan / rotate the whole stage.
 * `focusX/focusY` = canvas point that stays fixed while zooming (punch-in target).
 */
export const Camera: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  focusX?: number;
  focusY?: number;
  blur?: number;
  children: React.ReactNode;
}> = ({ scale = 1, x = 0, y = 0, rotate = 0, focusX = 540, focusY = 960, blur = 0, children }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
      transformOrigin: `${focusX}px ${focusY}px`,
      filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
    }}
  >
    {children}
  </AbsoluteFill>
);

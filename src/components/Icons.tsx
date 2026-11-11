import React from "react";
import { C } from "../theme";

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

/** Modern 4-point star sparkle */
export const IconSparkle: React.FC<IconProps> = ({ size = 24, color = C.cyan, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
  </svg>
);

/** Twin sparkles */
export const IconSparkles: React.FC<IconProps> = ({ size = 24, color = C.yellow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M10 2L12 7.5L17.5 9.5L12 11.5L10 17L8 11.5L2.5 9.5L8 7.5L10 2Z" />
    <path d="M18 14L19 17L22 18L19 19L18 22L17 19L14 18L17 17L18 14Z" opacity={0.8} />
  </svg>
);

/** Flame / Explosion icon */
export const IconFlame: React.FC<IconProps> = ({ size = 24, color = C.red, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path
      d="M12 2c1 3.5 4 5 4 9a6 6 0 1 1-12 0c0-3 2.5-6.5 4-8 1 2 2 3 4-1z"
      fill={color}
      fillOpacity={0.2}
    />
  </svg>
);

/** Lightning bolt / Zap icon */
export const IconZap: React.FC<IconProps> = ({ size = 24, color = C.yellow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

/** Rocket / Power boost icon */
export const IconRocket: React.FC<IconProps> = ({ size = 24, color = C.cyan, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2.5 5-2.5" />
    <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2.5-5 2.5-5" />
  </svg>
);

/** Coffee cup icon */
export const IconCoffee: React.FC<IconProps> = ({ size = 24, color = C.yellow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

/** Scroll / Document icon */
export const IconScroll: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10a2 2 0 0 0-2 2v2z" />
    <path d="M4 17V5a2 2 0 0 1 2-2h10" />
    <path d="M4 17a2 2 0 0 0 2 2h2" />
    <line x1="8" y1="7" x2="14" y2="7" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

/** Code brackets < / > icon */
export const IconCode: React.FC<IconProps> = ({ size = 24, color = C.green, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

/** User / Teacher silhouette icon */
export const IconUser: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" fill={color} fillOpacity={0.2} />
  </svg>
);

/** Clean modern Arrow Right */
export const IconArrowRight: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

/** Vintage CRT Monitor icon */
export const IconMonitor: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

/** Modern Laptop icon */
export const IconLaptop: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M3 6h18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M1 18h22" strokeWidth={3} />
  </svg>
);

/** Handshake / Partnership icon */
export const IconHandshake: React.FC<IconProps> = ({ size = 24, color = C.green, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a2 2 0 0 0 0-2.8l-3-3a2 2 0 0 0-2.8 0L11 11" />
    <path d="m13 7-2-2a2 2 0 0 0-2.8 0L3.6 9.6a2 2 0 0 0 0 2.8l3 3a2 2 0 0 0 2.8 0L13 12" />
  </svg>
);

/** Tie icon (business boss) */
export const IconTie: React.FC<IconProps> = ({ size = 24, color = C.red, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={C.charcoal}
    strokeWidth={1.5}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <polygon points="10 2 14 2 13 6 11 6 10 2" />
    <polygon points="11 6 13 6 15 17 12 22 9 17 11 6" />
  </svg>
);

/** Megaphone / Announcement icon */
export const IconMegaphone: React.FC<IconProps> = ({ size = 24, color = C.red, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="m3 11 18-5v12L3 14v-3z" fill={color} fillOpacity={0.15} />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

/** Skull icon */
export const IconSkull: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M9 18h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2z" />
    <path d="M4 11a8 8 0 1 1 16 0c0 3-1.5 5.5-3 6.5H7C5.5 16.5 4 14 4 11z" />
    <circle cx="9" cy="11" r="1.5" fill={color} />
    <circle cx="15" cy="11" r="1.5" fill={color} />
  </svg>
);

/** Drum icon */
export const IconDrum: React.FC<IconProps> = ({ size = 24, color = C.yellow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <ellipse cx="12" cy="7" rx="9" ry="3.5" />
    <path d="M3 7v10c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V7" />
    <path d="m5 7 7 13.5" />
    <path d="m19 7-7 13.5" />
  </svg>
);

/** Smartphone icon */
export const IconSmartphone: React.FC<IconProps> = ({ size = 24, color = C.cyan, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={3} />
  </svg>
);

/** Mail envelope icon */
export const IconMail: React.FC<IconProps> = ({ size = 24, color = C.cyan, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

/** X-Circle icon */
export const IconXCircle: React.FC<IconProps> = ({ size = 24, color = C.red, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

/** Checkmark icon */
export const IconCheck: React.FC<IconProps> = ({ size = 24, color = C.green, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** User Plus icon (Follow CTA) */
export const IconUserPlus: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

/** Plus icon */
export const IconPlus: React.FC<IconProps> = ({ size = 24, color = C.charcoal, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={3}
    strokeLinecap="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/** Star 5-point icon */
export const IconStar: React.FC<IconProps> = ({ size = 24, color = C.yellow, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

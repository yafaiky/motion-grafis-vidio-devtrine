import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";

const poppins = loadPoppins("normal", { weights: ["500", "600", "700", "800", "900"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });
const lora = loadLora("normal", { weights: ["600", "700"], subsets: ["latin"] });
loadLora("italic", { weights: ["600", "700"], subsets: ["latin"] });

export const FONT = {
  sans: poppins.fontFamily,
  mono: mono.fontFamily,
  serif: lora.fontFamily,
};

/** Devtrine Studio palette — sampled from the original logo. */
export const C = {
  cyan: "#0CC0DF", // logo triangle
  cyanLight: "#5EE1E6", // logo ring
  cyanPale: "#D9F7F9",
  charcoal: "#272727", // logo pupil
  ink: "#1C1E21",
  white: "#FFFFFF",
  paper: "#F7FAFA",
  // accents (used sparingly)
  yellow: "#FFC93C",
  red: "#FF4D5E",
  green: "#3DDC97",
  // historical scene
  sepia: "#F1E6D0",
  sepiaDark: "#5B4632",
  sepiaInk: "#3B2C1E",
  sepiaRed: "#A8442E",
  skin: "#F2C9A5",
};

export const W = 1080;
export const H = 1920;

/** Safe area for TikTok / Reels / Shorts UI overlays. */
export const SAFE = { top: 220, bottom: 1540, left: 90, right: 990 };

/** Master Audio Volume Settings (atur volume global di sini) */
export const AUDIO = {
  sfx: 0.3, // Master volume SFX (misal 0.3 - 0.5 agar tidak menimpa suara bicara)
  bgm: 0.18, // Master volume BGM / musik latar
  vo: 1, // Master volume Voice-Over
};

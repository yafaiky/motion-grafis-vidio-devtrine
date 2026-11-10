import { Config } from "@remotion/cli/config";

// Render configuration — 1080x1920, 30fps (set in Root.tsx), MP4 H.264 + AAC stereo.
Config.setEntryPoint("src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
Config.setAudioCodec("aac");
Config.setAudioBitrate("192k");
Config.setOverwriteOutput(true);

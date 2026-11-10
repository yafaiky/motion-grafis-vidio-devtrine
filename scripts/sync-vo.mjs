// Automatic Voice-Over Synchronizer & Mixer for Devtrine Studio (75.0s)
// Supports two workflows after downloading speech from Google AI Studio:
//   1. Single file (`public/audio/vo/full.wav` or `.mp3`): splits on pauses between the 10 scenes
//      and snaps each segment to its exact scene timestamp in the 75.0s video.
//   2. Per-scene files (`public/audio/vo/scene01.wav` .. `scene10.wav`): snaps each file to its scene timestamp.
// Then merges the synced VO into `out/devtrine-history-of-programming.mp4` without re-rendering video frames.

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VO_DIR = path.join(ROOT, "public/audio/vo");
const OUT_MP4 = path.join(ROOT, "out/devtrine-history-of-programming.mp4");
const SYNCED_VO = path.join(VO_DIR, "vo-synced.wav");
fs.mkdirSync(VO_DIR, { recursive: true });

// Exact speech windows (seconds) matching the visual cues & subtitles in Scene01..Scene10 (Total = 75.0s)
const WINDOWS = [
  { id: "scene01", start: 0.7, maxDur: 5.1 },   // 00:00.0 - 00:06.0 (180f)
  { id: "scene02", start: 6.8, maxDur: 5.0 },   // 00:06.0 - 00:12.0 (180f)
  { id: "scene03", start: 12.2, maxDur: 10.5 }, // 00:12.0 - 00:23.0 (330f)
  { id: "scene04", start: 23.3, maxDur: 3.0 },  // 00:23.0 - 00:26.5 (105f)
  { id: "scene05", start: 26.7, maxDur: 6.9 },  // 00:26.5 - 00:34.0 (225f)
  { id: "scene06", start: 34.2, maxDur: 4.0 },  // 00:34.0 - 00:38.5 (135f)
  { id: "scene07", start: 38.7, maxDur: 8.5 },  // 00:38.5 - 00:47.5 (270f)
  { id: "scene08", start: 47.7, maxDur: 5.0 },  // 00:47.5 - 00:53.0 (165f)
  { id: "scene09", start: 53.2, maxDur: 6.5 },  // 00:53.0 - 01:00.0 (210f)
  { id: "scene10", start: 60.2, maxDur: 13.8 }, // 01:00.0 - 01:15.0 (450f)
];

const findFile = (base) => {
  for (const ext of [".wav", ".mp3", ".m4a", ".ogg"]) {
    const p = path.join(VO_DIR, base + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

const probeDur = (file) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], {
      encoding: "utf8",
    }).trim(),
  );

// If `full.wav` is present and individual scene files are missing, auto-split `full.wav` at the 9 longest silences
const fullFile = findFile("full");
let sceneFiles = WINDOWS.map((w) => findFile(w.id));

if (fullFile && sceneFiles.every((f) => !f)) {
  const totalDur = probeDur(fullFile);
  const res = spawnSync("ffmpeg", ["-i", fullFile, "-af", "silencedetect=noise=-34dB:d=0.45", "-f", "null", "-"], {
    encoding: "utf8",
  });
  const silences = [];
  let curStart = null;
  for (const line of (res.stderr || "").split("\n")) {
    const mS = line.match(/silence_start:\s*([0-9.]+)/);
    const mE = line.match(/silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)/);
    if (mS) curStart = parseFloat(mS[1]);
    if (mE && curStart !== null) {
      const end = parseFloat(mE[1]);
      const dur = parseFloat(mE[2]);
      if (curStart > 1.2 && end < totalDur - 1.2) {
        silences.push({ mid: (curStart + end) / 2, dur });
      }
      curStart = null;
    }
  }
  const splits = silences
    .sort((a, b) => b.dur - a.dur)
    .slice(0, 9)
    .map((s) => s.mid)
    .sort((a, b) => a - b);

  if (splits.length === 9) {
    const bounds = [0, ...splits, totalDur];
    for (let i = 0; i < 10; i++) {
      const outPart = path.join(VO_DIR, `${WINDOWS[i].id}.wav`);
      execFileSync("ffmpeg", [
        "-v",
        "error",
        "-y",
        "-ss",
        bounds[i].toFixed(3),
        "-to",
        bounds[i + 1].toFixed(3),
        "-i",
        fullFile,
        outPart,
      ]);
    }
    sceneFiles = WINDOWS.map((w) => findFile(w.id));
    console.log("Auto-split full audio into scene01.wav .. scene10.wav by pause detection.");
  }
}

const existingScenes = WINDOWS.map((w, i) => ({ ...w, file: sceneFiles[i] })).filter((w) => w.file);

if (existingScenes.length > 0) {
  const inputs = ["-f", "lavfi", "-t", "75", "-i", "anullsrc=r=48000:cl=stereo"];
  const filters = [];
  const mixLabels = ["[0:a]"];

  existingScenes.forEach((sc, idx) => {
    const inIdx = idx + 1;
    inputs.push("-i", sc.file);
    const dur = probeDur(sc.file);
    const tempo = dur > sc.maxDur ? Math.min(1.35, dur / sc.maxDur) : 1.0;
    const delayMs = Math.round(sc.start * 1000);
    const atempo = tempo > 1.01 ? `atempo=${tempo.toFixed(3)},` : "";
    filters.push(
      `[${inIdx}:a]silenceremove=start_periods=1:start_threshold=-38dB,${atempo}adelay=${delayMs}|${delayMs}[s${inIdx}]`,
    );
    mixLabels.push(`[s${inIdx}]`);
  });

  filters.push(`${mixLabels.join("")}amix=inputs=${mixLabels.length}:normalize=0,alimiter=limit=0.95[out]`);
  execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", SYNCED_VO]);
  console.log(`Synced ${existingScenes.length} scene VO file(s) -> public/audio/vo/vo-synced.wav (75.0s)`);
} else {
  console.log(
    "Belum ada file di public/audio/vo/. Simpan hasil Google AI Studio sebagai public/audio/vo/full.wav atau scene01.wav..scene10.wav lalu jalankan: npm run vo",
  );
  process.exit(0);
}

if (fs.existsSync(OUT_MP4) && fs.existsSync(SYNCED_VO)) {
  const tmpMp4 = path.join(ROOT, "out/devtrine-with-vo.mp4");
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    OUT_MP4,
    "-i",
    SYNCED_VO,
    "-filter_complex",
    "[0:a]volume=0.55[bg];[1:a]volume=1.35[vo];[bg][vo]amix=inputs=2:duration=first:normalize=0[a]",
    "-map",
    "0:v",
    "-map",
    "[a]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    tmpMp4,
  ]);
  fs.renameSync(tmpMp4, OUT_MP4);
  console.log("Merged synced VO into out/devtrine-history-of-programming.mp4!");
}

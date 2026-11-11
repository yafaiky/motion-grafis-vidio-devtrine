# Devtrine Studio — (Remotion Motion Graphics)

Video motion graphics edukatif & komedi vertikal (**9:16**, **1080×1920**, **30 FPS**, **75 detik**) untuk TikTok, Instagram Reels, dan YouTube Shorts.

## Spesifikasi
- **Framework:** Remotion 4 + React 19 + TypeScript
- **Resolusi:** `1080 × 1920` (9:16 Vertical) @ `30 FPS` (`2250 frames` / `75 detik`)
- **Codec Export:** `MP4 (H.264)` + `AAC Stereo`
- **Maskot:** **Devtrine** (`src/components/DevtrineMascot.tsx`) — dibangun langsung dari geometri logo asli `assets/Devtrine studio.png`
- **Audio:** Seluruh SFX (`34 file WAV`) dan BGM (`public/audio/bgm/bgm.wav`) disintesis secara prosedural melalui `scripts/generate-audio.mjs` (100% bebas lisensi)

## Struktur Proyek
```
src/
  index.ts
  Root.tsx
  Composition.tsx
  theme.ts
  timeline-data.json
  lib/
    anim.ts
  scenes/
    Scene01Hook.tsx
    Scene02PlotTwist.tsx
    Scene03AdaLovelace.tsx
    Scene04SkillIssue.tsx
    Scene05MachineLanguage.tsx
    Scene06OtpJoke.tsx
    Scene07ProgrammingEvolution.tsx
    Scene08ArtificialIntelligence.tsx
    Scene09GoogleAIStudio.tsx
    Scene10Closing.tsx
  components/
    DevtrineMascot.tsx
    KineticTypography.tsx
    Transition.tsx
    Background.tsx
    SoundEffect.tsx
    Subtitles.tsx
    Camera.tsx
public/
  images/devtrine-logo.png
  audio/sfx/*.wav
  audio/bgm/bgm.wav
scripts/
  generate-audio.mjs
```

## Cara Menjalankan Proyek

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Sinkronisasi Voice-Over (jika ada file baru di `public/audio/vo/`)**
   ```bash
   npm run vo
   ```

3. **Jalankan Remotion Studio (Live Preview)**
   ```bash
   npm run dev
   ```

4. **Render Final Video MP4 (`out/devtrine-history-of-programming.mp4`)**
   ```bash
   npm run render
   ```

## Pengaturan Volume Suara

Buka file **`src/theme.ts`** untuk mengatur volume audio:

```typescript
export const AUDIO = {
  sfx: 0.4,  // Efek suara (kecilkan: 0.2 - 0.3 | besarkan: 0.5 - 0.6)
  bgm: 0.18, // Musik latar
  vo: 1.4,   // Suara orang bicara (Voice-Over)
};
```
*Setelah mengubah angka, jalankan `npm run dev` untuk tes dengar atau `npm run render` untuk render ulang.*

## Pengaturan Voice-Over (VO)

Jika ingin mengganti atau memasukkan rekaman suara baru:

1. Simpan file audio di folder `public/audio/vo/`:
   - **Per scene (Rekomendasi):** `scene01.wav` s/d `scene10.wav`
   - **Atau 1 file utuh:** `full.wav`
2. Jalankan perintah sinkronisasi otomatis:
   ```bash
   npm run vo
   ```
Audio akan otomatis disinkronkan presisi dengan timeline tiap scene video.

dan jangan lupa untuk minta scriptnya ke ai buat lebih akurat.

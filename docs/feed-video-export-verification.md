# Feed video export — local verification

Base: main at 704113e. Scope: local changes only; no remote push or deployment.

## Change

The Feed prefers WebCodecs encoding with explicit 30 fps presentation timestamps. Each source frame is sought and drawn through the existing Feed renderer before encoding. Rendering speed no longer determines the output frame count. Codec capability checks select H.264/AAC MP4 or VP9/Opus WebM; unsupported configurations retain the existing MediaRecorder path. Its callback cadence now uses source timestamps.

The raster blur keeps its scale, radius, three horizontal/vertical passes, edge handling and clamped rounding. RGBA channels are accumulated together and one scratch buffer replaces six intermediate arrays. Neutral color adjustments are skipped. Pixel equality covers twelve size/radius combinations.

## Evidence

- Chromium headless, local server, synthetic moving 1280×720 60 fps source with a 440 Hz audio track.
- Full six-second Feed export: 1080×1350, 180 decoded frames, 30/1 fps, VP9/Opus WebM with audio. No browser page errors in the automated download test.
- Trim 1.25–3.25 seconds, blur 120, audio off: H.264 MP4, 1080×1350, 60 decoded frames, duration 2.000000 seconds, 30/1 fps.
- ffmpeg decoded both exports without errors.
- Build, JavaScript syntax checks, diff whitespace checks and all 27 Node tests passed.
- Isolated blur benchmark: approximately 13.34 ms before versus 6.13 ms after per three-pass blur, in this environment. This is not an end-to-end export-speed guarantee.

## Reproduction

Generate a fixture with ffmpeg:

```sh
ffmpeg -f lavfi -i testsrc2=size=1280x720:rate=60 -f lavfi -i sine=frequency=440 -t 6 -c:v libx264 -preset ultrafast -pix_fmt yuv420p -c:a aac /tmp/storyforge-source.mp4
```

Start `node server.mjs`, then run `node scripts/verify-feed-video.cjs /tmp/storyforge-source.mp4` with Playwright and ffprobe available. `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH` can select existing tooling. Run `node --test scripts/*.test.mjs` and `npm run build` for the other checks.

## Limits

This validates Chromium locally, not physical iPhone/Safari hardware or the user's original source clip. Browsers without the necessary WebCodecs codec support still use real-time recording and may drop frames under load. Frame-by-frame exports can take longer than the source playback duration. Audio is decoded into memory before encoding, so very long source clips use additional memory.

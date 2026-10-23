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

## Follow-up after mobile regression report

The uploaded exported clip was analyzed directly: it has 1,194 frames over 39.8 seconds, but 888 of 1,193 adjacent upper-video-frame comparisons have mean absolute grayscale difference below 0.3/255 at 128×82. This is evidence of many nearly repeated images, not proof of the original source frame rate. Lost source frames cannot be reconstructed from that already-exported file.

Changes in the follow-up:

- MP4/AAC input audio packets are copied into the output MP4 rather than requiring AudioEncoder or decoding the whole audio track into PCM. MP4 edit offsets and trim boundaries are applied. Other audio formats retain the existing encode path.
- H.264 uses the more broadly supported Baseline Level 4.0 profile. No output resolution change.
- Feed preview canvas is sized for its visible editor bounds, and paints follow source-frame callbacks with a 30 fps cap. The full-size blur algorithm, radius and export renderer remain unchanged.
- The offline encoding loop explicitly yields to browser UI tasks every two frames.

Follow-up validation:

- AudioEncoder and AudioData intentionally disabled: both the synthetic source and the user-supplied exported clip passed the six-second MP4/audio and two-second silent/max-blur export scenarios. Each produced exactly 180 or 60 decoded frames at 30/1 fps, at 1080×1350, with no browser page errors.
- The synthetic source's 259 retained AAC packets are byte-for-byte equal to the source packets after its one priming packet. AAC extraction and the no-AudioEncoder capability path have dedicated regression tests.
- Local Chromium at a 390×844 mobile viewport with DPR 3, using the user-supplied clip: mean preview draw time went from 47.6 ms to 37.2 ms; the 95th percentile interval of a 20 ms UI heartbeat went from 148.8 ms to 67.3 ms. This remains a software-rendered desktop measurement and is not physical iPhone validation.
- All 29 Node tests and build passed. Synthetic input validates cadence; re-exporting the user's already-stuttering file cannot validate recovery of missing movement.

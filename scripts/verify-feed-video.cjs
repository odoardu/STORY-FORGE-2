// Requires Playwright, ffprobe, a running local server, and a six-second fixture.
// PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE_PATH optionally select local tooling.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const source = process.argv[2];
  if (!source) throw new Error('Pass a six-second video fixture with audio.');
  for (const scenario of [{ name: 'audio', start: 0, end: 6, blur: 19, audio: true }, { name: 'trim-max-blur', start: 1.25, end: 3.25, blur: 120, audio: false }]) {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--no-zygote', '--disable-dev-shm-usage'] });
    try {
      const page = await browser.newPage({ acceptDownloads: true });
      if (process.env.STORYFORGE_NO_AUDIO_ENCODER) await page.addInitScript(() => { window.AudioEncoder = undefined; window.AudioData = undefined; });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.STORYFORGE_URL || 'http://127.0.0.1:4173');
      await page.locator('#videoInput').setInputFiles(source);
      await page.waitForFunction(() => state.videoUrl && elements.video.readyState >= 2);
      if (await page.locator('#contentIdeas').evaluate(dialog => dialog.open)) await page.locator('#closeContentIdeas').click();
      await page.evaluate(s => {
        state.videoTrimStart = s.start; state.videoTrimEnd = s.end;
        state.videoIncludeAudio = s.audio; state.maskBlur = s.blur;
      }, scenario);
      const pending = page.waitForEvent('download', { timeout: 300000 });
      await page.locator('#exportButton').click();
      const download = await pending;
      const output = path.resolve(process.env.TMPDIR || '/tmp', `storyforge-${scenario.name}.${download.suggestedFilename().split('.').pop()}`);
      await download.saveAs(output);
      const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_entries', 'stream=codec_type,width,height,avg_frame_rate,nb_read_frames', '-of', 'json', output]));
      const video = probe.streams.find(stream => stream.codec_type === 'video');
      assert.equal(video.width, 1080); assert.equal(video.height, 1350);
      assert.equal(video.avg_frame_rate, '30/1');
      assert.equal(+video.nb_read_frames, Math.ceil((scenario.end - scenario.start) * 30));
      assert.equal(probe.streams.some(stream => stream.codec_type === 'audio'), scenario.audio);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ scenario: scenario.name, output, ...video }));
    } finally { await browser.close(); }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

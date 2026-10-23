import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function harness({ supported = true, dropAudio = false, silentSource = false, failRender = false } = {}) {
  const video = {}, audio = {}, calls = { frames: [], disposed: false, canceled: false, executed: false };
  const context = {
    Blob, setTimeout, VideoEncoder: supported ? class {} : undefined, VideoDecoder: class {},
    document: { createElement: () => ({ getContext: () => ({}) }) },
    canEncodeAudio: async () => true, registerAacEncoder() {},
    BlobSource: class {}, Mp4OutputFormat: class {}, Quality: class {}, ALL_FORMATS: [],
    BufferTarget: class {},
    Output: class { constructor(options) { Object.assign(this, options); } },
    Input: class {
      getPrimaryVideoTrack() { return video; }
      getPrimaryAudioTrack() { return silentSource ? null : audio; }
      dispose() { calls.disposed = true; }
    },
    VideoSample: class { constructor(frame, timing) { calls.frames.push({ frame, ...timing }); } },
    Conversion: { async init(options) {
      return {
        isValid: true, state: 'idle', utilizedTracks: dropAudio ? [video] : [video, audio],
        async execute() {
          calls.executed = true;
          for (const timestamp of [0, 1 / 30, 2 / 30]) {
            await options.video.process({ timestamp, duration: 1 / 30, displayWidth: 1280, displayHeight: 720, draw() {} });
          }
          options.output.target.buffer = new Uint8Array([1, 2, 3]).buffer;
          this.state = 'done';
        },
        async cancel() { calls.canceled = true; },
      };
    } },
  };
  const source = readFileSync(new URL('./video-export.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace('export async function', 'async function');
  const run = vm.runInNewContext(source + '\nexportVideoFrames', context);
  const options = { blob: new Blob(['video']), width: 1080, height: 1350, start: 0, end: 1,
    render(frame) { if (failRender) throw new Error('render failed'); return frame; } };
  return { calls, run: overrides => run({ ...options, ...overrides }) };
}

test('keeps every decoded frame and its media timestamp while rendering asynchronously', async () => {
  const { run, calls } = harness();
  const result = await run();
  assert.equal(result.type, 'video/mp4');
  assert.deepEqual(calls.frames.map(frame => frame.timestamp), [0, 1 / 30, 2 / 30]);
  assert.ok(calls.frames.every(frame => frame.duration === 1 / 30));
  assert.equal(calls.disposed, true);
});
test('never silently exports without a requested audio track', async () => {
  const { run, calls } = harness({ dropAudio: true });
  await assert.rejects(run(), /preservar o áudio/);
  assert.equal(calls.executed, false);
  assert.equal(calls.canceled, true);
  assert.equal(calls.disposed, true);
});
test('a silent source still exports without inventing an audio track', async () => {
  const { run } = harness({ dropAudio: true, silentSource: true });
  assert.equal((await run()).size, 3);
});
test('render failure releases conversion and input resources', async () => {
  const { run, calls } = harness({ failRender: true });
  await assert.rejects(run(), /render failed/);
  assert.equal(calls.canceled, true);
  assert.equal(calls.disposed, true);
});
test('unsupported browsers get an actionable error instead of the frame-dropping recorder', async () => {
  await assert.rejects(harness({ supported: false }).run(), /Atualize o Safari ou Chrome/);
});

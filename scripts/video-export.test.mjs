import test from 'node:test';
import assert from 'node:assert/strict';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { extractAac, prepare } from './video-export.js';

function aacFixture() {
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({ target, audio: { codec: 'aac', sampleRate: 44100, numberOfChannels: 2 }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
  const packets = Array.from({ length: 5 }, (_, i) => new Uint8Array([i + 1, 2, 3, 4]));
  packets.forEach((data, i) => muxer.addAudioChunkRaw(data, 'key', Math.round(i * 1024 / 44100 * 1e6), Math.round(1024 / 44100 * 1e6), i === 0 ? {
    decoderConfig: { codec: 'mp4a.40.2', sampleRate: 44100, numberOfChannels: 2, description: new Uint8Array([0x12, 0x10]) },
  } : undefined));
  muxer.finalize(); return { buffer: target.buffer, packets };
}

test('MP4 AAC extraction preserves encoded packets, decoder configuration and sample timeline', () => {
  const { buffer, packets } = aacFixture(); const audio = extractAac(buffer);
  assert.equal(audio.sampleRate, 44100); assert.equal(audio.numberOfChannels, 2);
  assert.deepEqual(audio.description, new Uint8Array([0x12, 0x10]));
  assert.equal(audio.samples.length, packets.length);
  for (let i = 0; i < packets.length; i++) {
    assert.deepEqual(audio.samples[i].data, packets[i]);
    assert.ok(Math.abs(audio.samples[i].time - i * 1024 / 44100) < 1e-5);
  }
});

test('H.264 plus copied AAC remains available without AudioEncoder or AudioData', async () => {
  const previous = Object.fromEntries(['VideoEncoder', 'VideoFrame', 'AudioEncoder', 'AudioData', 'fetch'].map(key => [key, globalThis[key]]));
  try {
    const { buffer } = aacFixture();
    globalThis.VideoEncoder = { isConfigSupported: async config => ({ supported: config.codec.startsWith('avc1'), config }) };
    globalThis.VideoFrame = class {};
    globalThis.AudioEncoder = globalThis.AudioData = undefined;
    globalThis.fetch = async () => ({ arrayBuffer: async () => buffer });
    const session = await prepare({ width: 1080, height: 1350, includeAudio: true, url: 'blob:fixture' });
    assert.equal(session.ext, 'mp4'); assert.equal(session.audioConfig, null);
    assert.equal(session.aac.samples.length, 5); assert.equal(session.audio, null);
  } finally { Object.assign(globalThis, previous); }
});

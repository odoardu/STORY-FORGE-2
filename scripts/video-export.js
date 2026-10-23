import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from 'mp4-muxer';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from 'webm-muxer';

// Encode timestamps explicitly: slow rendering must never become missing frames.
export async function prepare({ width, height, includeAudio, url }) {
  if (!globalThis.VideoEncoder || !globalThis.VideoFrame ||
      (includeAudio && (!globalThis.AudioEncoder || !globalThis.AudioData))) return null;
  let audio = null;
  if (includeAudio) {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) return null;
    const context = new Context({ sampleRate: 48000 });
    try {
      audio = await context.decodeAudioData(await (await fetch(url)).arrayBuffer());
    } catch { return null; }
    finally { await context.close(); }
  }
  const audioBase = audio && { numberOfChannels: Math.min(2, audio.numberOfChannels), sampleRate: audio.sampleRate, bitrate: 192000 };
  for (const candidate of [
    { mime: 'video/mp4', ext: 'mp4', videoCodec: 'avc1.64002a', audioCodec: 'mp4a.40.2', Muxer: Mp4Muxer, Target: Mp4Target, muxVideo: 'avc', muxAudio: 'aac' },
    { mime: 'video/webm', ext: 'webm', videoCodec: 'vp09.00.40.08', audioCodec: 'opus', Muxer: WebmMuxer, Target: WebmTarget, muxVideo: 'V_VP9', muxAudio: 'A_OPUS' },
  ]) {
    const videoConfig = { codec: candidate.videoCodec, width, height, bitrate: 9000000, framerate: 30 };
    const audioConfig = audioBase && { ...audioBase, codec: candidate.audioCodec };
    try {
      if (!(await VideoEncoder.isConfigSupported(videoConfig)).supported ||
          (audioConfig && !(await AudioEncoder.isConfigSupported(audioConfig)).supported)) continue;
      return { ...candidate, width, height, videoConfig, audioConfig, audio };
    } catch { /* Try the next codec pair before using the existing recorder. */ }
  }
  return null;
}

export async function encode(session, { video, canvas, start, end, seek, draw, progress }) {
  const { Muxer, Target, width, height, audio, audioConfig } = session;
  const target = new Target();
  const muxer = new Muxer({ target,
    video: { codec: session.muxVideo, width, height },
    ...(audioConfig ? { audio: { codec: session.muxAudio, sampleRate: audioConfig.sampleRate, numberOfChannels: audioConfig.numberOfChannels } } : {}),
    ...(session.ext === 'mp4' ? { fastStart: 'in-memory' } : {}),
    firstTimestampBehavior: 'offset',
  });
  let failure = null;
  const onError = error => { failure = error; };
  const encoder = new VideoEncoder({ output: (chunk, metadata) => { try { muxer.addVideoChunk(chunk, metadata); } catch (error) { onError(error); } }, error: onError });
  let audioEncoder = null;
  try {
    encoder.configure(session.videoConfig);
    const duration = end - start, count = Math.ceil(duration * 30);
    video.pause();
    for (let i = 0; i < count; i++) {
      if (failure) throw failure;
      await seek(video, start + i / 30);
      draw(video);
      const timestamp = Math.round(i * 1e6 / 30);
      const frame = new VideoFrame(canvas, { timestamp, duration: Math.min(Math.round((i + 1) * 1e6 / 30), Math.round(duration * 1e6)) - timestamp });
      try { encoder.encode(frame, { keyFrame: i % 60 === 0 }); }
      finally { frame.close(); }
      // Bound queued frames and give the UI time to update even for very short seeks.
      if (encoder.encodeQueueSize >= 4) await encoder.flush();
      progress((i + 1) / count * (audioConfig ? .95 : 1));
    }
    await encoder.flush();
    if (audioConfig) {
      audioEncoder = new AudioEncoder({ output: (chunk, metadata) => { try { muxer.addAudioChunk(chunk, metadata); } catch (error) { onError(error); } }, error: onError });
      audioEncoder.configure(audioConfig);
      const channels = audioConfig.numberOfChannels, rate = audio.sampleRate;
      const first = Math.round(start * rate), last = Math.min(audio.length, Math.round(end * rate));
      for (let offset = first; offset < last; offset += 2048) {
        if (failure) throw failure;
        const length = Math.min(2048, last - offset), data = new Float32Array(length * channels);
        for (let c = 0; c < channels; c++) data.set(audio.getChannelData(c).subarray(offset, offset + length), c * length);
        const packet = new AudioData({ format: 'f32-planar', sampleRate: rate, numberOfFrames: length, numberOfChannels: channels, timestamp: Math.round((offset - first) * 1e6 / rate), data });
        try { audioEncoder.encode(packet); } finally { packet.close(); }
        if (audioEncoder.encodeQueueSize >= 8) {
          await new Promise(resolve => audioEncoder.addEventListener('dequeue', resolve, { once: true }));
        }
      }
      await audioEncoder.flush();
    }
    if (failure) throw failure;
    muxer.finalize(); progress(1);
    return new Blob([target.buffer], { type: session.mime });
  } finally {
    if (encoder.state !== 'closed') encoder.close();
    if (audioEncoder && audioEncoder.state !== 'closed') audioEncoder.close();
  }
}

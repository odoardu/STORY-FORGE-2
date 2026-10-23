import { createFile } from 'mp4box';
import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4Target } from 'mp4-muxer';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmTarget } from 'webm-muxer';

// Keep AAC packets from MP4 inputs: Safari can encode H.264 without AudioEncoder.
// This also avoids decoding an entire song into an in-memory PCM buffer.
export function extractAac(buffer) {
  const file = createFile();
  let result = null, track = null, failed = false;
  file.onError = () => { failed = true; };
  file.onReady = info => {
    if (!info.audioTracks.length) { result = { silent: true }; return; }
    track = info.audioTracks[0];
    if (track.codec !== 'mp4a.40.2') return;
    const entry = file.getTrackById(track.id).mdia.minf.stbl.stsd.entries[0];
    const findConfig = descriptor => descriptor?.tag === 5 ? descriptor.data
      : descriptor?.descs?.map(findConfig).find(Boolean);
    const description = findConfig(entry.esds?.esd);
    if (!description) return;
    let offset = 0;
    for (const edit of track.edits || []) {
      if (edit.media_time === -1) offset += edit.segment_duration / track.movie_timescale;
      else { offset -= edit.media_time / track.timescale; break; }
    }
    result = { sampleRate: track.audio.sample_rate, numberOfChannels: track.audio.channel_count,
      description: description.slice(), samples: [], offset };
    file.setExtractionOptions(track.id, null, { nbSamples: 1000 }); file.start();
  };
  file.onSamples = (id, user, samples) => {
    if (result?.samples && id === track.id) for (const sample of samples) {
      result.samples.push({ data: sample.data, time: sample.cts / sample.timescale + result.offset,
        duration: sample.duration / sample.timescale });
    }
  };
  try { buffer.fileStart = 0; file.appendBuffer(buffer); file.flush(); }
  catch { return null; }
  return failed || (result?.samples && !result.samples.length) ? null : result;
}

// Encode timestamps explicitly: slow rendering must never become missing frames.
export async function prepare({ width, height, includeAudio, url }) {
  if (!globalThis.VideoEncoder || !globalThis.VideoFrame) return null;
  let audio = null, aac = null;
  const source = includeAudio ? await (await fetch(url)).arrayBuffer() : null;
  if (source) aac = extractAac(source);
  if (includeAudio && !aac) {
    if (!globalThis.AudioEncoder || !globalThis.AudioData) return null;
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Context) return null;
    const context = new Context({ sampleRate: 48000 });
    try {
      audio = await context.decodeAudioData(source);
    } catch { return null; }
    finally { await context.close(); }
  }
  const audioBase = audio && { numberOfChannels: Math.min(2, audio.numberOfChannels), sampleRate: audio.sampleRate, bitrate: 192000 };
  for (const candidate of [
    { mime: 'video/mp4', ext: 'mp4', videoCodec: 'avc1.420028', audioCodec: 'mp4a.40.2', Muxer: Mp4Muxer, Target: Mp4Target, muxVideo: 'avc', muxAudio: 'aac' },
    { mime: 'video/webm', ext: 'webm', videoCodec: 'vp09.00.40.08', audioCodec: 'opus', Muxer: WebmMuxer, Target: WebmTarget, muxVideo: 'V_VP9', muxAudio: 'A_OPUS' },
  ]) {
    const videoConfig = { codec: candidate.videoCodec, width, height, bitrate: 9000000, framerate: 30 };
    if (aac?.samples && candidate.ext !== 'mp4') continue;
    const audioConfig = audioBase && { ...audioBase, codec: candidate.audioCodec };
    try {
      if (!(await VideoEncoder.isConfigSupported(videoConfig)).supported ||
          (audioConfig && !(await AudioEncoder.isConfigSupported(audioConfig)).supported)) continue;
      return { ...candidate, width, height, videoConfig, audioConfig, audio, aac };
    } catch { /* Try the next codec pair before using the existing recorder. */ }
  }
  return null;
}

export async function encode(session, { video, canvas, start, end, seek, draw, progress }) {
  const { Muxer, Target, width, height, audio, audioConfig, aac } = session;
  const target = new Target();
  const muxer = new Muxer({ target,
    video: { codec: session.muxVideo, width, height },
    ...(aac?.samples ? { audio: { codec: 'aac', sampleRate: aac.sampleRate, numberOfChannels: aac.numberOfChannels } } : audioConfig ? { audio: { codec: session.muxAudio, sampleRate: audioConfig.sampleRate, numberOfChannels: audioConfig.numberOfChannels } } : {}),
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
      progress((i + 1) / count * (audioConfig || aac?.samples ? .95 : 1));
      // Codec operations may resolve immediately; explicitly let touch/paint tasks run.
      if (i % 2 === 1) await new Promise(resolve => setTimeout(resolve, 0));
    }
    await encoder.flush();
    if (aac?.samples) {
      let first = true;
      for (const sample of aac.samples) {
        if (sample.time < start - 1e-6 || sample.time >= end) continue;
        muxer.addAudioChunkRaw(sample.data, 'key', Math.max(0, Math.round((sample.time - start) * 1e6)),
          Math.round(Math.min(sample.duration, end - sample.time) * 1e6), first ? {
            decoderConfig: { codec: 'mp4a.40.2', sampleRate: aac.sampleRate,
              numberOfChannels: aac.numberOfChannels, description: aac.description },
          } : undefined);
        first = false;
      }
    }
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

import { Input, BlobSource, ALL_FORMATS, Output, BufferTarget, Mp4OutputFormat, CanvasSource, AudioSampleSource, AudioSampleSink, canEncodeAudio } from 'mediabunny';
import { registerAacEncoder } from '@mediabunny/aac-encoder';

async function open(file) {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const track = await input.getPrimaryAudioTrack();
    if (!track) throw new Error('Esse arquivo não tem áudio. Escolha outro MP3 ou MP4.');
    if (!await track.canDecode()) throw new Error('O navegador não consegue ler esse áudio. Tente outro arquivo ou um navegador atualizado.');
    const origin = Math.max(0, await track.getFirstTimestamp());
    const duration = await input.computeDuration([track]) - origin;
    if (!(duration > 0)) throw new Error('Não foi possível identificar a duração do áudio.');
    return { input, track, origin, duration };
  } catch (error) { input.dispose(); throw error; }
}
export async function inspectMedia(file) {
  const media = await open(file);
  try { return { duration: media.duration, origin: media.origin }; }
  finally { media.input.dispose(); }
}
export async function exportVinyl({ file, canvas, render, start, duration, signal, onProgress }) {
  if (typeof VideoEncoder === 'undefined') throw new Error('A exportação precisa de um navegador com suporte a codificação de vídeo. Tente Chrome ou Safari atualizado.');
  const media = await open(file);
  let output;
  try {
    if (!await canEncodeAudio('aac')) registerAacEncoder();
    const target = new BufferTarget();
    output = new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target });
    const video = new CanvasSource(canvas, { codec: 'avc', bitrate: 5_000_000 });
    const audio = new AudioSampleSource({ codec: 'aac', bitrate: 192_000 });
    output.addVideoTrack(video, { frameRate: 30 });
    output.addAudioTrack(audio);
    await output.start();
    let framesDone = 0, audioDone = 0, stopped = false;
    const count = Math.ceil(duration * 30);
    const check = () => { signal?.throwIfAborted(); if (stopped) throw new Error('Exportação interrompida.'); };
    const progress = () => onProgress?.(Math.min(.98, .98 * (.85 * framesDone / count + .15 * audioDone / duration)));
    const actualStart = media.origin + start, actualEnd = actualStart + duration;
    const jobs = [
      (async () => {
        for (let i = 0; i < count; i++) {
          check(); const time = i / 30;
          render(time);
          await video.add(time, 1 / 30, { keyFrame: i % 60 === 0 });
          framesDone++; progress();
          if (i % 8 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        }
        video.close();
      })(),
      (async () => {
        let samples = 0;
        for await (const sample of new AudioSampleSink(media.track).samples(actualStart, actualEnd)) {
          let trimmed;
          try {
            check();
            const from = Math.max(0, Math.ceil((actualStart - sample.timestamp) * sample.sampleRate - 1e-6));
            const to = Math.min(sample.numberOfFrames, Math.ceil((actualEnd - sample.timestamp) * sample.sampleRate - 1e-6));
            if (to <= from) continue;
            trimmed = sample.trim(from, to);
            trimmed.setTimestamp(Math.max(0, trimmed.timestamp - actualStart));
            await audio.add(trimmed); samples++;
            audioDone = Math.min(duration, trimmed.timestamp + trimmed.duration); progress();
          } finally { trimmed?.close(); sample.close(); }
        }
        if (!samples) throw new Error('O trecho escolhido não contém áudio.');
        audio.close();
      })()
    ];
    try { await Promise.all(jobs); }
    catch (error) { stopped = true; await output.cancel().catch(() => {}); await Promise.allSettled(jobs); throw error; }
    check(); await output.finalize(); onProgress?.(1);
    return new Blob([target.buffer], { type: 'video/mp4' });
  } catch (error) { await output?.cancel().catch(() => {}); throw error; }
  finally { media.input.dispose(); }
}

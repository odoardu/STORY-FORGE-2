import { Input, BlobSource, ALL_FORMATS, Output, BufferTarget, Mp4OutputFormat, Conversion, VideoSample, Quality, canEncodeAudio } from 'mediabunny';
import { registerAacEncoder } from '@mediabunny/aac-encoder';

// Decode and encode against media timestamps, never the phone's rendering clock.
// A slow effect may take longer to export, but cannot make the output skip frames.
export async function exportVideoFrames({ blob, width, height, start, end, render, onProgress }) {
  if (typeof VideoEncoder === 'undefined' || typeof VideoDecoder === 'undefined') {
    throw new Error('Atualize o Safari ou Chrome para exportar vídeo com todos os quadros.');
  }
  const input = new Input({ source: new BlobSource(blob), formats: ALL_FORMATS });
  const target = new BufferTarget();
  const output = new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target });
  let conversion;
  try {
    const video = await input.getPrimaryVideoTrack();
    const audio = await input.getPrimaryAudioTrack();
    if (audio && !(await canEncodeAudio('aac'))) registerAacEncoder();
    if (!video) throw new Error('O arquivo não contém uma faixa de vídeo.');
    const source = document.createElement('canvas');
    const painter = source.getContext('2d');
    conversion = await Conversion.init({
      input, output, tracks: 'primary', trim: { start, end }, tags: {},
      video: {
        codec: 'avc', quality: new Quality({ bitrate: 9_000_000 }),
        frameRate: 30, keyFrameInterval: 2, forceTranscode: true,
        allowTransformationMetadata: false,
        processedWidth: width, processedHeight: height,
        process: async sample => {
          if (source.width !== sample.displayWidth || source.height !== sample.displayHeight) {
            source.width = sample.displayWidth; source.height = sample.displayHeight;
          }
          sample.draw(painter, 0, 0);
          // ArtworkEffects caches by source and media timestamp, including canvas frames.
          source.currentTime = sample.timestamp;
          const frame = render(source);
          // Snapshot before yielding: no mutable shared canvas enters the encoder queue.
          const result = new VideoSample(frame, { timestamp: sample.timestamp, duration: sample.duration });
          await new Promise(resolve => setTimeout(resolve, 0));
          return result;
        },
      },
      audio: { codec: 'aac', quality: new Quality({ bitrate: 192_000 }) },
    });
    if (!conversion.isValid || !conversion.utilizedTracks.includes(video)) {
      throw new Error('Este navegador não conseguiu preparar o vídeo. Atualize o navegador e tente novamente.');
    }
    if (audio && !conversion.utilizedTracks.includes(audio)) {
      throw new Error('Não foi possível preservar o áudio. Tente outro arquivo ou desative o áudio para exportar sem som.');
    }
    conversion.onProgress = onProgress;
    await conversion.execute();
    if (!target.buffer?.byteLength) throw new Error('A exportação ficou vazia. Tente novamente.');
    return new Blob([target.buffer], { type: 'video/mp4' });
  } finally {
    if (conversion && conversion.state !== 'done') await conversion.cancel();
    input.dispose();
  }
}

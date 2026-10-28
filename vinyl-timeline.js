export function createTimeline({ host, audio, onTrim, onSeek, togglePlayback }) {
  const timeline = document.createElement('section'); timeline.className = 'vinyl-timeline'; timeline.hidden = true; timeline.setAttribute('aria-label', 'Timeline de áudio do vinil');
  timeline.innerHTML = `<button class="vt-play" type="button" aria-label="Reproduzir ou pausar áudio"><svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></svg></button><div class="vt-track"><canvas width="1000" height="48" aria-hidden="true"></canvas><div class="vt-selection"></div><input class="vt-seek" type="range" min="0" max="1" step=".01" value="0" aria-label="Posição na música"><input class="vt-start" type="range" min="0" max="1" step=".01" value="0" aria-label="Início do corte do vinil"><input class="vt-end" type="range" min="0" max="1" step=".01" value="1" aria-label="Fim do corte do vinil"></div><output class="vt-duration" aria-live="polite"></output>`;
  host.append(timeline);
  const find = selector => timeline.querySelector(selector), start = find('.vt-start'), end = find('.vt-end'), seek = find('.vt-seek'), selection = find('.vt-selection');
  let duration = 1, token = 0;
  function paintSelection() {
    selection.style.left = `${Number(start.value) / duration * 100}%`; selection.style.right = `${100 - Number(end.value) / duration * 100}%`;
    find('output').textContent = `${(Number(end.value) - Number(start.value)).toFixed(1).replace('.', ',')} s`;
  }
  function trim(changed) {
    if (changed === start) start.value = Math.min(Number(start.value), Number(end.value) - .1);
    else end.value = Math.max(Number(end.value), Number(start.value) + .1);
    paintSelection(); onTrim(Number(start.value), Number(end.value));
  }
  start.addEventListener('input', () => trim(start)); end.addEventListener('input', () => trim(end));
  seek.addEventListener('input', () => onSeek(Number(seek.value)));
  find('button').addEventListener('click', togglePlayback);
  function playback() { find('button path').setAttribute('d', audio.paused ? 'm8 5 11 7-11 7Z' : 'M8 5v14M16 5v14'); }
  audio.addEventListener('play', playback); audio.addEventListener('pause', playback);
  return {
    element: timeline,
    setTrim(from, to) { start.value = String(from); end.value = String(to); paintSelection(); },
    setPosition(time) { seek.value = Math.max(0, Math.min(duration, time)); },
    setDisabled(value) { timeline.querySelectorAll('input,button').forEach(element => element.disabled = value); },
    async load(file, seconds, origin = 0) {
      const current = ++token; duration = seconds; timeline.hidden = false;
      for (const input of [start, end, seek]) input.max = String(duration);
      start.value = seek.value = '0'; end.value = String(Math.min(30, duration)); paintSelection(); onTrim(0, Number(end.value));
      const canvas = find('canvas'), painter = canvas.getContext('2d'); painter.clearRect(0, 0, canvas.width, canvas.height);
      let context;
      try {
        context = new AudioContext(); const buffer = await context.decodeAudioData(await file.arrayBuffer());
        if (current !== token) return;
        const data = buffer.getChannelData(0), width = canvas.width, bars = 250, peaks = [];
        for (let bar = 0; bar < bars; bar++) {
          const from = Math.floor((origin + bar / bars * duration) * buffer.sampleRate), to = Math.min(data.length, Math.ceil((origin + (bar + 1) / bars * duration) * buffer.sampleRate));
          let peak = 0; for (let i = from; i < to; i += 8) peak = Math.max(peak, Math.abs(data[i])); peaks.push(peak);
        }
        const maximum = Math.max(.001, ...peaks); painter.fillStyle = '#bfc4ce';
        peaks.forEach((peak, i) => { const height = Math.max(2, peak / maximum * 40); painter.fillRect(i * width / bars, (48 - height) / 2, 2, height); });
      } catch { /* The trim track remains usable when browser waveform decoding is unavailable. */ }
      finally { await context?.close().catch(() => {}); }
    }
  };
}

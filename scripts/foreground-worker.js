import { segmentForeground } from "@imgly/background-removal";
// Keep inference off the editor thread; reuse the loaded session for later photos.
self.onmessage = async ({ data: { id, blob } }) => {
  try {
    const mask = await segmentForeground(blob, {
      model: "isnet_fp16", device: "cpu", proxyToWorker: false,
      output: { format: "image/x-rgba8", quality: 1 },
      progress: (key, current, total) => self.postMessage({ id, progress: { key, current, total } }),
    });
    self.postMessage({ id, mask });
  } catch (error) { self.postMessage({ id, error: String(error.message || error) }); }
};

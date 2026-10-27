import './build-mask.mjs';
import './build-video.mjs';
import { mkdir, readdir, stat, copyFile, cp, rm, writeFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
const root = process.cwd();
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'catalog'), { recursive: true });
for (const file of ['apple-touch-icon.png', 'apple-touch-icon-precomposed.png', 'index.html', 'content-ideas.js', 'polaroid.js', 'editor-history.js', 'export-review.js', 'export-review.css', 'editor-core.js', 'app.js', 'styles.css', 'studio-ui.css', 'studio-refinement.css', 'workbench-preview-ui.js', 'studio-motion.js', 'artwork-effects.js', 'pwa.js', 'manifest.webmanifest', 'service-worker.js']) {
  await copyFile(join(root, file), join(output, file));
}
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });
await copyFile(join(root, 'media-loading-border.js'), join(output, 'media-loading-border.js'));
async function catalog(directories, extensions) {
  const files = [];
  for (const directory of directories) {
    let entries;
    try { entries = await readdir(join(root, 'assets', directory), { withFileTypes: true }); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const entry of entries) {
      if (!entry.isFile() || !extensions.includes(extname(entry.name).toLowerCase())) continue;
      const info = await stat(join(root, 'assets', directory, entry.name));
      files.push({ name: entry.name, path: `/assets/${directory}/${encodeURIComponent(entry.name)}`, size: info.size });
    }
  }
  files.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return { ok: true, files };
}
await writeFile(join(output, 'catalog/logos.json'), JSON.stringify(await catalog(['logos'], ['.svg', '.png'])));
await writeFile(join(output, 'catalog/textures.json'), JSON.stringify(await catalog(['textures', 'texture'], ['.png', '.jpg', '.jpeg', '.webp', '.svg'])));
await copyFile(join(root, 'data/content-ideas.json'), join(output, 'catalog/content-ideas.json'));
console.log('Site e catalogos gerados em dist.');

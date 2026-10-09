import { mkdir, readdir, stat, copyFile, cp, rm, writeFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
const root = process.cwd();
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'catalog'), { recursive: true });
for (const file of ['index.html', 'editor-core.js', 'app.js', 'styles.css']) {
  await copyFile(join(root, file), join(output, file));
}
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });
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
console.log('Site e catalogos gerados em dist.');

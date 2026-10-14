import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
await mkdir('assets/vendor', { recursive: true });
await build({ entryPoints: ['scripts/foreground-worker.js'], outfile: 'assets/vendor/foreground-worker.js', bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022', define: { 'navigator.hardwareConcurrency': '1' }, legalComments: 'linked', alias: { 'onnxruntime-web/webgpu': resolve('node_modules/onnxruntime-web/dist/ort.wasm.min.mjs'), 'onnxruntime-web': resolve('node_modules/onnxruntime-web/dist/ort.wasm.min.mjs') } });
await copyFile('node_modules/@imgly/background-removal/LICENSE.md', 'assets/vendor/background-removal-LICENSE.md');

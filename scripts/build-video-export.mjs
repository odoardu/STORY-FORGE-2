import { copyFile } from 'node:fs/promises';
import { build } from 'esbuild';
await build({ entryPoints: ['scripts/video-export.js'], outfile: 'assets/vendor/video-export.js', bundle: true, minify: true, format: 'iife', globalName: 'VideoExport', platform: 'browser', target: 'es2022', legalComments: 'linked' });

await Promise.all(['mp4-muxer', 'webm-muxer'].map(name => copyFile(`node_modules/${name}/LICENSE`, `assets/vendor/${name}-LICENSE`)));

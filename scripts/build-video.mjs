import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';
await build({ entryPoints: ['scripts/video-export.js'], outfile: 'assets/vendor/video-export.js', bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022', legalComments: 'linked' });
await copyFile('node_modules/mediabunny/LICENSE', 'assets/vendor/mediabunny-LICENSE.txt');

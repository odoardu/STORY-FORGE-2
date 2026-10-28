import { build } from 'esbuild';
await build({ entryPoints: ['scripts/vinyl-video-export.js'], outfile: 'vinyl-video-export.js', bundle: true, minify: true, format: 'esm', platform: 'browser', target: 'es2022', legalComments: 'linked' });

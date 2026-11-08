import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
await mkdir('packages/sdk/dist',{recursive:true});
await build({entryPoints:['packages/sdk/src/index.ts'],outfile:'packages/sdk/dist/index.js',bundle:true,platform:'neutral',format:'esm',target:'es2023',packages:'external'});
await copyFile('packages/sdk/src/index.d.ts','packages/sdk/dist/index.d.ts');

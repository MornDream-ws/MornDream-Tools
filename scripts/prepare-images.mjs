import {mkdir,copyFile,writeFile} from 'node:fs/promises';
const runtime='apps/web/public/image-runtime',face='apps/web/public/image-models/face';
await mkdir(runtime,{recursive:true});await mkdir(face,{recursive:true});
for(const name of ['ort-wasm-simd-threaded.mjs','ort-wasm-simd-threaded.wasm'])await copyFile('node_modules/onnxruntime-web/dist/'+name,runtime+'/'+name);
for(const name of ['tiny_face_detector_model.bin','tiny_face_detector_model-weights_manifest.json'])await copyFile('node_modules/@vladmandic/face-api/model/'+name,face+'/'+name);
const {BACKGROUND_MODEL}=await import('../apps/web/images/models.js');
await writeFile('apps/web/public/image-models/sources.json',JSON.stringify({background:{...BACKGROUND_MODEL,source:'https://github.com/ZhengPeng7/BiRefNet',runtime:'onnxruntime-web 1.24.2 (MIT)'},face:{id:'TinyFaceDetector',package:'@vladmandic/face-api',version:'1.7.15',license:'MIT',source:'https://github.com/vladmandic/face-api',weights:'Bundled model/tiny_face_detector_model.bin in the pinned npm package'},licenses:'../licenses/images/'},null,2));

import {processImage} from './engine.js';
self.onmessage=async({data:{id,files,params}})=>{try{const result=await processImage(id,files,params,message=>self.postMessage({progress:message}));self.postMessage({result});}catch(e){self.postMessage({error:e.message||String(e)});}};

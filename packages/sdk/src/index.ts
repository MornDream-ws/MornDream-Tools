export {tools,catalog,failure,setToolExecutor} from '../../core/src/index.ts';
export type * from '../../core/src/contracts.ts';
export {recipes,operations,defaultArgs,migrateLegacyStep,setRecipeExecutor} from '../../core/src/recipes.ts';
export {workspace} from '../../core/src/workspace.ts';
import {buildRequest} from '../../adapters/src/http.js';
import type {RuntimeOptions} from '../../core/src/contracts.ts';
export {parseCurl,requestToCurl,sanitizeRequest,blankRequest,getJsonPath} from '../../adapters/src/http.js';
export const http={
 prepare:(request:any,environment:Record<string,string>={},files:Record<string,File>={})=>{try{const prepared=buildRequest(request,environment,files);return {ok:true,data:{url:prepared.url,method:prepared.init.method,headers:[...prepared.init.headers],body:typeof prepared.init.body==='string'?prepared.init.body:null,timeoutMs:prepared.timeoutMs}};}catch(e){return {ok:false,error:{code:'INVALID_REQUEST',message:e.message}};}},
 async send(request:any,environment:Record<string,string>={},options:RuntimeOptions={},files:Record<string,File>={}){if(!options.allowNetwork)return {ok:false,error:{code:'NETWORK_NOT_ALLOWED',message:'发送请求需要 allowNetwork=true'}};let timer:ReturnType<typeof setTimeout>;const controller=new AbortController();const abort=()=>controller.abort(options.signal?.reason);try{const prepared=buildRequest(request,environment,files);const start=performance.now();options.signal?.addEventListener('abort',abort,{once:true});if(options.signal?.aborted)abort();timer=setTimeout(()=>controller.abort(new Error('TIMEOUT')),options.timeoutMs||prepared.timeoutMs);const response=await fetch(prepared.url,{...prepared.init,signal:controller.signal} as RequestInit);const body=await response.text();return {ok:true,data:{status:response.status,statusText:response.statusText,headers:[...response.headers],body,url:response.url,size:new TextEncoder().encode(body).length,duration:Math.round(performance.now()-start)}};}catch(e){return {ok:false,error:{code:controller.signal.aborted?(options.signal?.aborted?'CANCELLED':'TIMEOUT'):'NETWORK_ERROR',message:e.message}};}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}}
};

import {tools as coreTools} from '../../core/src/index.ts';
export const security={async run(request:any,options:RuntimeOptions={}){if(!request?.toolId?.startsWith('security.'))return {ok:false,error:{code:'TOOL_NOT_FOUND',message:'需要 security.* 工具 ID'}};const r=await coreTools.run(request,options);return r.ok?{...r,data:JSON.parse(r.data.value)}:r;}};

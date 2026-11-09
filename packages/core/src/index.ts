import Ajv from 'ajv';
import {securityTools} from './security/catalog.js';
import {quickTools} from './catalog.js';
import {executeQuick} from './quick.js';
import type {RunInput,RuntimeOptions,OperationResult} from './contracts.ts';
export type * from './contracts.ts';
const canonical:Record<string,string>={json:'json.format',minify:'json.minify',jsoncsv:'json.to-csv',csvjson:'csv.to-json',base64:'encoding.base64',url:'encoding.url',hex:'encoding.hex',unicode:'encoding.unicode',hash:'crypto.hash',hmac:'crypto.hmac',uuid:'crypto.uuid',jwt:'jwt.decode',timestamp:'time.convert',regex:'text.regex',case:'text.case',dedupe:'text.unique',sort:'text.sort',stats:'text.stats',diff:'text.diff',urlparse:'url.parse'};
const properties:Record<string,Record<string,unknown>>={json:{indent:{type:'integer',minimum:0,maximum:10,default:2},sort:{type:'boolean',default:false}},csvjson:{},hash:{algorithm:{enum:['SHA-1','SHA-256','SHA-512'],default:'SHA-256'}},hmac:{key:{type:'string',default:''}},timestamp:{unit:{enum:['seconds','milliseconds'],default:'seconds'}},regex:{pattern:{type:'string',default:''},flags:{type:'string',pattern:'^[dgimsuvy]*$',default:'g'},replacement:{type:'string',default:''}},case:{caseMode:{enum:['upper','lower','camel','snake'],default:'upper'}}};
for(const id of ['base64','url','hex','unicode'])properties[id]={direction:{enum:['encode','decode'],default:'encode'}};
for(const t of securityTools){canonical[t.id]=t.id;properties[t.id]=t.params;}
const ajv=new Ajv({allErrors:true,useDefaults:true});
const dataSchema={type:'object',properties:{type:{const:'text'},value:{type:'string'}},required:['type','value'],additionalProperties:false};
export const catalog=[...quickTools,...securityTools].map(t=>({...t,id:canonical[t.id],legacyId:t.id,version:'1.0.0',runtimes:['browser','node'],effects:[],inputSchema:{type:'object',properties:{input:t.id.startsWith('security.')?{type:'object',properties:{type:{const:'text'},value:{type:'string'}},required:['type','value'],additionalProperties:false}:dataSchema,params:{type:'object',properties:properties[t.id]||{},additionalProperties:false,default:{}}},required:['input'],additionalProperties:false},outputSchema:{type:'object',properties:{type:{const:'text'},value:{type:'string'}},required:['type','value'],additionalProperties:false}}));
const validators=new Map(catalog.map(t=>[t.id,ajv.compile(t.inputSchema)]));
let toolExecutor:any;export function setToolExecutor(executor:any){toolExecutor=executor;}
export const tools={
 search:({query='',limit=30}:{query?:string;limit?:number}={})=>catalog.filter(t=>(t.id+' '+t.name+' '+t.en+' '+t.desc).toLowerCase().includes(query.toLowerCase())).slice(0,Math.min(100,Math.max(1,limit))),
 describe:(id:string)=>catalog.find(t=>t.id===id||t.legacyId===id),
 async run(request:RunInput,options:RuntimeOptions={}):Promise<OperationResult>{const started=performance.now();const descriptor=tools.describe(request?.toolId);if(!descriptor)return failure('TOOL_NOT_FOUND','未知工具：'+request?.toolId);const args=structuredClone({input:request.input,params:request.params||{}});const validate=validators.get(descriptor.id)!;if(!validate(args))return failure('INVALID_INPUT',ajv.errorsText(validate.errors),validate.errors?.[0]?.instancePath);if(options.signal?.aborted)return failure('CANCELLED','执行已取消');try{if(toolExecutor)return toolExecutor(descriptor.legacyId,args.input.value,args.params,options);if(typeof window==='undefined'){const url=new URL('../../../packages/adapters/src/node-runtime.mjs',import.meta.url).href;const runtime=await import(/* @vite-ignore */ url);return runtime.runQuick({legacyId:descriptor.legacyId,value:args.input.value,params:args.params},options);}const output=await executeQuick(descriptor.legacyId,args.input.value,args.params);return {ok:true,data:{type:'text',value:String(output)},meta:{toolId:descriptor.id,durationMs:Math.round(performance.now()-started)}};}catch(e){return failure('EXECUTION_ERROR',e instanceof Error?e.message:String(e));}}
};
export function failure(code:string,message:string,path?:string):OperationResult{return {ok:false,error:{code,message,...(path?{path}:{})}};}

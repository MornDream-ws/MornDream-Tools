export type DataValue={type:'text';value:string}|{type:'bytes';encoding:'base64';value:string};
export type Result={ok:true;data:DataValue;meta:Record<string,unknown>}|{ok:false;error:{code:string;message:string;path?:string;stepIndex?:number}};
export interface RuntimeOptions{signal?:AbortSignal;allowNetwork?:boolean;timeoutMs?:number}
export interface RecipeStep{op:string;args:unknown[];disabled?:boolean;breakpoint?:boolean}
export const tools:{search(options?:{query?:string;limit?:number}):any[];describe(id:string):any;run(request:{toolId:string;input:DataValue;params?:Record<string,unknown>},options?:RuntimeOptions):Promise<Result>};
export const recipes:{operations(options?:{query?:string;limit?:number}):any[];defaults(op:string):unknown[];validate(input:{input:DataValue;recipe:RecipeStep[]},options?:RuntimeOptions):any;run(input:{input:DataValue;recipe:RecipeStep[]},options?:RuntimeOptions):Promise<Result>};
export const http:{prepare(request:any,environment?:Record<string,string>,files?:Record<string,File>):any;send(request:any,environment?:Record<string,string>,options?:RuntimeOptions,files?:Record<string,File>):Promise<any>};
export const workspace:{create():any;import(value:unknown):any;export(value:any):string};
export const catalog:any[];export const operations:any[];
export function defaultArgs(op:string):unknown[];
export function migrateLegacyStep(step:any):RecipeStep[];
export function setRecipeExecutor(executor:(input:any,options:RuntimeOptions)=>Promise<Result>):void;
export function blankRequest(id:string):any;
export function parseCurl(text:string,id:string):any;
export function requestToCurl(request:any,environment?:Record<string,string>):string;
export function sanitizeRequest(request:any):any;
export function getJsonPath(value:unknown,path:string):unknown;

export function setToolExecutor(executor:Function):void;

export const security:{run(request:{toolId:string;input:DataValue;params?:Record<string,unknown>},options?:RuntimeOptions):Promise<{ok:true;data:Record<string,any>;meta:Record<string,unknown>}|{ok:false;error:{code:string;message:string}}>};

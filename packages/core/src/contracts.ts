export type DataValue = {type:'text';value:string}|{type:'bytes';encoding:'base64';value:string};
export type OperationResult = {ok:true;data:DataValue;meta:{durationMs:number;toolId?:string;steps?:number}} | {ok:false;error:{code:string;message:string;path?:string;stepIndex?:number}};
export interface RunInput {toolId:string;input:DataValue;params?:Record<string,unknown>}
export interface RuntimeOptions {signal?:AbortSignal;allowNetwork?:boolean;timeoutMs?:number}
export interface RecipeStep {op:string;args:unknown[];disabled?:boolean;breakpoint?:boolean}
export interface RecipeInput {input:DataValue;recipe:RecipeStep[];options?:{returnType?:string}}

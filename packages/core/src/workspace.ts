import {migrateLegacyStep,validateRecipe} from './recipes.ts';
import {blankRequest,sanitizeRequest,sensitive} from '../../adapters/src/http.js';
export interface Workspace {format:'morndream-workspace';schemaVersion:2;favorites:string[];recipes:any[];requests:any[];environments:any[];settings:Record<string,unknown>}
function normalize(value:any):Workspace {
 for(const key of ['favorites','recipes','requests','environments'])if(!Array.isArray(value[key]))throw Error(key+' 应为数组');
 if(!value.favorites.every(v=>typeof v==='string'))throw Error('收藏应为工具 ID 数组');
 value.recipes=value.recipes.map(r=>{if(!r||typeof r.name!=='string')throw Error('配方缺少名称');const recipe=r.recipe||r.steps?.flatMap(s=>s.type?.startsWith('chef')?[{op:s.op,args:s.args}]:migrateLegacyStep(s));if(!recipe)throw Error('配方缺少步骤');const check=validateRecipe({input:{type:'text',value:''},recipe},{allowNetwork:true});if(check.ok===false)throw Error(check.error.message);return {id:typeof r.id==='string'?r.id:crypto.randomUUID(),name:r.name,input:typeof r.input==='string'?r.input:'',recipe};});
 value.requests=value.requests.map(r=>{if(!r||typeof r.url!=='string'||typeof r.method!=='string')throw Error('请求缺少 URL 或方法');return {...blankRequest(r.id||crypto.randomUUID()),...r};});
 value.environments=value.environments.map(e=>{if(!e||typeof e.name!=='string'||!Array.isArray(e.rows))throw Error('环境数据格式无效');return e;});
 value.settings=value.settings&&typeof value.settings==='object'&&!Array.isArray(value.settings)?value.settings:{};
 return value;
}
export const workspace={
 create:():Workspace=>({format:'morndream-workspace',schemaVersion:2,favorites:[],recipes:[],requests:[],environments:[],settings:{}}),
 import(input:unknown):Workspace {const data=typeof input==='string'?JSON.parse(input):structuredClone(input);if(!data||typeof data!=='object')throw Error('工作区格式无效');if(data.format==='morndream-workspace'){if(data.schemaVersion!==2)throw Error('不支持的工作区版本：'+data.schemaVersion);return normalize(data);}
 const result=workspace.create();if(data.format==='morn-api-workspace'){result.requests=data.saved||[];result.environments=data.environments||[];}else if(data.version===1&&Array.isArray(data.favorites)){result.favorites=data.favorites;result.recipes=data.saved||[];result.settings=Object.fromEntries(['auto','wrap','dark'].filter(k=>data[k]!==undefined).map(k=>[k,data[k]]));}else throw Error('不支持的备份格式');return normalize(result);},
 export(value:Workspace){const result=workspace.import(value);result.requests=result.requests.map(sanitizeRequest);result.environments=result.environments.map(e=>({...e,rows:e.rows.map(v=>({...v,value:v.secret||sensitive.test(v.key)?'':v.value}))}));return JSON.stringify(result,null,2);}
};

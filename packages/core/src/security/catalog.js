/** @type {Array<[string,string,string,string,Record<string,any>]>} */
const rows=[
 ['security.headers','安全响应头','Security Headers','分析 CSP、HSTS 与安全响应头',{context:{enum:['complete','browser'],default:'complete'}}],
 ['security.csp','CSP 策略检查','CSP Evaluator','识别内容安全策略中的配置问题',{}],
 ['security.jwt','JWT 调试器','JWT Sign / Verify','解析、签名、验签和声明约束',{action:{enum:['decode','verify','sign'],default:'decode'},algorithm:{enum:['HS256','HS384','HS512','RS256','PS256','ES256','EdDSA'],default:'HS256'},key:{type:'string',default:''},issuer:{type:'string',default:''},audience:{type:'string',default:''},clockTolerance:{type:'integer',minimum:0,maximum:300,default:0}}],
 ['security.certificate','证书查看器','X.509 / PEM','查看证书链、有效期、SAN 和指纹',{}],
 ['security.password','口令强度分析','Password Strength','本地估计猜测难度，不输出口令',{userInputs:{type:'array',items:{type:'string'},maxItems:30,default:[]}}],
 ['security.report','扫描报告查看器','Gitleaks / Nuclei / SARIF','解析、筛选和脱敏安全报告',{format:{enum:['auto','gitleaks','nuclei','sarif'],default:'auto'},redact:{type:'boolean',default:true}}]
];
export const securityTools=rows.map(([id,name,en,desc,params])=>({id,name,en,desc,cat:'security',ic:'shield',params}));

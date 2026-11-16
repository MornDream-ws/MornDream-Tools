const number=(label,value,min=0,max=100,step=1)=>({type:'number',label,value,min,max,step});
const choice=(label,value,values)=>({type:'select',label,value,values});
const text=(label,value='')=>({type:'text',label,value});
const color=(label,value='#ffffff')=>({type:'color',label,value});
const check=(label,value=false)=>({type:'checkbox',label,value});
const quality=number('输出质量',85,1,100);
const format=choice('输出格式','image/png',[['image/png','PNG'],['image/jpeg','JPG'],['image/webp','WebP']]);
export const imageTools=[
 {id:'compress',name:'图片压缩',group:'优化与尺寸',desc:'调整质量和尺寸，比较前后体积',fields:{format:{...format,value:'image/jpeg'},quality,maxEdge:number('最大边（0 保持原尺寸）',0,0,16000)}},
 {id:'upscale',name:'图片放大',group:'优化与尺寸',desc:'重采样放大与锐化，不生成不存在的细节',fields:{scale:choice('放大倍率',2,[[2,'2×'],[3,'3×'],[4,'4×']]),sharpen:number('锐化强度',30,0,100)}},
 {id:'background',name:'背景移除',group:'优化与尺寸',desc:'BiRefNet 本地 AI 抠图，首次下载约 224 MB 模型',ai:true,fields:{transparent:check('透明背景',true),background:color('填充背景色')}},
 {id:'resize',name:'修改尺寸',group:'优化与尺寸',desc:'按像素或百分比缩放，支持比例锁定',fields:{resizeMode:choice('缩放方式','pixels',[['pixels','指定像素'],['percent','百分比']]),width:number('宽度（像素）',800,1,16000),height:number('高度（像素）',600,1,16000),lock:check('按宽度保持比例',true),percent:number('缩放百分比',50,1,400)}},
 {id:'crop',name:'图片裁剪',group:'基础编辑',desc:'在预览上拖动框选，或填写精确坐标',single:true,fields:{ratio:choice('裁剪比例','free',[['free','自由'],['1','1:1'],['1.7777778','16:9'],['0.75','3:4']]),x:number('左侧 X',0,0,16000),y:number('顶部 Y',0,0,16000),width:number('裁剪宽度',400,1,16000),height:number('裁剪高度',300,1,16000)}},
 {id:'rotate',name:'旋转与翻转',group:'基础编辑',desc:'任意角度旋转，自动扩展画布',fields:{angle:number('旋转角度',90,-360,360),flipX:check('水平翻转'),flipY:check('垂直翻转')}},
 {id:'editor',name:'照片编辑',group:'基础编辑',desc:'调色、滤镜、文字与边框，预览参数效果',single:true,fields:{brightness:number('亮度',100,0,200),contrast:number('对比度',100,0,200),saturation:number('饱和度',100,0,200),warmth:number('色温',0,-100,100),filter:choice('滤镜','none',[['none','原色'],['grayscale','黑白'],['sepia','复古'],['invert','反色']]),caption:text('文字'),fontSize:number('字号',40,8,500),textColor:color('文字颜色','#ffffff'),textY:number('文字纵向位置（%）',85,0,100),border:number('边框宽度',0,0,200),borderColor:color('边框颜色')}},
 {id:'to-jpg',name:'转为 JPG',group:'格式与导出',desc:'转换为 JPEG，透明区域填充指定颜色',fields:{quality,background:color('背景色')}},
 {id:'from-jpg',name:'JPG 转其他格式',group:'格式与导出',desc:'导出 PNG、WebP 或静态 GIF，也接受其他可解码图片',fields:{format:choice('输出格式','image/png',[['image/png','PNG'],['image/webp','WebP'],['image/gif','GIF']]),quality}},
 {id:'pdf',name:'图片转 PDF',group:'格式与导出',desc:'按文件栏顺序合并，每张图片一页',combine:true,fields:{paper:choice('纸张','a4',[['a4','A4'],['letter','Letter'],['image','图片尺寸']]),landscape:check('横向纸张'),margin:number('页边距（毫米）',10,0,50)}},
 {id:'html',name:'HTML 转图片',group:'开发辅助',desc:'隔离渲染 HTML/CSS，禁止脚本和外部资源',noInput:true,single:true,fields:{width:number('画布宽度',800,32,4096),height:number('画布高度',450,32,4096),scale:choice('导出倍率',1,[[1,'1×'],[2,'2×'],[3,'3×']]),format,quality}},
 {id:'meme',name:'表情包制作',group:'创作与隐私',desc:'设置上下字幕、位置、颜色与描边',single:true,fields:{top:text('顶部字幕','当我打开工具站'),bottom:text('底部字幕','事情变得简单了'),fontSize:number('字号',40,8,500),textColor:color('文字颜色','#ffffff'),strokeColor:color('描边颜色','#000000'),stroke:number('描边宽度',3,0,20),topY:number('顶部字幕位置（%）',10,0,100),bottomY:number('底部字幕位置（%）',90,0,100)}},
 {id:'gif',name:'GIF 制作',group:'创作与隐私',desc:'选中图片按顺序合成动画，文件栏可设置逐帧时长',combine:true,fields:{width:number('输出宽度',640,1,2048),height:number('输出高度',480,1,2048),delay:number('默认帧时长（毫秒）',300,20,10000,10),repeat:number('循环次数（0 为无限）',0,0,100),background:color('画布背景色')}},
 {id:'palette',name:'调色板与取色',group:'创作与隐私',desc:'提取主色；点击图片拾取精确颜色',single:true,fields:{colors:number('主色数量',6,2,16)}},
 {id:'exif',name:'清除 EXIF',group:'创作与隐私',desc:'查看元数据，无损清理 JPEG/PNG/WebP 的隐私信息',fields:{}},
 {id:'face',name:'人脸模糊',group:'创作与隐私',desc:'自动检测或在预览上拖动添加区域，执行后导出',single:true,ai:true,fields:{effect:choice('遮盖方式','pixelate',[['pixelate','马赛克'],['blur','模糊']]),strength:number('遮盖强度',20,5,100)}},
 {id:'watermark',name:'图片水印',group:'创作与隐私',desc:'文字或本地 Logo，支持批量和平铺',fields:{watermarkType:choice('水印类型','text',[['text','文字'],['logo','Logo 图片']]),caption:text('水印文字','MornDream'),fontSize:number('文字大小 / Logo 宽度（%）',8,1,50),opacity:number('不透明度',40,1,100),position:choice('位置','bottom-right',[['top-left','左上'],['top-right','右上'],['center','居中'],['bottom-left','左下'],['bottom-right','右下']]),tile:check('平铺水印'),textColor:color('文字颜色','#ffffff')}},
 {id:'favicon',name:'网站图标生成',group:'开发辅助',desc:'导出 ICO、Apple/Android 图标、manifest 和 HTML',single:true,fields:{padding:number('留白比例（%）',10,0,40),transparent:check('透明背景',true),background:color('背景色')}},
 {id:'base64',name:'图片转 Base64',group:'开发辅助',desc:'原始字节编码为 Data URI 或代码片段',fields:{snippet:choice('片段格式','uri',[['uri','Data URI'],['html','HTML'],['css','CSS'],['markdown','Markdown']])}}
];
export const groups=[...new Set(imageTools.map(t=>t.group))];
export const defaults=id=>Object.fromEntries(Object.entries(imageTools.find(t=>t.id===id).fields).map(([k,f])=>[k,f.value]));
export function validateImageParams(id,p){const tool=imageTools.find(t=>t.id===id);if(!tool)throw Error('未知图片工具');const values={...defaults(id),...p};for(const [key,f]of Object.entries(tool.fields)){const v=values[key];if(f.type==='number'&&(!Number.isFinite(Number(v))||Number(v)<f.min||Number(v)>f.max))throw Error(f.label+' 超出范围');if(f.type==='select'&&!f.values.some(([x])=>String(x)===String(v)))throw Error(f.label+' 无效');if(f.type==='color'&&!/^#[\da-f]{6}$/i.test(v))throw Error(f.label+' 无效');}return values;}

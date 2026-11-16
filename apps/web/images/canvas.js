import {checkSize} from './binary.js';
export function canvas(width,height){const [w,h]=checkSize(width,height);return new OffscreenCanvas(w,h);}
export async function decode(blob){try{return await createImageBitmap(blob,{imageOrientation:'from-image'});}catch{throw Error('浏览器无法解码此图片格式，请转换为 PNG/JPG/WebP 后重试');}}
export async function encode(c,type='image/png',quality=85){const blob=await c.convertToBlob({type,quality:Number(quality)/100});if(blob.type!==type)throw Error('当前浏览器不支持输出 '+type);return blob;}
export function drawFit(ctx,image,w,h){const scale=Math.min(w/image.width,h/image.height);const dw=image.width*scale,dh=image.height*scale;ctx.drawImage(image,(w-dw)/2,(h-dh)/2,dw,dh);}
export function textLines(ctx,text,x,y,width,size,{color='#fff',stroke='#000',line=0,align='center'}={}){ctx.font=`bold ${size}px sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.lineJoin='round';const lines=String(text).split('\n');lines.forEach((t,i)=>{const yy=y+(i-(lines.length-1)/2)*size*1.2;if(line)ctx.strokeText(t,x,yy,width);ctx.fillText(t,x,yy,width);});}

import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const out=new URL('../public/demo/assets/sprites/',import.meta.url);
await mkdir(out,{recursive:true});
const groups=[{file:'characters',seed:[698,152],rects:{me:[134,0,300,601],lana:[623,0,268,611],pere:[1116,0,275,611],maria:[185,610,224,414],kitten:[606,719,273,297],pablo:[1096,615,350,402],'head-me':[229,4,120,143],'head-lana':[683,8,146,160],'head-pere':[1190,0,141,166],'head-maria':[205,610,172,156],'head-kitten':[641,738,212,184]}},{file:'club-action',rects:{angry:[8,91,504,817],run:[508,121,505,750],attacker:[1013,120,523,790]}}];
const manifest={};
for(const group of groups){
 const {data,info}=await sharp(fileURLToPath(new URL('../public/demo/assets/'+group.file+'.png',import.meta.url))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h}=info,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
 function offer(n){if(n<0||n>=w*h||seen[n])return;seen[n]=1;const j=n*4,r=data[j],g=data[j+1],b=data[j+2];if(Math.min(r,g,b)<163||Math.max(r,g,b)-Math.min(r,g,b)>22)return;queue[tail++]=n;}
 for(let x=0;x<w;x++){offer(x);offer((h-1)*w+x);}for(let y=0;y<h;y++){offer(y*w);offer(y*w+w-1);}if(group.seed)offer(group.seed[1]*w+group.seed[0]);
 while(head<tail){const n=queue[head++],x=n%w;data[n*4+3]=0;if(x>0)offer(n-1);if(x<w-1)offer(n+1);offer(n-w);offer(n+w);}
 for(const [key,[left,top,width,height]] of Object.entries(group.rects)){
  const file=key+'.png';await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left,top,width,height}).png().toFile(fileURLToPath(new URL(file,out)));manifest[key]={file,width,height};
 }
}
await writeFile(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log('Generated 14 transparent, individually cropped sprites.');

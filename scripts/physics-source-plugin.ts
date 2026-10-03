import type {Plugin} from 'vite';
import {readFile} from 'node:fs/promises';
import {localPhysicsSource} from './physics-local-source.mjs';
/** Reuse the local-source adapter. No source PDF/text/image is copied into a production build. */
export function physicsSourcePlugin():Plugin{
 let pages:Promise<string[]>|undefined;
 return {name:'local-physics-source',apply:'serve',configureServer(server){server.middlewares.use(async(req,res,next)=>{
  const pathname=new URL(req.url??'/', 'http://127.0.0.1').pathname;if(!pathname.startsWith('/__physics/')){next();return;}
  if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress??'')){res.statusCode=403;res.end();return;}
  if(!['GET','HEAD'].includes(req.method??'')){res.statusCode=405;res.end();return;}
  try{if(await localPhysicsSource(req,res,pathname))return;const match=pathname.match(/^\/__physics\/page\/(\d+)$/);if(match){const n=Number(match[1]);if(!Number.isInteger(n)||n<1||n>1069){res.statusCode=404;res.end();return;}
   pages??=readFile(new URL('../../tmp/pdfs/physics-reading/pages.json',import.meta.url),'utf8').then(JSON.parse).catch(e=>{pages=undefined;throw e;});const text=(await pages)[n-1];res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?'':JSON.stringify({text,pdf:n,kind:'previous-full-text-extraction-verified-identical-to-downloaded-original'}));return;}
   res.statusCode=404;res.end();
  }catch{res.statusCode=503;res.end('로컬 교재 원문을 열지 못했다. 읽기 위치와 메모는 유지한다.');}
 });}};
}

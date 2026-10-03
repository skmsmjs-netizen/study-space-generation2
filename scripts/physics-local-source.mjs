import {homedir} from 'node:os';
import {createHash} from 'node:crypto';
import {stat,readFile,mkdir} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
const run=promisify(execFile);
export const source=`${homedir()}/.cache/manseeksong-os/sources/radi-rasmussen-2013/Principles of Physics For Scientist and Engineer.pdf`;
const expectedHash='67f606ca1ec0bc93c593d2f90df2b0fc4a9e1159add89de6df0a11b12bc913b1';
const folder=`${homedir()}/.cache/manseeksong-os/sources/radi-rasmussen-2013/pages-`+expectedHash;
let checkedSignature='',checkedReady=false;
const renderer=`${homedir()}/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/pdftoppm`;
const inflight=new Map();
export async function pdfReady(){try{const s=await stat(source);if(s.size!==63824473||s.blocks===0)return false;const signature=`${s.size}:${s.mtimeMs}:${s.ctimeMs}`;if(signature!==checkedSignature){checkedReady=createHash('sha256').update(await readFile(source)).digest('hex')===expectedHash;checkedSignature=signature;}return checkedReady;}catch{return false;}}
export async function localPhysicsSource(req,res,pathname){
 if(pathname==='/__physics/status'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({pdfAvailable:await pdfReady(),extractedPages:1069,sourceCopy:'verified-local-copy'}));return true;}
 const m=pathname.match(/^\/__physics\/image\/(\d+)$/);
 if(m){const page=Number(m[1]);if(!Number.isInteger(page)||page<1||page>1069){res.writeHead(404);res.end();return true;}if(!await pdfReady()){res.writeHead(503);res.end('원본 PDF의 다운로드를 확인해야 한다.');return true;}
 const prefix=path.join(folder,`pdf-${page}`),file=prefix+'.png';
 try{await stat(file);}catch{if(!inflight.has(page)){const job=(async()=>{await mkdir(folder,{recursive:true});await run(renderer,['-f',String(page),'-l',String(page),'-scale-to','1800','-singlefile','-png',source,prefix],{timeout:30000,maxBuffer:1024*1024});})();inflight.set(page,job);job.finally(()=>inflight.delete(page)).catch(()=>{});}try{await inflight.get(page);}catch{res.writeHead(503);res.end('원본 페이지 렌더링 실패');return true;}}
 if(req.method==='HEAD'){res.setHeader('Content-Type','image/png');res.end();return true;}const bytes=await readFile(file);res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','private, max-age=3600');res.end(bytes);return true;}
 if(pathname==='/__physics/source.pdf'){if(!await pdfReady()){res.writeHead(503);res.end('원본 PDF의 다운로드를 확인해야 한다.');return true;}
 const s=await stat(source),r=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);res.setHeader('Content-Type','application/pdf');res.setHeader('Accept-Ranges','bytes');if(req.method==='HEAD'){res.setHeader('Content-Length',s.size);res.end();return true;}
 if(r){const start=Number(r[1]),end=Math.min(s.size-1,r[2]?Number(r[2]):s.size-1);if(start>=s.size||end<start){res.writeHead(416,{'Content-Range':`bytes */${s.size}`});res.end();return true;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${s.size}`,'Content-Length':end-start+1});createReadStream(source,{start,end}).pipe(res);}else{res.setHeader('Content-Length',s.size);createReadStream(source).pipe(res);}return true;}
 return false;
}

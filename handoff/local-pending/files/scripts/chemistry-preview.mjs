import {createServer} from 'vite';
import {statSync,createReadStream} from 'node:fs';
import path from 'node:path';
const source='/Users/manseeksong/Library/Mobile Documents/com~apple~CloudDocs/산출물/General Chemistry.pdf';
const port=Number(process.env.CHEMISTRY_PORT||5827);
const server=await createServer({server:{host:'127.0.0.1',port,strictPort:true},plugins:[{name:'chemistry-local-source-only',configureServer(s){s.middlewares.use((req,res,next)=>{if(req.url?.split('?')[0]!=='/__chemistry-source/pdf')return next();if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress??'')){res.statusCode=403;res.end();return;}try{const stat=statSync(source);res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Length',stat.size);res.setHeader('Cache-Control','no-store');if(req.method==='HEAD'){res.end();return;}if(req.method!=='GET'){res.statusCode=405;res.end();return;}createReadStream(source).pipe(res);}catch{res.statusCode=404;res.end('Local source unavailable');}});}}]});
await server.listen();server.printUrls();

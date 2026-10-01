import {readFileSync,writeFileSync,mkdirSync,symlinkSync,existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const lab=new URL('./lab/dist/',import.meta.url);const site=process.env.COLOR_TEST_SITE?pathToFileURL(path.resolve(process.env.COLOR_TEST_SITE)+path.sep):new URL('./site/',import.meta.url);mkdirSync(site,{recursive:true});
let html=readFileSync(new URL('index.html',lab),'utf8');
html=html.replace(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,(_,src)=>'<script type="module">'+readFileSync(new URL(src.replace(/^\//,''),lab),'utf8').replaceAll('</script','<\\/script')+'</script>');
html=html.replace(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g,(_,src)=>'<style>'+readFileSync(new URL(src.replace(/^\//,''),lab),'utf8')+'</style>');
writeFileSync(new URL('color-check.html',site),html);
const target=new URL('study-space-generation2',site);if(!existsSync(target))symlinkSync(process.env.COLOR_TEST_APP||new URL('../../dist',import.meta.url).pathname,target,'dir');
if(process.argv.includes('--serve')){
 const {preview}=await import('vite');
 await preview({configFile:false,base:'/',build:{outDir:process.env.COLOR_TEST_SITE},preview:{host:'127.0.0.1',port:Number(process.env.COLOR_TEST_PORT),strictPort:true}});
}

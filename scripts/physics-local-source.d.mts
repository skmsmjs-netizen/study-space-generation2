import type {IncomingMessage,ServerResponse} from 'node:http';
export const source:string;
export function pdfReady():Promise<boolean>;
export function localPhysicsSource(req:IncomingMessage,res:ServerResponse,pathname:string):Promise<boolean>;

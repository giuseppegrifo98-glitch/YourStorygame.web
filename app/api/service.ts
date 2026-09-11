import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
export class HttpError extends Error { constructor(public status: number, public code: string) { super(code); } }
export function db() { if (!env.DB) throw new HttpError(503,'storage_unavailable'); return env.DB; }
export function files() { const binding = (env as unknown as {FILES?: R2Bucket}).FILES; if (!binding) throw new HttpError(503,'storage_unavailable'); return binding; }
export function json(data: unknown, status = 200) { return Response.json(data,{status,headers:{'Cache-Control':'no-store'}}); }
export async function safe(work: () => Promise<Response>) { try { return await work(); } catch(e) { if(e instanceof HttpError) return json({error:e.code},e.status); console.error('Story operation failed',e); return json({error:'storage_unavailable'},503); } }
export async function identity(request?: Request) { const user = await getChatGPTUser(); if (!user) throw new HttpError(401,'sign_in_required'); if(request && !['GET','HEAD'].includes(request.method)) { const origin = request.headers.get('origin'); if(!origin || origin !== new URL(request.url).origin) throw new HttpError(403,'invalid_origin'); } return user.userId; }
export type ProjectRow = {id:string;owner_id:string;title:string;data:string;revision:number;created_at:number;updated_at:number};
export async function owned(id:string, owner:string) { const row = await db().prepare('SELECT * FROM projects WHERE id = ? AND owner_id = ?').bind(id,owner).first<ProjectRow>(); if(!row) throw new HttpError(404,'not_found'); return row; }
export async function body(request:Request) { if(Number(request.headers.get('content-length')||0)>15000) throw new HttpError(413,'too_large'); const raw=await request.text(); if(raw.length>15000) throw new HttpError(413,'too_large'); try{return JSON.parse(raw);}catch{throw new HttpError(400,'invalid_input');} }

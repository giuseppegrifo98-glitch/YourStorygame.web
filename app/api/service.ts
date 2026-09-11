import { getCurrentUser } from '../auth';
import { getDb } from '../../lib/storage';
export class HttpError extends Error { constructor(public status: number, public code: string) { super(code); } }
export function db() { try { return getDb(); } catch (error) { console.error('Storage unavailable', error); throw new HttpError(503,'storage_unavailable'); } }
export function json(data: unknown, status = 200) { return Response.json(data,{status,headers:{'Cache-Control':'no-store'}}); }
export async function safe(work: () => Promise<Response>) { try { return await work(); } catch(e) { if(e instanceof HttpError) return json({error:e.code},e.status); console.error('Story operation failed',e); return json({error:'storage_unavailable'},503); } }
export async function identity(request?: Request) { const user = await getCurrentUser(); if (!user) throw new HttpError(401,'sign_in_required'); if(request && !['GET','HEAD'].includes(request.method)) { const origin = request.headers.get('origin'); if(origin && new URL(origin).host !== request.headers.get('host')) throw new HttpError(403,'invalid_origin'); } return user.userId; }
export type ProjectRow = {id:string;owner_id:string;title:string;data:string;revision:number;created_at:number;updated_at:number};
export async function owned(id:string, owner:string) { const row = db().prepare('SELECT * FROM projects WHERE id = ? AND owner_id = ?').get(id,owner) as ProjectRow | undefined; if(!row) throw new HttpError(404,'not_found'); return row; }
export async function body(request:Request) { if(Number(request.headers.get('content-length')||0)>15000) throw new HttpError(413,'too_large'); const raw=await request.text(); if(raw.length>15000) throw new HttpError(413,'too_large'); try{return JSON.parse(raw);}catch{throw new HttpError(400,'invalid_input');} }

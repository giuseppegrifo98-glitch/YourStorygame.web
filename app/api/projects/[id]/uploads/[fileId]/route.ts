import { db, files, identity, json, safe, owned, HttpError } from '../../../../service';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string,fileId:string}>};
async function get(context:Context,request?:Request){const{id,fileId}=await context.params;await owned(id,await identity(request));const row=await db().prepare('SELECT object_key, type FROM uploads WHERE id = ? AND project_id = ?').bind(fileId,id).first<{object_key:string,type:string}>();if(!row)throw new HttpError(404,'not_found');return{row,fileId,id};}
export async function GET(_:Request,context:Context){return safe(async()=>{const{row}=await get(context);const obj=await files().get(row.object_key);if(!obj)throw new HttpError(404,'not_found');return new Response(obj.body,{headers:{'Content-Type':row.type,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});});}
export async function DELETE(request:Request,context:Context){return safe(async()=>{const{row,fileId,id}=await get(context,request);await files().delete(row.object_key);await db().prepare('DELETE FROM uploads WHERE id = ? AND project_id = ?').bind(fileId,id).run();return json({deleted:true});});}

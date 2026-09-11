import { body, db, identity, json, safe, owned, HttpError } from '../../service';
import { storySchema } from '../../../site/story';
import { z } from 'zod';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_:Request, context:Context) { return safe(async()=>{const row=await owned((await context.params).id,await identity()); return json({id:row.id,data:JSON.parse(row.data),revision:row.revision});}); }
export async function PUT(request:Request,context:Context) { return safe(async()=>{const owner=await identity(request);const {id}=await context.params; await owned(id,owner);const parsed=z.object({data:storySchema,revision:z.number().int().nonnegative()}).safeParse(await body(request));if(!parsed.success) throw new HttpError(400,'invalid_input'); const {data,revision}=parsed.data;const title=data.from && data.to ? `${data.from} & ${data.to}`:'';const result=await db().prepare('UPDATE projects SET data = ?, title = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND owner_id = ? AND revision = ?').bind(JSON.stringify(data),title,Date.now(),id,owner,revision).run();if(!result.meta.changes) throw new HttpError(409,'revision_conflict');return json({revision:revision+1});}); }

import { readFile, unlink } from 'node:fs/promises';
import { db, identity, json, safe, owned, HttpError } from '../../../../service';
import { uploadPath } from '../../../../../../lib/storage';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string; fileId: string }> };

async function getUpload(context: Context, request?: Request) {
  const { id, fileId } = await context.params;
  await owned(id, await identity(request));
  const row = db().prepare('SELECT object_key, type FROM uploads WHERE id = ? AND project_id = ?').get(fileId, id) as { object_key: string; type: string } | undefined;
  if (!row) throw new HttpError(404, 'not_found');
  return { row, id, fileId };
}

export async function GET(_: Request, context: Context) {
  return safe(async () => {
    const { row, id } = await getUpload(context);
    const bytes = await readFile(uploadPath(id, row.object_key));
    return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': row.type, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
  });
}

export async function DELETE(request: Request, context: Context) {
  return safe(async () => {
    const { row, id, fileId } = await getUpload(context, request);
    await unlink(uploadPath(id, row.object_key)).catch(() => undefined);
    db().prepare('DELETE FROM uploads WHERE id = ? AND project_id = ?').run(fileId, id);
    return json({ deleted: true });
  });
}

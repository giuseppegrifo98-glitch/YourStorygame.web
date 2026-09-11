import { writeFile } from 'node:fs/promises';
import { db, identity, json, safe, owned, HttpError } from '../../../service';
import { uploadPath } from '../../../../../lib/storage';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  return safe(async () => {
    const { id } = await context.params;
    await owned(id, await identity());
    const result = db().prepare('SELECT id, name, type, size FROM uploads WHERE project_id = ? ORDER BY created_at').all(id);
    return json(result);
  });
}

export async function POST(request: Request, context: Context) {
  return safe(async () => {
    const owner = await identity(request);
    const { id } = await context.params;
    await owned(id, owner);
    if (Number(request.headers.get('content-length') || 0) > 9 * 1024 * 1024) throw new HttpError(413, 'file_too_large');
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024 || file.size === 0) {
      throw new HttpError(400, 'invalid_file');
    }
    const count = db().prepare('SELECT COUNT(*) AS count FROM uploads WHERE project_id = ?').get(id) as { count: number };
    if (count.count >= 10) throw new HttpError(409, 'upload_limit');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const valid = file.type === 'image/jpeg'
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : file.type === 'image/png'
        ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
        : Buffer.from(bytes.subarray(0, 4)).toString('ascii') === 'RIFF' && Buffer.from(bytes.subarray(8, 12)).toString('ascii') === 'WEBP';
    if (!valid) throw new HttpError(400, 'invalid_file');
    const fileId = crypto.randomUUID();
    const name = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 150) || 'reference-image';
    const path = uploadPath(id, fileId);
    await writeFile(path, bytes, { flag: 'wx' });
    try {
      db().prepare('INSERT INTO uploads (id, project_id, object_key, name, type, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
        fileId, id, fileId, name, file.type, file.size, Date.now(),
      );
    } catch (error) {
      const { unlink } = await import('node:fs/promises');
      await unlink(path).catch(() => undefined);
      throw error;
    }
    return json({ id: fileId, name, type: file.type, size: file.size }, 201);
  });
}

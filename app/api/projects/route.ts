import { body, db, identity, json, safe, HttpError } from '../service';
import { emptyStory } from '../../site/story';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return safe(async () => {
    const owner = await identity();
    const rows = db().prepare('SELECT id, title, revision, updated_at FROM projects WHERE owner_id = ? ORDER BY updated_at DESC').all(owner);
    return json(rows);
  });
}

export async function POST(request: Request) {
  return safe(async () => {
    const owner = await identity(request);
    const input = await body(request) as { language?: string };
    const count = db().prepare('SELECT COUNT(*) AS count FROM projects WHERE owner_id = ?').get(owner) as { count: number };
    if (count.count >= 30) throw new HttpError(409, 'project_limit');
    const id = crypto.randomUUID();
    const now = Date.now();
    const data = { ...emptyStory, language: input.language === 'en' ? 'en' : 'de' };
    db().prepare('INSERT INTO projects (id, owner_id, title, data, revision, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)').run(
      id, owner, '', JSON.stringify(data), now, now,
    );
    return json({ id }, 201);
  });
}

import { NextResponse } from 'next/server';
import { body, HttpError, safe } from '../../service';
import { createSession, createUser, findUser, verifyPassword, SESSION_COOKIE } from '../../../../lib/auth';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return safe(async () => {
    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== request.headers.get('host')) throw new HttpError(403, 'invalid_origin');
    const input = await body(request) as { mode?: 'login' | 'register'; email?: string; password?: string; name?: string };
    const email = input.email?.trim().toLowerCase() || '';
    const password = input.password || '';
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 200) throw new HttpError(400, 'invalid_credentials');
    let user;
    if (input.mode === 'register') {
      if (!input.name?.trim()) throw new HttpError(400, 'name_required');
      try { user = createUser(email, password, input.name); } catch { throw new HttpError(409, 'email_exists'); }
    } else {
      const found = findUser(email);
      if (!found || !verifyPassword(password, found.password_hash)) throw new HttpError(401, 'invalid_credentials');
      user = { id: found.id, email: found.email, displayName: found.display_name };
    }
    const response = NextResponse.json({ ok: true, email: user.email });
    response.cookies.set({ name: SESSION_COOKIE, value: createSession(user.id), httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
    return response;
  });
}

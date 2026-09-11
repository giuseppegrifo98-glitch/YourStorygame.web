import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteSession, SESSION_COOKIE } from '../../lib/auth';

export async function GET(request: Request) {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (session) deleteSession(session);
  store.delete(SESSION_COOKIE);
  const value = new URL(request.url).searchParams.get('return_to') || '/';
  const returnTo = value.startsWith('/') && !value.startsWith('//') ? value : '/';
  return NextResponse.redirect(new URL(returnTo, request.url));
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../lib/storage";
import { SESSION_COOKIE } from "../lib/auth";

export type AppUser = { userId: string; displayName: string; email: string; fullName: string | null };

export async function getCurrentUser(): Promise<AppUser | null> {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const row = getDb().prepare(`SELECT users.id, users.email, users.display_name FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.id = ? AND sessions.expires_at > ?`).get(sessionId, Date.now()) as { id: string; email: string; display_name: string } | undefined;
  if (!row) return null;
  return { userId: row.id, displayName: row.display_name, email: row.email, fullName: row.display_name };
}

export async function requireUser(returnTo: string): Promise<AppUser> {
  const user = await getCurrentUser();
  if (user) return user;
  redirect(signInPath(returnTo));
}

export function signInPath(returnTo: string) { return `/login?return_to=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`; }
export function signOutPath(returnTo = "/") { return `/logout?return_to=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`; }
function safeRelativeReturnPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  try { const url = new URL(value, "https://app.local"); return url.origin === "https://app.local" ? `${url.pathname}${url.search}${url.hash}` : "/"; } catch { return "/"; }
}

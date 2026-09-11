import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./storage";

export const SESSION_COOKIE = "yourstory_session";
const SESSION_DAYS = 30;

export type UserRow = { id: string; email: string; display_name: string };

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, encoded: string) {
  const [salt, expected] = encoded.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer);
}

export function createUser(email: string, password: string, displayName: string) {
  const db = getDb();
  const id = randomUUID();
  const now = Date.now();
  db.prepare("INSERT INTO users (id, email, display_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
    id,
    normalizeEmail(email),
    displayName.trim().slice(0, 80),
    hashPassword(password),
    now,
  );
  return { id, email: normalizeEmail(email), displayName: displayName.trim().slice(0, 80) };
}

export function findUser(email: string) {
  return getDb().prepare("SELECT id, email, display_name, password_hash FROM users WHERE email = ?").get(normalizeEmail(email)) as
    | (UserRow & { password_hash: string })
    | undefined;
}

export function createSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  const now = Date.now();
  getDb().prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").run(
    id,
    userId,
    now + SESSION_DAYS * 24 * 60 * 60 * 1000,
    now,
  );
  return id;
}

export function deleteSession(sessionId: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

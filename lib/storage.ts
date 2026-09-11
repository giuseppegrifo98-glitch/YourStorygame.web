import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

let connection: DatabaseSync | undefined;

export function storageRoot() {
  return process.env.YOURSTORY_DATA_DIR || join(process.cwd(), "data");
}

export function getDb() {
  if (!connection) {
    const root = storageRoot();
    mkdirSync(root, { recursive: true });
    connection = new DatabaseSync(join(root, "yourstory.sqlite"));
    connection.exec(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        data TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_projects_owner_updated ON projects(owner_id, updated_at);
      CREATE TABLE IF NOT EXISTS uploads (
        id TEXT PRIMARY KEY NOT NULL,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        object_key TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_uploads_project ON uploads(project_id);
    `);
  }
  return connection;
}

export function uploadsRoot() {
  const root = join(storageRoot(), "uploads");
  mkdirSync(root, { recursive: true });
  return root;
}

export function projectUploadsRoot(projectId: string) {
  const root = join(uploadsRoot(), projectId);
  mkdirSync(root, { recursive: true });
  return root;
}

export function uploadPath(projectId: string, fileId: string) {
  return join(projectUploadsRoot(projectId), fileId);
}

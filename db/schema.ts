// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
export {};
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const projects = sqliteTable('projects', {
 id: text('id').primaryKey(), ownerId: text('owner_id').notNull(), title: text('title').notNull(),
 data: text('data').notNull(), revision: integer('revision').notNull().default(0),
 createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [index('idx_projects_owner_updated').on(table.ownerId, table.updatedAt)]);
export const uploads = sqliteTable('uploads', {
 id: text('id').primaryKey(), projectId: text('project_id').notNull().references(() => projects.id),
 objectKey: text('object_key').notNull(), name: text('name').notNull(), type: text('type').notNull(),
 size: integer('size').notNull(), createdAt: integer('created_at').notNull(),
}, table => [index('idx_uploads_project').on(table.projectId)]);
export const gifts = sqliteTable('gifts', {
 code: text('code').primaryKey(), projectId: text('project_id').notNull().references(() => projects.id),
 snapshot: text('snapshot').notNull(), createdAt: integer('created_at').notNull(),
}, table => [index('idx_gifts_project').on(table.projectId)]);

// app/infra/db/schema.ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tasks = sqliteTable('tasks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  title: text('title').notNull(),
  description: text('description'),

  status: text('status')
    .notNull()
    .default('todo'), // 'todo' | 'in-progress' | 'done'

  priority: text('priority')
    .notNull()
    .default('medium'), // 'low' | 'medium' | 'high'

  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

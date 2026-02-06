// app/infra/tasks/task.repository.sqlite.ts
import { desc, sql } from 'drizzle-orm';
import type { TaskRepository, TaskInput } from '../../core/tasks/tasks.port';
import type { Task } from '../../core/tasks/tasks.types';
import { db } from '../db/client.sqlite';
import { tasks } from '../db/schema';

export const sqliteTaskRepository: TaskRepository = {
  async listAll(): Promise<Task[]> {
    const rows = db.select().from(tasks).orderBy(desc(tasks.createdAt)).all();

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  },

  async create(input: TaskInput): Promise<Task> {
    const [row] = db
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? null,
        status: 'todo',
        priority: 'medium',
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning()
      .all();

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },
};

// app/infra/tasks/task.repository.sqlite.ts
import { eq } from 'drizzle-orm';
import type { TaskRepository, TaskInput } from '../../core/tasks/tasks.port';
import type { Task } from '../../core/tasks/tasks.types';
import { db } from '../db/client.sqlite';
import { tasks } from '../db/schema';

export const sqliteTaskRepository: TaskRepository = {
  async listAll(): Promise<Task[]> {
    const rows = await db.select().from(tasks).orderBy(tasks.createdAt);

    // Drizzle ya tipa bien los rows, pero los “casteamos” a nuestro tipo de dominio
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
    const now = new Date().toISOString();

    const [row] = await db
      .insert(tasks)
      .values({
        title: input.title,
        description: input.description ?? null,
        status: 'todo', // default inicial
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

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

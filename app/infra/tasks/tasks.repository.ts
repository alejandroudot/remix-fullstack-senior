// app/infra/tasks/task.repository.ts
import type { TaskRepository } from '../../core/tasks/tasks.port';
import { sqliteTaskRepository } from './tasks.repository.sqlite';

// más adelante acá enchufamos supabase/prisma según process.env.DB_PROVIDER
export const taskRepository: TaskRepository = sqliteTaskRepository;

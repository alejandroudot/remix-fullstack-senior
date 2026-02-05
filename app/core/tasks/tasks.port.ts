// app/core/tasks/task.port.ts
import type { Task } from './tasks.types';
import type { z } from 'zod';
import type { taskSchema } from './task.schema';

// input que usamos al crear/editar
export type TaskInput = z.infer<typeof taskSchema>;

export interface TaskRepository {
  listAll(): Promise<Task[]>; // más adelante será listByUser(userId)
  create(input: TaskInput): Promise<Task>;		
}

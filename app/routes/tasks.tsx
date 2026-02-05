// app/routes/tasks.tsx
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
} from 'react-router';

import type { Route } from './+types/tasks';

import { taskSchema } from '../core/tasks/task.schema';
import { taskRepository } from '../infra/tasks/tasks.repository';
import type { Task } from '../core/tasks/tasks.types';

type ActionData =
  | { success: true }
  | { success: false; fieldErrors: Record<string, string | undefined> };

export async function loader(_: Route.LoaderArgs) {
  const tasks = await taskRepository.listAll();
  return { tasks };
}

export async function action({ request }: Route.ActionArgs): Promise<ActionData> {
  const formData = await request.formData();

  const parsed = taskSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string | undefined> = {};

    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === 'string') {
        fieldErrors[path] = issue.message;
      }
    }

    return { success: false, fieldErrors };
  }

  await taskRepository.create(parsed.data);

  return { success: true };
}

export default function TasksPage() {
  const { tasks } = useLoaderData<typeof loader>() as { tasks: Task[] };
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <main className="container mx-auto p-4 space-y-6">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
        <Form  method="post" className="space-y-3 max-w-md">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="font-medium">
              Título
            </label>
            <input
              id="title"
              name="title"
              className="border rounded px-3 py-2"
            />
            {actionData &&
              !actionData.success &&
              actionData.fieldErrors?.title && (
                <p className="text-sm text-red-600">
                  {actionData.fieldErrors.title}
                </p>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className="border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? 'Creando…' : 'Crear task'}
          </button>
        </Form>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Listado</h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay tasks.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border rounded px-3 py-2 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-slate-600">
                      {task.description}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase text-slate-500">
                  {task.status} / {task.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

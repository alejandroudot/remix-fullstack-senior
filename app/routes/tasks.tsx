import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  redirect,
} from 'react-router';

import type { Route } from './+types/tasks';
import { taskRepository } from '../infra/tasks/tasks.repository';
import { taskCreateSchema } from '../core/tasks/task.schema';

type ActionData =
  | { success: false; fieldErrors?: Record<string, string[]> }
  | undefined;

export async function loader(_: Route.LoaderArgs) {
  const tasks = await taskRepository.listAll();
  return { tasks };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const parsed = taskCreateSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    } satisfies ActionData;
  }

  await taskRepository.create(parsed.data);

  // PRG: evita re-submit al refresh, y re-ejecuta loader
  return redirect('/tasks');
}

export default function TasksRoute() {
  const { tasks } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <main className="container mx-auto p-4 space-y-6">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <Form method="post" className="space-y-3 max-w-md">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="font-medium">
              Título
            </label>
            <input id="title" name="title" className="border rounded px-3 py-2" />
            {actionData?.success === false && actionData.fieldErrors?.title?.[0] && (
              <p className="text-sm text-red-600">{actionData.fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-medium">
              Descripción
            </label>
            <textarea id="description" name="description" className="border rounded px-3 py-2" />
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
        <h2 className="text-lg font-semibold">Listado</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="border rounded p-3">
              <div className="font-medium">{task.title}</div>
              {task.description ? <p className="text-sm opacity-80">{task.description}</p> : null}
              <div className="text-xs opacity-60 mt-1">
                {task.status} · {task.priority}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import { createClient } from '@/utils/supabase/client'

export default async function TasksPage() {
  const supabase = createClient()
  const { data: tasks, error } = await supabase.from('tasks').select('*')

  if (error) {
    return <div>Error loading tasks: {error.message}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      {tasks && tasks.length > 0 ? (
        <ul className="list-disc pl-5">
          {tasks.map((task) => (
            <li key={task.id} className="py-2">
              {task.title || JSON.stringify(task)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  )
}

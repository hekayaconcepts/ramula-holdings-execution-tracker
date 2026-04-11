import { createClient } from '@/utils/supabase/client';
import DataTable, { type Column } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default async function TasksPage() {
  const supabase = createClient();
  const { data: tasks, error } = await supabase.from('tasks').select('*');

  if (error) {
    return <div className="text-red-500">Error loading tasks: {error.message}</div>;
  }

  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'priority', label: 'Priority' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Tasks</h1>
      <DataTable columns={columns} data={tasks || []} />
    </div>
  );
}

import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default async function TrackerPage() {
  const supabase = createClient();
  const { data: tasks, error } = await supabase.from('tasks').select('*');

  if (error) {
    return <div className="text-red-500">Error loading tasks: {error.message}</div>;
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'priority', label: 'Priority' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Task Tracker</h1>
      <DataTable columns={columns} data={tasks || []} />
    </div>
  );
}

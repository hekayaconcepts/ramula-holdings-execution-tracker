import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default async function CeoPage() {
  const supabase = createClient();
  const { data: ceoTasks, error } = await supabase.from('ceo_tasks').select('*');

  if (error) {
    return <div className="text-red-500">Error loading CEO tasks: {error.message}</div>;
  }

  const columns = [
    { key: 'task', label: 'Task' },
    { key: 'priority', label: 'Priority' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">CEO Dashboard</h1>
      <DataTable columns={columns} data={ceoTasks || []} />
    </div>
  );
}

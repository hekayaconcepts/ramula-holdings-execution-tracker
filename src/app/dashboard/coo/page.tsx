import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default async function CooPage() {
  const supabase = createClient();
  const { data: cooTasks, error } = await supabase.from('coo_tasks').select('*');

  if (error) {
    return <div className="text-red-500">Error loading COO tasks: {error.message}</div>;
  }

  const columns = [
    { key: 'task', label: 'Task' },
    { key: 'department', label: 'Department' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'assignee', label: 'Assignee' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">COO Dashboard</h1>
      <DataTable columns={columns} data={cooTasks || []} />
    </div>
  );
}

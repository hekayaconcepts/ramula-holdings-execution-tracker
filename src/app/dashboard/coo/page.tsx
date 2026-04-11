'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable, { type Column, type TableRow } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default function CooPage() {
  const [cooTasks, setCooTasks] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCooTasks = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase.from('coo_tasks').select('*');
        
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setCooTasks(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCooTasks();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading COO tasks: {error}</div>;
  }

  const columns: Column[] = [
    { key: 'task', label: 'Task' },
    { key: 'department', label: 'Department' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
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

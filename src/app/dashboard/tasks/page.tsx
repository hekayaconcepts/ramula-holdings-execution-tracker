'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable, { type Column } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase.from('tasks').select('*');
        
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setTasks(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading tasks: {error}</div>;
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

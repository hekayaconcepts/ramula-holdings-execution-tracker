import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';

export default async function ExpensePage() {
  const supabase = createClient();
  const { data: expenses, error } = await supabase.from('expenses').select('*');

  if (error) {
    return <div className="text-red-500">Error loading expenses: {error.message}</div>;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number) => `$${value?.toLocaleString()}`
    },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Expense Tracking</h1>
      <DataTable columns={columns} data={expenses || []} />
    </div>
  );
}

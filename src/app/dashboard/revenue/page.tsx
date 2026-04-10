import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';

export default async function RevenuePage() {
  const supabase = createClient();
  const { data: revenue, error } = await supabase.from('revenue').select('*');

  if (error) {
    return <div className="text-red-500">Error loading revenue: {error.message}</div>;
  }

  const columns = [
    { key: 'source', label: 'Source' },
    { key: 'description', label: 'Description' },
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
      <h1 className="text-3xl font-bold text-white">Revenue Tracking</h1>
      <DataTable columns={columns} data={revenue || []} />
    </div>
  );
}

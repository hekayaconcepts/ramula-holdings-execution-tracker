import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';

export default async function BrandPage() {
  const supabase = createClient();
  const { data: brandHealth, error } = await supabase.from('brand_health').select('*');

  if (error) {
    return <div className="text-red-500">Error loading brand health: {error.message}</div>;
  }

  const columns = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' },
    { key: 'target', label: 'Target' },
    { key: 'period', label: 'Period' },
    { key: 'trend', label: 'Trend' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Brand Health Dashboard</h1>
      <DataTable columns={columns} data={brandHealth || []} />
    </div>
  );
}

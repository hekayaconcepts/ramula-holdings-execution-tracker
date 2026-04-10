import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';

export default async function LegalPage() {
  const supabase = createClient();
  const { data: legalIp, error } = await supabase.from('legal_ip').select('*');

  if (error) {
    return <div className="text-red-500">Error loading legal IP: {error.message}</div>;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'filing_date', label: 'Filing Date' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Legal & IP Management</h1>
      <DataTable columns={columns} data={legalIp || []} />
    </div>
  );
}

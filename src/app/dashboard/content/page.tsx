import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default async function ContentPage() {
  const supabase = createClient();
  const { data: contentCalendar, error } = await supabase.from('content_calendar').select('*');

  if (error) {
    return <div className="text-red-500">Error loading content calendar: {error.message}</div>;
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    { key: 'publish_date', label: 'Publish Date' },
    { key: 'channel', label: 'Channel' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
      <DataTable columns={columns} data={contentCalendar || []} />
    </div>
  );
}

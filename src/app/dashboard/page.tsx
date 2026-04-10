import { createClient } from '@/utils/supabase/client';
import MetricCard from '@/components/MetricCard';
import DataTable from '@/components/DataTable';

export default async function DashboardPage() {
  const supabase = createClient();

  // Fetch data for metrics
  const [{ data: revenueData }, { data: expenseData }, { data: tasksData }] = await Promise.all([
    supabase.from('revenue').select('*'),
    supabase.from('expenses').select('*'),
    supabase.from('tasks').select('*'),
  ]);

  // Calculate metrics
  const totalRevenue = revenueData?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
  const totalOpex = expenseData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
  const profitLoss = totalRevenue - totalOpex;
  const totalTasks = tasksData?.length || 0;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
  ];

  const summaryData = [
    { name: 'Total Revenue', status: 'Completed', amount: `$${totalRevenue.toLocaleString()}` },
    { name: 'Total Expenses', status: 'Pending', amount: `$${totalOpex.toLocaleString()}` },
    { name: 'Profit/Loss', status: profitLoss >= 0 ? 'Done' : 'Blocked', amount: `$${profitLoss.toLocaleString()}` },
    { name: 'Active Tasks', status: 'In Progress', amount: totalTasks.toString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          color="green"
        />
        <MetricCard 
          title="OPEX" 
          value={`$${totalOpex.toLocaleString()}`} 
          color="red"
        />
        <MetricCard 
          title="P&L" 
          value={`$${profitLoss.toLocaleString()}`} 
          color={profitLoss >= 0 ? 'green' : 'red'}
        />
        <MetricCard 
          title="Tasks" 
          value={totalTasks} 
          color="blue"
        />
      </div>

      {/* Summary Table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Financial Summary</h2>
        <DataTable columns={columns} data={summaryData} />
      </div>
    </div>
  );
}

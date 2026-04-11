'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const VENTURE_COLORS: Record<string, string> = {
  'Gwambo Digital Ltd.': '#091d28',
  'Bybit Trading': '#f59e0b',
  'Mr. Productivity Systems Ltd.': '#10b981',
  'Coffee Past Midnight Ltd.': '#3b82f6',
  'Koachez Ltd.': '#ef4444',
  'The African Prop. Brief Ltd.': '#d49a30',
  'Ramula Travels Ltd.': '#6b7280',
  'Ramula Holdings Ltd.': '#091d28',
  'All Ventures': '#091d28',
  '1225': '#091d28'
}

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [
        { data: ventures },
        { data: tasks },
        { data: expenses },
        { data: revenue }
      ] = await Promise.all([
        supabase.from('ventures').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('revenue').select('*')
      ])

      setData({ ventures, tasks, expenses, revenue })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading || !data) {
    return <div className="p-8 text-center text-white">Loading dashboard metrics...</div>
  }

  // Calculate Consolidated P&L
  const totalRevenue = data.revenue.reduce((sum: number, r: any) => sum + Number(r.amount_kes || 0), 0)
  const totalOpex = data.expenses.reduce((sum: number, e: any) => sum + Number(e.actual_kes || 0), 0)
  const netPL = totalRevenue - totalOpex
  const margin = totalRevenue > 0 ? (netPL / totalRevenue) * 100 : 0

  // Calculate Overall Progress
  const totalTasks = data.tasks.length
  const completedTasks = data.tasks.filter((t: any) => t.status === 'Done').length
  const overallPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Prepare Pie Chart Data (Progress by Venture)
  const ventureProgress = data.ventures.map((v: any) => {
    const vTasks = data.tasks.filter((t: any) => t.venture_name === v.name)
    const vDone = vTasks.filter((t: any) => t.status === 'Done').length
    const vPercent = vTasks.length > 0 ? (vDone / vTasks.length) * 100 : 0
    return { name: v.name, percent: vPercent, color: VENTURE_COLORS[v.name] || '#ccc' }
  })

  const pieData = {
    labels: ventureProgress.map((v: any) => v.name),
    datasets: [{
      data: ventureProgress.map((v: any) => v.percent),
      backgroundColor: ventureProgress.map((v: any) => v.color),
      borderWidth: 1,
    }]
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Portfolio Overview</h1>
        <div className="text-right">
          <p className="text-sm text-gray-400 uppercase tracking-wider">Overall Completion</p>
          <p className="text-4xl font-black text-[#d49a30]">{overallPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-[#091d28]">{totalRevenue.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total OPEX</p>
          <p className="text-2xl font-bold text-[#ef4444]">{totalOpex.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Net P&L</p>
          <p className={`text-2xl font-bold ${netPL >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {netPL.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Net Margin</p>
          <p className="text-2xl font-bold text-[#091d28]">{margin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-[#091d28] mb-6">Execution Progress by Venture (%)</h2>
          <div className="h-64 flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-[#091d28] mb-6">Venture Health Snapshot</h2>
          <div className="space-y-4">
            {ventureProgress.map((v: any) => (
              <div key={v.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#1f2937]">{v.name}</span>
                  <span className="text-gray-500">{v.percent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${v.percent}%`, backgroundColor: v.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

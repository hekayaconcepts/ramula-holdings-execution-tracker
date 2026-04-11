'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import { useEffect, useState } from 'react'

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRevenue = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('revenue').select('*').order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading revenue:', error)
    } else {
      setRevenue(data as unknown as TableRow[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRevenue()
  }, [])

  const handleUpdate = async (id: string | number, field: string, value: any) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('revenue')
      .update({ [field]: value })
      .eq('id', id)

    if (error) {
      console.error('Error updating revenue:', error)
      alert('Failed to update revenue')
    } else {
      setRevenue(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    }
  }

  const columns: Column[] = [
    { key: 'venture_name', label: 'Venture' },
    { key: 'revenue_stream', label: 'Stream', editable: true },
    { 
      key: 'monthly_target_kes', 
      label: 'Target (KES)', 
      editable: true, 
      editType: 'number',
      render: (v) => Number(v || 0).toLocaleString('en-KE', { style: 'currency', currency: 'KES' })
    },
    { 
      key: 'amount_kes', 
      label: 'Actual (KES)', 
      editable: true, 
      editType: 'number',
      render: (v) => Number(v || 0).toLocaleString('en-KE', { style: 'currency', currency: 'KES' })
    },
    { 
      key: 'vs_target_percent', 
      label: '% vs Target',
      render: (_, row) => {
        const target = Number(row.monthly_target_kes || 0)
        const actual = Number(row.amount_kes || 0)
        const percent = target > 0 ? (actual / target) * 100 : 0
        return (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${percent >= 100 ? 'bg-green-500' : 'bg-[#d49a30]'}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{percent.toFixed(1)}%</span>
          </div>
        )
      }
    },
    { key: 'month', label: 'Month', editable: true },
    { key: 'year', label: 'Year', editable: true, editType: 'number' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Revenue Tracker</h1>
        <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg shadow-sm">
          Loading revenue data...
        </div>
      </div>
    )
  }

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.amount_kes || 0), 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#091d28]">Revenue Tracker</h1>
          <p className="text-gray-600 mt-1">Portfolio revenue performance by stream</p>
        </div>
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Revenue YTD</p>
          <p className="text-lg font-bold text-[#10b981]">{totalRevenue.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</p>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={revenue} 
        emptyMessage="No revenue data found."
        onUpdate={handleUpdate}
      />
    </div>
  )
}

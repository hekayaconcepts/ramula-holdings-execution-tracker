'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import { useEffect, useState } from 'react'

export default function RevenuePage() {
  const [revenue, setRevenue] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('revenue').select('*')
      
      if (error) {
        console.error('Error loading revenue:', error)
      } else {
        setRevenue(data as TableRow[])
      }
      setLoading(false)
    }
    
    fetchRevenue()
  }, [])

  const columns: Column[] = [
    { key: 'source', label: 'Source' },
    { key: 'description', label: 'Description' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: unknown) => {
        const num = typeof value === 'number' ? value : 0
        return `KES ${num.toLocaleString('en-KE')}`
      }
    },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Revenue Tracking</h1>
        <div className="dukaflo-card dukaflo-card-gold p-8 text-center text-gray-500">
          Loading revenue data...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#091d28]">Revenue Tracking</h1>
        <p className="text-gray-600 mt-1">Revenue by venture and stream</p>
      </div>
      <DataTable 
        columns={columns} 
        data={revenue} 
        emptyMessage="No revenue data found."
      />
    </div>
  )
}

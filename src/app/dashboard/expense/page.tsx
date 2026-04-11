'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import { useEffect, useState } from 'react'

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('expenses').select('*')
      
      if (error) {
        console.error('Error loading expenses:', error)
      } else {
        setExpenses(data as TableRow[])
      }
      setLoading(false)
    }
    
    fetchExpenses()
  }, [])

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
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
        <h1 className="text-3xl font-bold text-[#091d28]">Expense Tracking</h1>
        <div className="dukaflo-card dukaflo-card-gold p-8 text-center text-gray-500">
          Loading expenses...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#091d28]">Expense Tracking</h1>
        <p className="text-gray-600 mt-1">Portfolio expenses: budget vs actual</p>
      </div>
      <DataTable 
        columns={columns} 
        data={expenses} 
        emptyMessage="No expenses found."
      />
    </div>
  )
}

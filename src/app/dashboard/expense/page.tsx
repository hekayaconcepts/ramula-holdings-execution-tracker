'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import { useEffect, useState } from 'react'

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('expenses').select('*').order('expense_number', { ascending: true })
    
    if (error) {
      console.error('Error loading expenses:', error)
    } else {
      setExpenses(data as unknown as TableRow[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleUpdate = async (id: string | number, field: string, value: any) => {
    try {
      console.log(`Updating expense ${field} for id ${id} to ${value}`)
      const supabase = createClient()
      
      // Ensure the value is the correct type
      let finalValue = value
      if (field.includes('kes') || field.includes('budget') || field.includes('actual') || field.includes('variance')) {
        finalValue = Number(value) || 0
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .update({ [field]: finalValue })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating expense:', error)
        alert(`Failed to update expense: ${error.message}`)
        return
      }
      
      console.log('Expense update successful:', data)
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: finalValue } : e))
    } catch (err) {
      console.error('Unexpected error updating expense:', err)
      alert('An unexpected error occurred while updating expense')
    }
  }

  const columns: Column[] = [
    { key: 'expense_number', label: 'ID' },
    { key: 'venture_name', label: 'Venture' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { 
      key: 'budget_kes', 
      label: 'Budget (KES)', 
      editable: true, 
      editType: 'number',
      render: (v) => Number(v || 0).toLocaleString('en-KE', { style: 'currency', currency: 'KES' })
    },
    { 
      key: 'actual_kes', 
      label: 'Actual (KES)', 
      editable: true, 
      editType: 'number',
      render: (v) => Number(v || 0).toLocaleString('en-KE', { style: 'currency', currency: 'KES' })
    },
    { 
      key: 'variance_kes', 
      label: 'Variance',
      render: (_, row) => {
        const variance = Number(row.budget_kes || 0) - Number(row.actual_kes || 0)
        return (
          <span className={variance < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
            {variance.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
          </span>
        )
      }
    },
    { key: 'date_paid', label: 'Date Paid', editable: true, editType: 'date' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Portfolio Expense Tracker</h1>
        <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg shadow-sm">
          Loading expenses...
        </div>
      </div>
    )
  }

  const totalBudget = expenses.reduce((sum, e) => sum + Number(e.budget_kes || 0), 0)
  const totalActual = expenses.reduce((sum, e) => sum + Number(e.actual_kes || 0), 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#091d28]">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Budget vs Actual across all portfolio ventures</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Budget</p>
            <p className="text-lg font-bold text-[#091d28]">{totalBudget.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</p>
          </div>
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Spent</p>
            <p className="text-lg font-bold text-[#d49a30]">{totalActual.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}</p>
          </div>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={expenses} 
        emptyMessage="No expenses found."
        onUpdate={handleUpdate}
      />
    </div>
  )
}

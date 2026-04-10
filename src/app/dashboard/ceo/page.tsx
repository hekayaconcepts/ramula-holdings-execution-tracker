'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useEffect, useState } from 'react'

export default function CeoPage() {
  const [ceoTasks, setCeoTasks] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('ceo_tasks').select('*')
      
      if (error) {
        console.error('Error loading CEO tasks:', error)
      } else {
        setCeoTasks(data as TableRow[])
      }
      setLoading(false)
    }
    
    fetchTasks()
  }, [])

  // Define columns with proper TypeScript types matching DataTable
  const columns: Column[] = [
    { key: 'task', label: 'Task' },
    { key: 'priority', label: 'Priority' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'notes', label: 'Notes' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">CEO Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Loading tasks...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#091d28]">CEO Dashboard</h1>
        <p className="text-gray-600 mt-1">Strategic tasks for Gwambo (Bibu)</p>
      </div>
      <DataTable 
        columns={columns} 
        data={ceoTasks} 
        emptyMessage="No CEO tasks found."
      />
    </div>
  )
}

'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useEffect, useState } from 'react'

export default function TrackerPage() {
  const [tasks, setTasks] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('tasks').select('*')
      
      if (error) {
        console.error('Error loading tasks:', error)
      } else {
        setTasks(data as TableRow[])
      }
      setLoading(false)
    }
    
    fetchTasks()
  }, [])

  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'priority', label: 'Priority' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Task Tracker</h1>
        <div className="dukaflo-card dukaflo-card-gold p-8 text-center text-gray-500">
          Loading tasks...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#091d28]">Task Tracker</h1>
        <p className="text-gray-600 mt-1">Master execution tracker for all ventures</p>
      </div>
      <DataTable 
        columns={columns} 
        data={tasks} 
        emptyMessage="No tasks found."
      />
    </div>
  )
}

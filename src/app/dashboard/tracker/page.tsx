'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useEffect, useState } from 'react'

export default function TrackerPage() {
  const [tasks, setTasks] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchTasks = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    let query = supabase.from('tasks').select('*').order('task_number', { ascending: true })
    
    // RBAC: If user is restricted, filter tasks
    const { data: profile } = await supabase.from('profiles').select('role, venture_restriction').eq('id', user?.id).single()
    if (profile?.role === 'viewer' && profile.venture_restriction) {
       query = query.in('venture_name', profile.venture_restriction)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error loading tasks:', error)
    } else {
      setTasks(data as unknown as TableRow[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleUpdate = async (id: string | number, field: string, value: any) => {
    try {
      console.log(`Updating task ${field} for id ${id} to ${value}`)
      const supabase = createClient()
      
      // Ensure the value is the correct type
      let finalValue = value
      if (field.includes('percent') || field.includes('budget') || field.includes('cost')) {
        finalValue = Number(value) || 0
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ [field]: finalValue })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating task:', error)
        alert(`Failed to update task: ${error.message}`)
        return
      }
      
      console.log('Task update successful:', data)
      // Refresh local state
      setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: finalValue } : t))
    } catch (err) {
      console.error('Unexpected error updating task:', err)
      alert('An unexpected error occurred while updating task')
    }
  }

  const columns: Column[] = [
    { key: 'task_number', label: 'ID' },
    { key: 'venture_name', label: 'Venture' },
    { key: 'description', label: 'Task' },
    { 
      key: 'status', 
      label: 'Status',
      editable: true,
      editType: 'select',
      options: ['Not Started', 'In Progress', 'Done', 'Blocked', 'Deferred'],
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    { 
      key: 'priority', 
      label: 'Priority',
      editable: true,
      editType: 'select',
      options: ['Critical', 'High', 'Medium', 'Low'],
      render: (value: unknown) => <StatusBadge status={String(value)} type="priority" />
    },
    { 
      key: 'percent_done', 
      label: '% Done', 
      editable: true, 
      editType: 'number',
      render: (value: unknown) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-[#d49a30] h-1.5 rounded-full" 
              style={{ width: `${Number(value)}%` }}
            ></div>
          </div>
          <span>{Number(value)}%</span>
        </div>
      )
    },
    { key: 'due_date', label: 'Due Date', editable: true, editType: 'date' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Master Tracker</h1>
        <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg">
          Loading tasks...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#091d28]">Master Tracker</h1>
          <p className="text-gray-600 mt-1">Real-time execution monitoring across the portfolio</p>
        </div>
        <div className="text-sm text-gray-500">
          Click on Status, Priority, % Done, or Due Date to edit
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={tasks} 
        emptyMessage="No tasks found."
        onUpdate={handleUpdate}
      />
    </div>
  )
}

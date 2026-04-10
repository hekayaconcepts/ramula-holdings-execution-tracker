'use client'

import { createClient } from '@/utils/supabase/client'
import DataTable, { type Column, type TableRow } from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useEffect, useState } from 'react'

export default function ContentCalendarPage() {
  const [contentItems, setContentItems] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('content_calendar').select('*')
      
      if (error) {
        console.error('Error loading content calendar:', error)
      } else {
        setContentItems(data as TableRow[])
      }
      setLoading(false)
    }
    
    fetchContent()
  }, [])

  // Define columns with proper TypeScript types matching DataTable
  const columns: Column[] = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    { key: 'publish_date', label: 'Publish Date' },
    { key: 'channel', label: 'Channel' },
  ]

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#091d28]">Content Calendar</h1>
        <div className="dukaflo-card dukaflo-card-gold p-8 text-center text-gray-500">
          Loading content items...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#091d28]">Content Calendar</h1>
        <p className="text-gray-600 mt-1">67 content pieces across all brands</p>
      </div>
      <DataTable 
        columns={columns} 
        data={contentItems} 
        emptyMessage="No content items found."
      />
    </div>
  )
}

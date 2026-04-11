'use client'

import React, { useState } from 'react'

export interface TableRow {
  id: string | number
  [key: string]: string | number | boolean | null | undefined
}

export interface Column {
  key: string
  label: string
  sortable?: boolean
  editable?: boolean
  editType?: 'text' | 'number' | 'select' | 'date'
  options?: string[]
  render?: (value: unknown, row: TableRow) => React.ReactNode
}

export interface DataTableProps {
  columns: Column[]
  data: TableRow[]
  emptyMessage?: string
  className?: string
  onUpdate?: (id: string | number, field: string, value: any) => Promise<void>
}

export default function DataTable({
  columns,
  data,
  emptyMessage = 'No data available',
  className = '',
  onUpdate
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ id: string | number; field: string } | null>(null)
  const [editValue, setEditValue] = useState<any>(null)

  if (!data || data.length === 0) {
    return (
      <div className={`p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <p className="text-[#091d28] text-lg">{emptyMessage}</p>
      </div>
    )
  }

  const handleEdit = (row: TableRow, column: Column) => {
    if (!column.editable || !onUpdate) return
    setEditingCell({ id: row.id, field: column.key })
    setEditValue(row[column.key])
  }

  const handleSave = async () => {
    if (editingCell && onUpdate) {
      await onUpdate(editingCell.id, editingCell.field, editValue)
      setEditingCell(null)
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#091d28]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => {
                  const isEditing = editingCell?.id === row.id && editingCell?.field === column.key
                  
                  return (
                    <td 
                      key={column.key} 
                      className={`px-6 py-4 whitespace-nowrap text-sm text-[#1f2937] ${column.editable ? 'cursor-pointer hover:bg-yellow-50' : ''}`}
                      onClick={() => handleEdit(row, column)}
                    >
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          {column.editType === 'select' ? (
                            <select
                              value={String(editValue)}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleSave}
                              autoFocus
                              className="p-1 border rounded text-sm"
                            >
                              {column.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={column.editType || 'text'}
                              value={editValue ?? ''}
                              onChange={(e) => setEditValue(column.editType === 'number' ? Number(e.target.value) : e.target.value)}
                              onBlur={handleSave}
                              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                              autoFocus
                              className="p-1 border rounded text-sm w-full"
                            />
                          )}
                        </div>
                      ) : (
                        column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? '—')
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

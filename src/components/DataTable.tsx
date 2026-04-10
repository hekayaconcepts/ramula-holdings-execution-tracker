'use client'

import React from 'react'

interface TableRow {
  [key: string]: string | number | boolean | null | undefined
}

interface Column {
  key: keyof TableRow | string
  label: string
  render?: (value: unknown, row: TableRow) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: TableRow[]
}

export default function DataTable({ columns, data }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="dukaflo-card dukaflo-card-gold p-8 text-center">
        <p className="text-brand-navy text-lg">No data available</p>
      </div>
    )
  }

  return (
    <div className="dukaflo-card dukaflo-card-gold overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-brand-light">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-brand-navy uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-brand-light transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-brand-navy">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

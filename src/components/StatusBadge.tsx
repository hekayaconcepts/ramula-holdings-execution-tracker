'use client'

import React from 'react'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'priority'
}

export default function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getStyles = () => {
    const s = status?.toLowerCase() || ''
    if (type === 'priority') {
      switch (s) {
        case 'critical':
          return 'bg-red-100 text-[#ef4444] border-red-200'
        case 'high':
          return 'bg-orange-100 text-[#f97316] border-orange-200'
        case 'medium':
          return 'bg-yellow-100 text-[#eab308] border-yellow-200'
        case 'low':
          return 'bg-gray-100 text-[#6b7280] border-gray-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    switch (s) {
      case 'done':
      case 'active':
        return 'bg-green-100 text-[#10b981] border-green-200'
      case 'in progress':
      case 'building':
        return 'bg-blue-100 text-[#3b82f6] border-blue-200'
      case 'blocked':
      case 'error':
        return 'bg-red-100 text-[#ef4444] border-red-200'
      case 'not started':
      case 'planning':
        return 'bg-gray-100 text-[#9ca3af] border-gray-200'
      case 'pre-launch':
      case 'warning':
      case 'converting':
        return 'bg-yellow-100 text-[#f59e0b] border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}>
      {status || '—'}
    </span>
  )
}

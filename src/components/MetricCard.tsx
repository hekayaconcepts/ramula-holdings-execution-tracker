import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'gold' | 'blue' | 'green' | 'red';
}

export default function MetricCard({ title, value, icon, color = 'gold' }: MetricCardProps) {
  const borderColors = {
    gold: 'border-brand-gold',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };

  return (
    <div className={`dukaflo-card dukaflo-card-${color} p-6 bg-white rounded-lg shadow-md border-l-4 ${borderColors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-brand-light text-${color === 'gold' ? 'brand-gold' : color + '-500'}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

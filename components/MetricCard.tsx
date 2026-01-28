import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, icon, colorClass = "text-blue-400" }) => {
  return (
    <div className="bg-space-800 border border-space-700 rounded-lg p-4 flex flex-col justify-between hover:border-space-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-mono font-bold ${colorClass}`}>{value}</span>
        <span className="text-gray-500 text-sm font-mono">{unit}</span>
      </div>
      {trend && (
        <div className="mt-2 text-xs flex items-center">
            {trend === 'up' && <span className="text-red-400">▲ Rising</span>}
            {trend === 'down' && <span className="text-green-400">▼ Falling</span>}
            {trend === 'stable' && <span className="text-gray-500">− Stable</span>}
        </div>
      )}
    </div>
  );
};
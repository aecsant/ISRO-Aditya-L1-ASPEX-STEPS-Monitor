import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { StepsDataPoint } from '../types';

interface StepsChartProps {
  data: StepsDataPoint[];
}

export const StepsChart: React.FC<StepsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-space-800 border border-space-700 rounded-lg p-4">
      <h3 className="text-gray-200 font-semibold mb-4 text-sm uppercase tracking-wide border-l-4 border-isro-orange pl-2">
        Particle Flux - Time Series (Real-time)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F294F" vertical={false} />
          <XAxis 
            dataKey="displayTime" 
            stroke="#6B7280" 
            tick={{fontSize: 12, fontFamily: 'monospace'}}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            tick={{fontSize: 12, fontFamily: 'monospace'}}
            tickLine={false}
            label={{ value: 'Counts / sec', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0B0D17', borderColor: '#1F294F', color: '#F3F4F6' }}
            itemStyle={{ fontFamily: 'monospace' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          
          <Line 
            type="monotone" 
            dataKey="protonFluxLow" 
            name="Low Energy H+" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            activeDot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="protonFluxHigh" 
            name="Supra Thermal H+" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            activeDot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="alphaParticles" 
            name="Alpha Particles" 
            stroke="#10B981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={300}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
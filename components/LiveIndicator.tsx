import React from 'react';
import { DataStatus } from '../types';

interface LiveIndicatorProps {
  status: DataStatus;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case DataStatus.LIVE: return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
      case DataStatus.CONNECTING: return 'bg-yellow-500 animate-pulse';
      case DataStatus.BUFFERING: return 'bg-blue-500 animate-pulse';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-space-800 px-3 py-1.5 rounded-full border border-space-700">
      <div className={`w-3 h-3 rounded-full ${getColor()}`} />
      <span className="text-xs font-mono font-bold tracking-wider text-gray-300">
        {status}
      </span>
      {status === DataStatus.LIVE && (
        <span className="text-[10px] text-gray-500 ml-2 font-mono">
          {(1000 / 60).toFixed(1)}Hz
        </span>
      )}
    </div>
  );
};
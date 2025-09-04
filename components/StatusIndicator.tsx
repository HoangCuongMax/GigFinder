
import React from 'react';
import { WorkerStatus } from '../types';

interface StatusIndicatorProps {
  status: WorkerStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case WorkerStatus.IDLE:
        return 'bg-stone-500';
      case WorkerStatus.SEARCHING:
        return 'bg-blue-500 animate-pulse';
      case WorkerStatus.OFFERED:
        return 'bg-yellow-500';
      case WorkerStatus.WORKING:
        return 'bg-green-500';
      case WorkerStatus.COMPLETED:
        return 'bg-amber-500';
      default:
        return 'bg-stone-500';
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-stone-800 px-4 py-2 rounded-full shadow-md">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      <span className="font-semibold text-sm tracking-wide text-stone-300">Status: {status}</span>
    </div>
  );
};

export default StatusIndicator;
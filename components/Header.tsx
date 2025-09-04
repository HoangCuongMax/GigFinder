import React from 'react';
import { View, WorkerStatus } from '../types';
import StatusIndicator from './StatusIndicator';
import { ClockIcon } from '../constants';

interface HeaderProps {
    title: View;
    workerStatus: WorkerStatus;
    onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, workerStatus, onHistoryClick }) => {
  return (
    <header className="w-full p-4 bg-stone-900/80 backdrop-blur-sm border-b border-stone-700 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
            {title}
        </h1>
        <div className="flex items-center gap-4">
            <StatusIndicator status={workerStatus} />
            <button 
                onClick={onHistoryClick}
                className="flex items-center gap-2 text-sm bg-stone-800 px-4 py-2 rounded-full shadow-md text-stone-300 hover:bg-stone-700 hover:text-white transition-colors duration-200"
                aria-label="View job history"
            >
                <ClockIcon className="w-5 h-5" />
                <span>History</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
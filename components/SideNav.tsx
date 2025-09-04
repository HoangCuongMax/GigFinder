import React from 'react';
import { View, WorkerStatus } from '../types';
import { 
    HomeIcon, 
    DocumentPlusIcon, 
    UsersIcon, 
    CalendarDaysIcon, 
    AcademicCapIcon, 
    ShieldCheckIcon,
    ClockIcon
} from '../constants';
import StatusIndicator from './StatusIndicator';

interface SideNavProps {
  views: View[];
  activeView: View;
  setActiveView: (view: View) => void;
  workerStatus: WorkerStatus;
  onHistoryClick: () => void;
}

const ICONS: Record<View, React.ComponentType> = {
    'Home': HomeIcon,
    'Job Post': DocumentPlusIcon,
    'Staff Search': UsersIcon,
    'Job Availability': CalendarDaysIcon,
    'Learning and Training': AcademicCapIcon,
    'Safety': ShieldCheckIcon,
};

const SideNav: React.FC<SideNavProps> = ({ views, activeView, setActiveView, workerStatus, onHistoryClick }) => {
  return (
    <nav className="w-64 bg-stone-950/50 border-r border-stone-800 p-4 flex flex-col h-screen sticky top-0">
        <div className="mb-8 p-2">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              <span className="text-amber-400">Gig</span>Finder
            </h1>
            <p className="text-xs text-stone-500 mt-1">NT Casual Work</p>
        </div>

        <ul className="space-y-2">
            {views.map((view) => {
                const Icon = ICONS[view];
                const isActive = activeView === view;
                return (
                    <li key={view}>
                        <button
                            onClick={() => setActiveView(view)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                                isActive 
                                ? 'bg-amber-600 text-white shadow-md' 
                                : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                            }`}
                        >
                            <Icon />
                            <span className="font-semibold">{view}</span>
                        </button>
                    </li>
                );
            })}
        </ul>

        <div className="mt-auto pt-4 border-t border-stone-800 space-y-4">
            <StatusIndicator status={workerStatus} />
            <button
                onClick={onHistoryClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 text-stone-400 hover:bg-stone-800 hover:text-white"
                aria-label="View job history"
            >
                <ClockIcon className="w-6 h-6" />
                <span className="font-semibold">History</span>
            </button>
        </div>
    </nav>
  );
};

export default SideNav;
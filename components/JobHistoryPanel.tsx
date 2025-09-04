import React from 'react';
import { Job } from '../types';
import { XMarkIcon } from '../constants';
import JobHistoryItem from './JobHistoryItem';

interface JobHistoryPanelProps {
  jobs: Job[];
  isVisible: boolean;
  onClose: () => void;
}

const JobHistoryPanel: React.FC<JobHistoryPanelProps> = ({ jobs, isVisible, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-stone-800 border-t border-stone-700 rounded-t-2xl shadow-2xl z-50 p-6 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="history-panel-title" className="text-xl font-bold text-white">Job History</h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-700 transition-colors"
            aria-label="Close history panel"
          >
            <XMarkIcon />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {jobs.length === 0 ? (
            <p className="text-stone-400 text-center py-8">Accept a job to see it here.</p>
          ) : (
            <ul className="space-y-3">
              {jobs.map(job => (
                <JobHistoryItem key={job.id} job={job} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default JobHistoryPanel;
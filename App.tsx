import React, { useState, useCallback, useEffect } from 'react';
import { Job, WorkerStatus, View } from './types';
import { generateRandomJob } from './services/geminiService';
import JobCard from './components/JobCard';
import LoadingSpinner from './components/LoadingSpinner';
import { CheckIcon, XMarkIcon } from './constants';
import IconButton from './components/IconButton';
import JobHistoryPanel from './components/JobHistoryPanel';
import JobHeatMap from './components/JobHeatMap';
import SideNav from './components/SideNav';
import PlaceholderPage from './components/PlaceholderPage';

const VIEWS: View[] = ['Home', 'Job Post', 'Staff Search', 'Job Availability', 'Learning and Training', 'Safety'];

export default function App() {
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>(WorkerStatus.IDLE);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [activeView, setActiveView] = useState<View>('Home');

  const isLoading = workerStatus === WorkerStatus.SEARCHING;

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('gigfinder-job-history');
        if (storedHistory) {
            setJobHistory(JSON.parse(storedHistory));
        }
    } catch (error) {
        console.error("Failed to parse job history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isHistoryVisible) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, [isHistoryVisible]);

  const handleFindJob = useCallback(async () => {
    setWorkerStatus(WorkerStatus.SEARCHING);
    setError(null);
    try {
      const job = await generateRandomJob();
      setCurrentJob(job);
      setWorkerStatus(WorkerStatus.OFFERED);
    } catch (err) {
      setError('Failed to find a job. The AI might be busy. Please try again.');
      setWorkerStatus(WorkerStatus.IDLE);
      console.error(err);
    }
  }, []);

  const handleAcceptJob = useCallback(() => {
    if (!currentJob) return;

    const newHistory = [currentJob, ...jobHistory.filter(job => job.id !== currentJob.id)];
    setJobHistory(newHistory);
    try {
        localStorage.setItem('gigfinder-job-history', JSON.stringify(newHistory));
    } catch (error) {
        console.error("Failed to save job history to localStorage", error);
    }

    setWorkerStatus(WorkerStatus.WORKING);
    setTimeout(() => {
        setWorkerStatus(WorkerStatus.COMPLETED);
    }, 5000);
  }, [currentJob, jobHistory]);

  const handleDeclineJob = useCallback(() => {
    setCurrentJob(null);
    setWorkerStatus(WorkerStatus.IDLE);
  }, []);

  const handleFindAnotherJob = useCallback(() => {
    setCurrentJob(null);
    setWorkerStatus(WorkerStatus.IDLE);
  }, []);

  const renderHomeContent = () => {
    switch (workerStatus) {
      case WorkerStatus.SEARCHING:
        return (
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-lg text-stone-400 mt-4">Searching for nearby gigs...</p>
          </div>
        );
      case WorkerStatus.OFFERED:
        return currentJob && (
          <div className="w-full max-w-md">
            <JobCard job={currentJob} />
            <div className="flex justify-center gap-4 mt-6">
              <IconButton onClick={handleDeclineJob} icon={<XMarkIcon />} text="Decline" variant="danger" />
              <IconButton onClick={handleAcceptJob} icon={<CheckIcon />} text="Accept" variant="success" />
            </div>
          </div>
        );
      case WorkerStatus.WORKING:
        return (
          <div className="text-center p-8 bg-stone-800 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">Job in Progress</h2>
            <p className="text-green-400">{currentJob?.title}</p>
            <div className="mt-4 h-2 w-full bg-stone-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-progress"></div>
            </div>
          </div>
        );
      case WorkerStatus.COMPLETED:
          return (
            <div className="text-center p-8 bg-stone-800 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-amber-400 mb-2">Job Completed!</h2>
                <p className="text-white mb-6">You earned ${currentJob?.payType === 'flat' ? currentJob.payRate : currentJob.payRate * 3} (simulated).</p>
                <button
                    onClick={handleFindAnotherJob}
                    className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-stone-900 transition-all duration-200"
                >
                    Find Another Gig
                </button>
            </div>
          );
      case WorkerStatus.IDLE:
      default:
        return (
            <div className="text-center w-full max-w-lg mx-auto">
                <h2 className="text-3xl font-bold text-white mb-2">Job Demand Heat Map</h2>
                <p className="text-stone-400 mb-4">See where the gigs are hot right now in the NT.</p>
                <JobHeatMap />
                <p className="text-lg text-stone-400 my-8">Ready to find your next job?</p>
                <button
                    onClick={handleFindJob}
                    disabled={isLoading}
                    className="px-8 py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-stone-900 transform hover:scale-105 transition-all duration-200"
                    >
                    {isLoading ? 'Searching...' : 'Find a Job Now'}
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        );
    }
  };

  const renderActiveView = () => {
    if (activeView === 'Home') {
      return renderHomeContent();
    }
    return <PlaceholderPage title={activeView} />;
  }

  return (
    <div className="bg-stone-900 text-white min-h-screen flex font-sans">
      <SideNav 
        views={VIEWS} 
        activeView={activeView} 
        setActiveView={setActiveView}
        workerStatus={workerStatus}
        onHistoryClick={() => setIsHistoryVisible(true)}
      />
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full h-full flex items-center justify-center animate-fade-in">
              {renderActiveView()}
          </div>
      </main>
      <JobHistoryPanel 
        jobs={jobHistory} 
        isVisible={isHistoryVisible} 
        onClose={() => setIsHistoryVisible(false)} 
      />
      <style>{`
        body {
            background-color: #1c1917;
        }
        .bg-stone-900 {
            background-color: #1c1917;
            background-image: radial-gradient(#44403c 1px, transparent 1px);
            background-size: 16px 16px;
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-progress { animation: progress 5s linear forwards; }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #292524; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #57534e; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #78716c; }
      `}</style>
    </div>
  );
}
import React from 'react';
import { Job } from '../types';
import { MapPinIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '../constants';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-stone-800 rounded-2xl shadow-2xl p-6 border border-stone-700 overflow-hidden w-full max-w-md mx-auto animate-fade-in">
        <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">{job.title}</h2>
            <div className="flex items-center text-amber-400 mt-1">
                <BuildingOfficeIcon />
                <p className="font-semibold">{job.company}</p>
            </div>
        </div>

        <div className="space-y-3 text-stone-300 mb-5">
            <div className="flex items-center">
                <MapPinIcon />
                <span>{job.location}</span>
            </div>
            <div className="flex items-center">
                <CurrencyDollarIcon />
                <span className="font-bold text-green-400">${job.payRate.toFixed(2)}</span>
                <span className="text-sm ml-1 text-stone-400">/{job.payType}</span>
            </div>
        </div>
        
        <p className="text-stone-400 text-sm leading-relaxed border-t border-stone-700 pt-4">
            {job.description}
        </p>
    </div>
  );
};

export default JobCard;
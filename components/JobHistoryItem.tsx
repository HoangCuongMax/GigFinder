import React from 'react';
import { Job } from '../types';
import { BuildingOfficeIcon, CurrencyDollarIcon } from '../constants';

interface JobHistoryItemProps {
    job: Job;
}

const JobHistoryItem: React.FC<JobHistoryItemProps> = ({ job }) => {
    return (
        <li className="bg-stone-900 p-4 rounded-lg border border-stone-700 animate-fade-in">
            <h3 className="font-bold text-white truncate">{job.title}</h3>
            <div className="flex items-center text-sm text-stone-400 mt-2">
                <BuildingOfficeIcon />
                <span className="truncate">{job.company}</span>
            </div>
             <div className="flex items-center text-sm text-green-400 mt-1 font-semibold">
                <CurrencyDollarIcon />
                <span>
                    ${job.payRate.toFixed(2)}
                    {job.payType === 'hourly' && ' / hour'}
                </span>
            </div>
        </li>
    );
};

export default JobHistoryItem;
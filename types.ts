export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    payRate: number;
    payType: 'hourly' | 'flat';
}

export interface HeatMapData {
    location: string;
    demand: number; // A score from 1-10
}
  
export enum WorkerStatus {
    IDLE = 'Idle',
    SEARCHING = 'Searching',
    OFFERED = 'Job Offered',
    WORKING = 'Working',
    COMPLETED = 'Completed'
}

export type View = 'Home' | 'Job Post' | 'Staff Search' | 'Job Availability' | 'Learning and Training' | 'Safety';
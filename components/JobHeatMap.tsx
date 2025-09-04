import React, { useEffect, useState } from 'react';
import { generateHeatMapData } from '../services/geminiService';
import { HeatMapData } from '../types';
import LoadingSpinner from './LoadingSpinner';

const NT_LOCATIONS: { [key: string]: { x: number; y: number; r: number } } = {
    'Darwin': { x: 127, y: 35, r: 10 },
    'Katherine': { x: 110, y: 96, r: 8 },
    'Kakadu': { x: 155, y: 90, r: 9 },
    'Arnhem Land': { x: 170, y: 45, r: 12 },
    'Tennant Creek': { x: 110, y: 145, r: 7 },
    'Alice Springs': { x: 100, y: 180, r: 10 },
};

const colorScale = [
    '#44403c', // stone-700 for demand 1-2
    '#7c2d12', // amber-900 for demand 3-4
    '#b45309', // amber-700 for demand 5-6
    '#d97706', // amber-600 for demand 7-8
    '#f59e0b', // amber-500 for demand 9-10
];

const getColorForDemand = (demand: number): string => {
    if (demand <= 2) return colorScale[0];
    if (demand <= 4) return colorScale[1];
    if (demand <= 6) return colorScale[2];
    if (demand <= 8) return colorScale[3];
    return colorScale[4];
};

const JobHeatMap: React.FC = () => {
    const [mapData, setMapData] = useState<HeatMapData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await generateHeatMapData();
                setMapData(data);
            } catch (err) {
                setError('Could not load job demand data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-stone-800/50 rounded-lg h-80">
                <LoadingSpinner />
                <p className="text-stone-400 mt-2">Loading Heat Map...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 bg-red-900/50 text-red-300 rounded-lg h-80 flex items-center justify-center">{error}</div>;
    }

    const dataMap = new Map(mapData?.map(item => [item.location, item]));

    return (
        <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 shadow-lg">
            <svg viewBox="0 0 200 200" className="w-full h-auto" aria-labelledby="map-title" role="img">
                <title id="map-title">Job Demand Heat Map of the Northern Territory</title>
                <path
                    d="M136.4 198.8L63.6 198.8 63.6 107.1 0 107.1 0 85.7 63.6 85.7 63.6 0 111.4 0 111.4 42.9 142.9 42.9 142.9 0 200 0 200 85.7 142.9 85.7 142.9 107.1 136.4 107.1z"
                    fill="#1c1917" stroke="#57534e" strokeWidth="1"
                />
                {Object.entries(NT_LOCATIONS).map(([name, { x, y, r }]) => {
                    const locationData = dataMap.get(name);
                    const demand = locationData?.demand ?? 0;
                    const color = demand > 0 ? getColorForDemand(demand) : '#404040';
                    return (
                        <g key={name} className="transition-all duration-300">
                            <circle cx={x} cy={y} r={r} fill={color} stroke="#fde047" strokeWidth={demand > 8 ? 0.7 : 0} className="transition-all duration-300" />
                            <text x={x} y={y + r + 8} fontSize="8" fill="#d6d3d1" textAnchor="middle" className="font-sans pointer-events-none">{name}</text>
                        </g>
                    );
                })}
            </svg>
             <div className="flex items-center justify-center space-x-2 mt-3 px-2">
                <span className="text-xs text-stone-400">Low</span>
                <div className="flex h-3 rounded-full overflow-hidden flex-1 max-w-xs">
                    {colorScale.map((color, i) => (
                        <div key={i} style={{ backgroundColor: color, flex: 1 }} title={`Demand Level ${i * 2 + 1}-${(i + 1) * 2}`} />
                    ))}
                </div>
                <span className="text-xs text-stone-400">High</span>
            </div>
        </div>
    );
};

export default JobHeatMap;
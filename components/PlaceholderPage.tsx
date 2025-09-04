import React from 'react';
import { View } from '../types';

interface PlaceholderPageProps {
    title: View;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <div className="text-center p-8 bg-stone-800 rounded-xl shadow-lg max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
            <p className="text-lg text-stone-400">
                This feature is currently under construction.
            </p>
            <p className="text-amber-400 mt-4 font-semibold">
                Coming Soon!
            </p>
        </div>
    );
};

export default PlaceholderPage;
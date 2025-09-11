
import React, { useState } from 'react';
import { getClubRecommendation } from '../services/geminiService';
import type { ClubRecommendation } from '../types';
import { AdjustmentsHorizontalIcon, CheckCircleIcon, LightBulbIcon } from './icons';

const LIE_TYPES = ['Fairway', 'Light Rough', 'Heavy Rough', 'Fairway Bunker', 'Greenside Bunker', 'Tight Lie'];
const WIND_DIRECTIONS = ['No Wind', 'Headwind', 'Tailwind', 'Crosswind (L to R)', 'Crosswind (R to L)'];

const ClubRecommender: React.FC = () => {
    const [conditions, setConditions] = useState({
        distance: 150,
        lie: 'Fairway',
        windSpeed: 0,
        windDirection: 'No Wind',
        elevationChange: 0,
    });
    const [recommendation, setRecommendation] = useState<ClubRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConditions(prev => ({
            ...prev,
            [name]: name === 'distance' || name === 'windSpeed' || name === 'elevationChange' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setRecommendation(null);
        try {
            const result = await getClubRecommendation(conditions);
            setRecommendation(result);
        } catch (err) {
            setError('The AI Caddie is taking a break. Please try again in a moment.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 w-full">
            <div className="text-center mb-6">
                <AdjustmentsHorizontalIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">AI Club Caddie</h2>
                <p className="mt-2 text-md text-gray-300">Get an expert club recommendation for your next shot.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-900/50 border border-slate-700 rounded-lg mb-8">
                <div>
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-300">Distance to Target (yds)</label>
                    <input type="number" name="distance" id="distance" value={conditions.distance} onChange={handleInputChange} min="1" max="600"
                           className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                    <label htmlFor="lie" className="block text-sm font-medium text-gray-300">Ball Lie</label>
                    <select name="lie" id="lie" value={conditions.lie} onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md">
                        {LIE_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="windSpeed" className="block text-sm font-medium text-gray-300">Wind (mph)</label>
                        <input type="number" name="windSpeed" id="windSpeed" value={conditions.windSpeed} onChange={handleInputChange} min="0" max="50"
                               className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="windDirection" className="block text-sm font-medium text-gray-300">Direction</label>
                        <select name="windDirection" id="windDirection" value={conditions.windDirection} onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md">
                            {WIND_DIRECTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                 </div>
                 <div>
                    <label htmlFor="elevationChange" className="block text-sm font-medium text-gray-300">Elevation (yds)</label>
                    <input type="number" name="elevationChange" id="elevationChange" value={conditions.elevationChange} onChange={handleInputChange} min="-100" max="100"
                           className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    <p className="text-xs text-gray-400 mt-1">Use + for uphill, - for downhill.</p>
                </div>
                <div className="lg:col-span-2 flex items-end justify-center">
                    <button type="submit" disabled={isLoading} className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                        {isLoading ? 'Thinking...' : 'Get Recommendation'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="ml-4 text-lg text-gray-300">Calculating the perfect shot...</p>
                </div>
            )}
            {error && (
                <div className="text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
                    <p className="font-semibold">Caddie Error</p>
                    <p>{error}</p>
                </div>
            )}
            {recommendation && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center p-8 bg-green-900/30 border-2 border-green-500 rounded-xl">
                        <p className="text-lg font-medium text-gray-200">The AI Caddie Recommends:</p>
                        <p className="text-5xl font-extrabold text-white my-2">{recommendation.club}</p>
                        <p className={`text-lg font-semibold ${recommendation.confidence === 'High' ? 'text-green-300' : recommendation.confidence === 'Medium' ? 'text-yellow-300' : 'text-red-300'}`}>
                            Confidence: {recommendation.confidence}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                            <h4 className="flex items-center text-xl font-bold text-white mb-3">
                                <CheckCircleIcon className="h-6 w-6 text-green-400 mr-2" />
                                Primary Recommendation
                            </h4>
                            <p className="text-gray-300 whitespace-pre-wrap">{recommendation.reasoning}</p>
                        </div>
                        {recommendation.alternativeClub && (
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                                <h4 className="flex items-center text-xl font-bold text-white mb-3">
                                    <LightBulbIcon className="h-6 w-6 text-yellow-400 mr-2" />
                                    Alternative Option
                                </h4>
                                <p className="text-gray-300 font-semibold mb-2">{recommendation.alternativeClub}</p>
                                <p className="text-gray-300 whitespace-pre-wrap">{recommendation.alternativeReasoning}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubRecommender;

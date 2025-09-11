
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GolfRound, Shot, ShotOutcome } from '../types';
import { TargetIcon, PlusCircleIcon } from './icons';

const GOLF_CLUBS = [
    'Driver', '3-Wood', '5-Wood', 'Hybrid',
    '2-Iron', '3-Iron', '4-Iron', '5-Iron', '6-Iron', '7-Iron', '8-Iron', '9-Iron',
    'Pitching Wedge', 'Gap Wedge', 'Sand Wedge', 'Lob Wedge',
    'Putter'
];

const SHOT_OUTCOMES: ShotOutcome[] = [
    'Fairway', 'Green', 'Rough', 'Bunker', 'Water Hazard', 'Out of Bounds', 'In the Hole'
];

const STORAGE_KEY = 'golfAiShotTrackerRound';

const ShotTracker: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'log' | 'analytics'>('log');
    const [round, setRound] = useState<GolfRound>([]);
    const [currentShot, setCurrentShot] = useState<Partial<Shot>>({
        hole: 1, par: 4, club: 'Driver', distance: 250, outcome: 'Fairway'
    });

    useEffect(() => {
        try {
            const savedRound = localStorage.getItem(STORAGE_KEY);
            if (savedRound) {
                setRound(JSON.parse(savedRound));
            }
        } catch (error) {
            console.error("Failed to load round from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(round));
        } catch (error) {
            console.error("Failed to save round to localStorage", error);
        }
    }, [round]);

    const handleAddShot = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentShot.hole && currentShot.par && currentShot.club && currentShot.distance !== undefined && currentShot.outcome) {
            const newRound = [...round, currentShot as Shot];
            setRound(newRound);
            
            const lastShot = newRound[newRound.length - 1];
            setCurrentShot(prev => ({
                ...prev,
                hole: lastShot.outcome === 'In the Hole' ? (lastShot.hole ?? 0) + 1 : lastShot.hole,
                par: lastShot.outcome === 'In the Hole' ? 4 : lastShot.par,
            }));
        } else {
            alert("Please fill out all fields for the shot.");
        }
    };
    
    const handleClearRound = () => {
        if (window.confirm("Are you sure you want to clear all shots in this round? This cannot be undone.")) {
            setRound([]);
            setCurrentShot({ hole: 1, par: 4, club: 'Driver', distance: 250, outcome: 'Fairway' });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentShot(prev => ({
            ...prev,
            [name]: name === 'hole' || name === 'par' || name === 'distance' ? parseInt(value, 10) : value
        }));
    };
    
    const analytics = useMemo(() => {
        if (round.length === 0) return null;

        const totalStrokes = round.length;
        const totalPar = round.reduce((acc, shot) => {
            const isNewHole = !round.slice(0, round.indexOf(shot)).some(s => s.hole === shot.hole);
            return isNewHole ? acc + (shot.par ?? 0) : acc;
        }, 0);
        
        const scoreVsPar = totalStrokes - totalPar;

        const outcomes = round.reduce((acc, shot) => {
            acc[shot.outcome] = (acc[shot.outcome] || 0) + 1;
            return acc;
        }, {} as Record<ShotOutcome, number>);

        const clubDistances = round.reduce((acc, shot) => {
            if (shot.distance > 0 && shot.club !== 'Putter') {
                if (!acc[shot.club]) {
                    acc[shot.club] = { total: 0, count: 0 };
                }
                acc[shot.club].total += shot.distance;
                acc[shot.club].count++;
            }
            return acc;
        }, {} as Record<string, { total: number; count: number }>);
        
        const avgClubDistances = Object.entries(clubDistances).map(([club, data]) => ({
            club,
            avg: Math.round(data.total / data.count)
        })).sort((a,b) => b.avg - a.avg);

        // FIR/GIR logic (simplified)
        const firOpportunities = round.filter(s => s.par && s.par > 3 && s.club === 'Driver').length;
        const firSuccess = round.filter(s => s.par && s.par > 3 && s.club === 'Driver' && s.outcome === 'Fairway').length;
        const fir = firOpportunities > 0 ? (firSuccess / firOpportunities) * 100 : 0;

        const girOpportunities = 18; // Simplified
        const girSuccess = round.filter(s => s.outcome === 'Green').length;
        const gir = (girSuccess / girOpportunities) * 100;

        return { totalStrokes, totalPar, scoreVsPar, outcomes, avgClubDistances, fir, gir };
    }, [round]);

    const renderInput = (label: string, name: string, type: 'number' | 'select', options?: string[]) => (
        <div className="flex-1 min-w-[120px]">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
            {type === 'select' ? (
                <select id={name} name={name} value={currentShot[name as keyof Shot] || ''} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input type="number" id={name} name={name} value={currentShot[name as keyof Shot] || ''} onChange={handleInputChange} min={name === 'distance' ? 0 : 1} className="mt-1 block w-full shadow-sm sm:text-sm bg-slate-700 border-slate-600 text-white rounded-md focus:ring-green-500 focus:border-green-500" />
            )}
        </div>
    );

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 w-full">
            <div className="text-center mb-6">
                <TargetIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">Shot Tracker & Analytics</h2>
                <p className="mt-2 text-md text-gray-300">Log your shots during your round and get detailed performance insights.</p>
            </div>
            
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('log')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'log' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-white hover:border-slate-500'}`}>
                        Log Shots
                    </button>
                    <button onClick={() => setActiveTab('analytics')} disabled={!analytics} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'analytics' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-white hover:border-slate-500'}`}>
                        Analytics
                    </button>
                </nav>
            </div>
            
            <div className="mt-8">
                {activeTab === 'log' && (
                    <div>
                        <form onSubmit={handleAddShot} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg space-y-4">
                            <div className="flex flex-wrap items-end gap-4">
                                {renderInput('Hole', 'hole', 'number')}
                                {renderInput('Par', 'par', 'number')}
                                {renderInput('Club', 'club', 'select', GOLF_CLUBS)}
                                {renderInput('Distance (yds)', 'distance', 'number')}
                                {renderInput('Outcome', 'outcome', 'select', SHOT_OUTCOMES)}
                                <button type="submit" className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Shot
                                </button>
                            </div>
                        </form>
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Current Round ({round.length} shots)</h3>
                                {round.length > 0 && <button onClick={handleClearRound} className="text-sm font-medium text-red-400 hover:text-red-300">Clear Round</button>}
                            </div>
                             <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg">
                                {round.length > 0 ? (
                                    <ul className="divide-y divide-slate-700">
                                        {round.map((shot, i) => (
                                            <li key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                                                <div className="flex-1 font-medium text-gray-100">Hole {shot.hole} (Par {shot.par})</div>
                                                <div className="flex-1 text-gray-400">{shot.club}</div>
                                                <div className="flex-1 text-gray-400">{shot.distance} yds</div>
                                                <div className="flex-1 text-gray-200 font-semibold">{shot.outcome}</div>
                                            </li>
                                        )).reverse()}
                                    </ul>
                                ) : <p className="text-center text-gray-400 p-8">No shots logged yet. Add your first shot above!</p>}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'analytics' && analytics && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-slate-700/50 rounded-lg"><div className="text-sm text-gray-400">Total Score</div><div className="text-2xl font-bold text-white">{analytics.totalStrokes}</div></div>
                            <div className="p-4 bg-slate-700/50 rounded-lg"><div className="text-sm text-gray-400">vs Par</div><div className={`text-2xl font-bold ${analytics.scoreVsPar > 0 ? 'text-red-400' : 'text-green-400'}`}>{analytics.scoreVsPar > 0 ? '+' : ''}{analytics.scoreVsPar}</div></div>
                            <div className="p-4 bg-slate-700/50 rounded-lg"><div className="text-sm text-gray-400">FIR</div><div className="text-2xl font-bold text-white">{analytics.fir.toFixed(0)}%</div></div>
                            <div className="p-4 bg-slate-700/50 rounded-lg"><div className="text-sm text-gray-400">GIR</div><div className="text-2xl font-bold text-white">{analytics.gir.toFixed(0)}%</div></div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                             <div className="p-4 bg-slate-900/50 rounded-lg">
                                <h4 className="font-bold text-lg text-white mb-4 text-center">Avg. Club Distances (yds)</h4>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={analytics.avgClubDistances}
                                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                            >
                                            <CartesianGrid stroke="#334155" />
                                            <XAxis dataKey="club" tick={{fontSize: 12, fill: '#94a3b8'}}/>
                                            <YAxis tick={{fontSize: 12, fill: '#94a3b8'}}/>
                                            <Tooltip 
                                              formatter={(value) => `${value} yds`}
                                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
                                              itemStyle={{ color: '#e2e8f0' }}
                                              labelStyle={{ color: '#cbd5e1' }}
                                            />
                                            <Bar dataKey="avg" fill="#16a34a" name="Average Distance" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                             <div className="p-4 bg-slate-900/50 rounded-lg">
                                <h4 className="font-bold text-lg text-white mb-2 text-center">Shot Outcomes</h4>
                                <ul className="border border-slate-700 rounded-lg divide-y divide-slate-700 bg-slate-800">
                                    {SHOT_OUTCOMES.map(outcome => analytics.outcomes[outcome] && (
                                        <li key={outcome} className="px-4 py-2 flex justify-between text-sm">
                                            <span className="font-medium text-gray-200">{outcome}</span>
                                            <span className="text-gray-400">{((analytics.outcomes[outcome] / analytics.totalStrokes) * 100).toFixed(0)}% ({analytics.outcomes[outcome]})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShotTracker;
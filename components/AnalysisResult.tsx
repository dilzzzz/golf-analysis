import React from 'react';
import type { SwingAnalysis } from '../types';
import { CheckCircleIcon, WrenchIcon, SparklesIcon, LightBulbIcon, VideoIcon } from './icons';

interface AnalysisResultProps {
  result: SwingAnalysis;
  onReset: () => void;
}

const AnalysisCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    color: string;
}> = ({ title, icon, children, color }) => (
    <div className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden`}>
        <div className={`flex items-center p-4 border-b-2 ${color}`}>
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="p-5 text-gray-300 space-y-4">
            {children}
        </div>
    </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white">Your Swing Analysis is Ready!</h2>
        <p className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto">{result.overallSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnalysisCard title="Strengths" icon={<CheckCircleIcon className="w-7 h-7 text-green-500 mr-3"/>} color="border-green-500">
            <ul className="space-y-3">
                {result.strengths.map((item, index) => (
                    <li key={index} className="p-3 bg-green-900/30 rounded-lg">
                        <p className="font-semibold text-green-300">{item.title}</p>
                        <p className="text-sm text-green-400">{item.description}</p>
                    </li>
                ))}
            </ul>
        </AnalysisCard>
        
        <AnalysisCard title="Areas for Improvement" icon={<WrenchIcon className="w-7 h-7 text-yellow-500 mr-3"/>} color="border-yellow-500">
            <ul className="space-y-3">
                {result.areasForImprovement.map((item, index) => (
                    <li key={index} className="p-3 bg-yellow-900/30 rounded-lg">
                        <p className="font-semibold text-yellow-300">{item.title}</p>
                        <p className="text-sm text-yellow-400">{item.description}</p>
                    </li>
                ))}
            </ul>
        </AnalysisCard>
      </div>

       <AnalysisCard title="Suggested Drills" icon={<LightBulbIcon className="w-7 h-7 text-blue-500 mr-3"/>} color="border-blue-500">
            <ul className="space-y-4">
                {result.suggestedDrills.map((drill, index) => (
                    <li key={index} className="p-4 border border-blue-500/30 bg-blue-900/30 rounded-lg">
                        <h4 className="font-bold text-blue-300">{drill.name}</h4>
                        <p className="mt-1 text-sm text-blue-400 whitespace-pre-wrap">{drill.instructions}</p>
                        {drill.videoUrl && (
                          <a
                            href={drill.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <VideoIcon className="w-4 h-4 mr-1.5" />
                            Watch Drill
                          </a>
                        )}
                    </li>
                ))}
            </ul>
        </AnalysisCard>

      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
        >
          Analyze Another Swing
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
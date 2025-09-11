
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
            <h3 className="text-xl font-bold text-white ml-3">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-white text-center">Your Swing Analysis is Ready!</h2>

      <AnalysisCard
        title="Overall Summary"
        icon={<SparklesIcon className="h-7 w-7 text-yellow-400" />}
        color="border-yellow-500/50"
      >
        <p className="text-gray-300 leading-relaxed">{result.overallSummary}</p>
      </AnalysisCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalysisCard
          title="Strengths"
          icon={<CheckCircleIcon className="h-7 w-7 text-green-400" />}
          color="border-green-500/50"
        >
          <ul className="space-y-4">
            {result.strengths.map((item, index) => (
              <li key={index}>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-gray-300">{item.description}</p>
              </li>
            ))}
          </ul>
        </AnalysisCard>
        
        <AnalysisCard
          title="Areas for Improvement"
          icon={<WrenchIcon className="h-7 w-7 text-red-400" />}
          color="border-red-500/50"
        >
          <ul className="space-y-4">
            {result.areasForImprovement.map((item, index) => (
              <li key={index}>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-gray-300">{item.description}</p>
              </li>
            ))}
          </ul>
        </AnalysisCard>
      </div>

      <AnalysisCard
        title="Suggested Drills"
        icon={<LightBulbIcon className="h-7 w-7 text-blue-400" />}
        color="border-blue-500/50"
      >
        <div className="space-y-6">
          {result.suggestedDrills.map((drill, index) => (
            <div key={index} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-white">{drill.name}</h4>
                  {drill.videoUrl && (
                      <a 
                          href={drill.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-300 bg-red-900/50 hover:bg-red-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                          <VideoIcon className="h-4 w-4 mr-1.5"/>
                          Watch Video
                      </a>
                  )}
              </div>
              <p className="mt-2 text-gray-300 whitespace-pre-wrap">{drill.instructions}</p>
            </div>
          ))}
        </div>
      </AnalysisCard>
      
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          Analyze Another Swing
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import SwingAnalyzer from './components/SwingAnalyzer';
import CourseFinder from './components/CourseFinder';
import ShotTracker from './components/ShotTracker';
import InstructionalContent from './components/InstructionalContent';
import DiscussionForum from './components/DiscussionForum';
import type { SwingAnalysis } from './types';

export type AppState = 'LANDING' | 'ANALYZING' | 'FIND_COURSES' | 'SHOT_TRACKING' | 'INSTRUCTIONAL_CONTENT' | 'COMMUNITY';

const ANALYSIS_LIMIT = 5;
const STORAGE_KEY = 'golfAiUsage';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SwingAnalysis | null>(null);
  const [appKey, setAppKey] = useState<number>(0);
  const [analysisCount, setAnalysisCount] = useState<number>(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const storedUsage = localStorage.getItem(STORAGE_KEY);
      if (storedUsage) {
        const { date, count } = JSON.parse(storedUsage);
        if (date === today) {
          setAnalysisCount(count);
        } else {
          // It's a new day, reset the counter
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
          setAnalysisCount(0);
        }
      } else {
        // No usage data found, initialize it
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      }
    } catch (error) {
      console.error("Failed to read or parse from localStorage:", error);
      // Initialize if storage is corrupt
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const handleVideoUpload = useCallback((file: File) => {
    if (analysisCount >= ANALYSIS_LIMIT) {
      alert("You have reached your daily analysis limit.");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newCount = analysisCount + 1;
    setAnalysisCount(newCount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));

    setVideoFile(file);
    setAnalysisResult(null);
    setAppState('ANALYZING');
  }, [analysisCount]);
  
  const handleAnalysisComplete = useCallback((result: SwingAnalysis) => {
    setAnalysisResult(result);
  }, []);

  const handleReset = useCallback(() => {
    setVideoFile(null);
    setAnalysisResult(null);
    setAppState('LANDING');
    setAppKey(prevKey => prevKey + 1);
  }, []);

  const handleNavigate = useCallback((state: AppState) => {
    if (state === 'LANDING') {
      handleReset();
    } else {
      setAppState(state);
    }
  }, [handleReset]);
  
  const isLimitReached = analysisCount >= ANALYSIS_LIMIT;

  const renderContent = () => {
    switch(appState) {
      case 'FIND_COURSES':
        return <CourseFinder />;
      case 'SHOT_TRACKING':
        return <ShotTracker />;
      case 'INSTRUCTIONAL_CONTENT':
        return <InstructionalContent analysisResult={analysisResult} />;
      case 'COMMUNITY':
        return <DiscussionForum />;
      case 'ANALYZING':
        if (videoFile) {
          return (
            <SwingAnalyzer
              videoFile={videoFile}
              onAnalysisComplete={handleAnalysisComplete}
              onReset={handleReset}
              analysisResult={analysisResult}
            />
          );
        }
        // Fallback to landing if no video file
        return <Landing onVideoUpload={handleVideoUpload} analysisCount={analysisCount} analysisLimit={ANALYSIS_LIMIT} isLimitReached={isLimitReached}/>;
      case 'LANDING':
      default:
        return <Landing onVideoUpload={handleVideoUpload} analysisCount={analysisCount} analysisLimit={ANALYSIS_LIMIT} isLimitReached={isLimitReached} />;
    }
  };

  return (
    <div key={appKey} className="min-h-screen bg-[#252936] text-gray-200 flex flex-col antialiased">
      <Header appState={appState} onNavigate={handleNavigate} />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
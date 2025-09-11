
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeSwing } from '../services/geminiService';
import type { SwingAnalysis } from '../types';
import Loader from './Loader';
import AnalysisResult from './AnalysisResult';

interface SwingAnalyzerProps {
  videoFile: File;
  onAnalysisComplete: (result: SwingAnalysis) => void;
  onReset: () => void;
  analysisResult: SwingAnalysis | null;
}

const SwingAnalyzer: React.FC<SwingAnalyzerProps> = ({ videoFile, onAnalysisComplete, onReset, analysisResult }) => {
  const [frames, setFrames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(videoFile);
    
    const video = document.createElement('video');
    video.src = objectUrl;
    video.muted = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    setIsLoading(true);

    const captureFrame = (time: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            reject(new Error('Canvas context not available.'));
          }
        };
        video.addEventListener('seeked', onSeeked);
        video.currentTime = time;
      });
    };

    video.addEventListener('loadedmetadata', async () => {
      try {
        const duration = video.duration;
        // Extract 8 frames for a more detailed analysis
        const frameTimestamps = [
          duration * 0.1,  // Address
          duration * 0.2,  // Takeaway
          duration * 0.3,  // Mid-Backswing
          duration * 0.4,  // Top of Backswing
          duration * 0.5,  // Transition
          duration * 0.6,  // Impact
          duration * 0.75, // Follow-through
          duration * 0.9   // Finish
        ];
        const framePromises = frameTimestamps.map(time => captureFrame(time));
        const capturedFrames = await Promise.all(framePromises);
        setFrames(capturedFrames);
      } catch (err) {
        setError('Failed to extract frames from the video. Please try another video file.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });
    
    video.addEventListener('error', () => {
      setError('Could not load the video file. It might be corrupted or in an unsupported format.');
      setIsLoading(false);
    });

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  const handleAnalyzeClick = useCallback(async () => {
    if (frames.length === 0) {
      setError('No frames were extracted to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSwing(frames);
      onAnalysisComplete(result);
    } catch (err) {
      setError('An error occurred during AI analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [frames, onAnalysisComplete]);
  
  if (isLoading && frames.length === 0) {
      return <Loader message="Processing your video..." />;
  }
  
  if (error) {
    return (
        <div className="text-center bg-slate-800 p-8 rounded-xl shadow-lg border border-red-500/50">
            <h3 className="text-xl font-semibold text-red-400">An Error Occurred</h3>
            <p className="mt-2 text-gray-300">{error}</p>
            <button
                onClick={onReset}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Try Again
            </button>
        </div>
    );
  }

  if (analysisResult) {
    return <AnalysisResult result={analysisResult} onReset={onReset} />;
  }
  
  if (isLoading) {
    return <Loader message="AI is analyzing your swing..." />;
  }
  
  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-4">Your Swing Preview</h2>
      <p className="text-gray-300 mb-6">We've extracted key frames from your swing. Click the button below to start the AI analysis.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {frames.map((frame, index) => (
          <div key={index} className="rounded-lg overflow-hidden border border-slate-700">
            <img src={frame} alt={`Swing frame ${index + 1}`} className="w-full h-auto object-cover" />
            <div className="bg-slate-900 px-2 py-1 text-center text-xs font-medium text-gray-400">
                Frame {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleAnalyzeClick}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-transform transform hover:scale-105"
        >
          {isLoading ? 'Analyzing...' : 'Analyze My Swing'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Upload Another Video
        </button>
      </div>
    </div>
  );
};

export default SwingAnalyzer;
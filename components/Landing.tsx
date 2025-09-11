
import React, { useRef, useState, useCallback } from 'react';
import { UploadCloudIcon, VideoIcon } from './icons';

interface LandingProps {
  onVideoUpload: (file: File) => void;
  analysisCount: number;
  analysisLimit: number;
  isLimitReached: boolean;
}

const Landing: React.FC<LandingProps> = ({ onVideoUpload, analysisCount, analysisLimit, isLimitReached }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLimitReached) return;
    const file = event.target.files?.[0];
    if (file) {
      onVideoUpload(file);
    }
  };

  const handleButtonClick = () => {
    if (isLimitReached) return;
    fileInputRef.current?.click();
  };
  
  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLimitReached) return;
    setIsDragging(dragging);
  }, [isLimitReached]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (isLimitReached) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
        onVideoUpload(file);
    } else {
        alert("Please drop a valid video file.");
    }
  }, [onVideoUpload, handleDragEvents, isLimitReached]);

  return (
    <div className="text-center bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
      <div className="max-w-md mx-auto">
        <VideoIcon className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-3xl font-extrabold text-white">Analyze Your Golf Swing</h2>
        <p className="mt-2 text-md text-gray-300">
          Upload a video of your swing to get instant, AI-powered feedback. Improve your form, lower your handicap, and play your best golf.
        </p>
      </div>

      <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Today's analyses used: <span className="font-bold text-gray-100">{analysisCount} / {analysisLimit}</span>
          </p>
      </div>

      {isLimitReached && (
        <div className="mt-6 max-w-xl mx-auto p-4 bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-300">
          <p className="font-bold">Daily Limit Reached</p>
          <p className="text-sm">You've used all your analyses for today. Please come back tomorrow to analyze more swings!</p>
        </div>
      )}

      <div className="mt-6 max-w-xl mx-auto flex flex-col items-center gap-6">
        <div 
          className={`w-full border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ${isDragging ? 'border-green-500 bg-green-900/30' : 'border-slate-600'} ${isLimitReached ? 'bg-slate-900 cursor-not-allowed' : ''}`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
        >
          <UploadCloudIcon className={`mx-auto h-12 w-12 ${isLimitReached ? 'text-gray-500' : 'text-gray-400'}`} />
          <div className={`mt-4 flex text-sm justify-center ${isLimitReached ? 'text-gray-500' : 'text-gray-400'}`}>
            <label htmlFor="file-upload" className={`relative rounded-md font-medium  ${isLimitReached ? 'text-slate-500' : 'cursor-pointer bg-slate-800 text-green-400 hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500'}`}>
              <span>Upload a video</span>
              <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} disabled={isLimitReached} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 100MB</p>
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isLimitReached}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
          >
            Select Video File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
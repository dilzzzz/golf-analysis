
import React from 'react';
import { GolfBallIcon } from './icons';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  const bgColor = 'bg-[#2d3240]';
  const textColor = 'text-white';
  const subTextColor = 'text-gray-300';
  const borderColor = 'border-slate-700';
  
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl shadow-lg border ${bgColor} ${borderColor}`}>
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute w-full h-full rounded-full border-4 border-green-200 opacity-50"></div>
        <div className="absolute w-full h-full rounded-full border-t-4 border-green-500 animate-spin"></div>
        <GolfBallIcon className="w-10 h-10 text-green-500" />
      </div>
      <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>{message}</h3>
      <p className={`mt-2 ${subTextColor}`}>This may take a moment. Great swings are worth the wait!</p>
    </div>
  );
};

export default Loader;
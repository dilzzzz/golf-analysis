
import React from 'react';
import { MapPinIcon, ChartBarIcon, VideoIcon, BookOpenIcon, UserGroupIcon, AdjustmentsHorizontalIcon } from './icons';
import type { AppState } from '../App';

interface HeaderProps {
    appState: AppState;
    onNavigate: (state: AppState) => void;
}

const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
  const activeClasses = 'bg-green-500 text-white';
  const inactiveClasses = 'text-gray-300 hover:bg-slate-700 hover:text-white';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ appState, onNavigate }) => {
  return (
    <header className="bg-[#2d3240] border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="https://golfai.one"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            Overview
          </a>

          <div className="flex items-center gap-2">
            <NavButton onClick={() => onNavigate('LANDING')} isActive={appState === 'LANDING' || appState === 'ANALYZING'}>
              <VideoIcon className="h-5 w-5 mr-2" />
              Swing Analyzer
            </NavButton>
            <NavButton onClick={() => onNavigate('CLUB_RECOMMENDER')} isActive={appState === 'CLUB_RECOMMENDER'}>
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              AI Caddie
            </NavButton>
             <NavButton onClick={() => onNavigate('SHOT_TRACKING')} isActive={appState === 'SHOT_TRACKING'}>
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Shot Tracker
            </NavButton>
            <NavButton onClick={() => onNavigate('FIND_COURSES')} isActive={appState === 'FIND_COURSES'}>
              <MapPinIcon className="h-5 w-5 mr-2" />
              Find Courses
            </NavButton>
            <NavButton onClick={() => onNavigate('INSTRUCTIONAL_CONTENT')} isActive={appState === 'INSTRUCTIONAL_CONTENT'}>
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Instructional Content
            </NavButton>
            <NavButton onClick={() => onNavigate('COMMUNITY')} isActive={appState === 'COMMUNITY'}>
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Community
            </NavButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  isSearching: boolean;
  searchProgress: { current: number; total: number; query: string };
}

const Header: React.FC<HeaderProps> = ({ currentView, isSearching, searchProgress }) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'home':
        return 'Welcome to TeleSTOP';
      case 'search':
        return 'Search for Your Information';
      case 'results':
        return 'Search Results';
      case 'optout':
        return 'Opt-Out Instructions';
      case 'tracker':
        return 'Removal Tracker';
      case 'settings':
        return 'Settings';
      default:
        return 'TeleSTOP';
    }
  };

  return (
    <header className="h-14 bg-dark-900 border-b border-dark-700 flex items-center px-4 gap-4">
      {/* Browser-like controls (decorative) */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>

      {/* URL-like bar */}
      <div className="flex-1 flex items-center gap-3 px-4 py-1.5 bg-dark-800 rounded-full max-w-2xl">
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-sm text-dark-300 flex-1 truncate">
          telestop://local/{currentView}
        </span>
        <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">
          Secure
        </span>
      </div>

      {/* Search Progress */}
      {isSearching && searchProgress.total > 0 && (
        <div className="flex items-center gap-3 px-4 py-1.5 bg-dark-800 rounded-full">
          <div className="animate-spin">
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <span className="text-sm text-dark-300">
            Searching {searchProgress.current}/{searchProgress.total}
          </span>
        </div>
      )}

      {/* Page Title */}
      <div className="text-sm font-medium text-dark-300">
        {getViewTitle()}
      </div>
    </header>
  );
};

export default Header;

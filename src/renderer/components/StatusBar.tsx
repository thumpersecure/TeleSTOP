import React from 'react';

interface StatusBarProps {
  message: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ message }) => {
  return (
    <footer className="h-7 bg-dark-900 border-t border-dark-700 flex items-center px-4 text-xs text-dark-400">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span>{message}</span>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <span>Data stored locally only</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
};

export default StatusBar;

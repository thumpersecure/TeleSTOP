import React, { useState } from 'react';
import { TrackedRemoval } from '../types';

interface TrackerViewProps {
  removals: TrackedRemoval[];
  onUpdateStatus: (id: string, status: TrackedRemoval['status']) => void;
  onDelete: (id: string) => void;
  onViewOptOut: (removal: TrackedRemoval) => void;
  onOpenExternal: (url: string) => void;
}

const TrackerView: React.FC<TrackerViewProps> = ({
  removals,
  onUpdateStatus,
  onDelete,
  onViewOptOut,
  onOpenExternal,
}) => {
  const [filter, setFilter] = useState<'all' | TrackedRemoval['status']>('all');

  const filteredRemovals = removals.filter(r => filter === 'all' || r.status === filter);

  const statusCounts = {
    pending: removals.filter(r => r.status === 'pending').length,
    in_progress: removals.filter(r => r.status === 'in_progress').length,
    completed: removals.filter(r => r.status === 'completed').length,
    failed: removals.filter(r => r.status === 'failed').length,
  };

  const getStatusColor = (status: TrackedRemoval['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-800/50';
      case 'in_progress':
        return 'bg-blue-900/50 text-blue-400 border-blue-800/50';
      case 'completed':
        return 'bg-green-900/50 text-green-400 border-green-800/50';
      case 'failed':
        return 'bg-red-900/50 text-red-400 border-red-800/50';
    }
  };

  const getStatusLabel = (status: TrackedRemoval['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (removals.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Tracked Removals</h3>
          <p className="text-dark-400 mb-6">
            Start tracking your removal requests by adding sites from your search results.
            This helps you keep track of which sites you've requested removal from and their status.
          </p>
          <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700 text-left">
            <h4 className="font-medium text-white mb-2">How to use the tracker:</h4>
            <ol className="text-sm text-dark-400 space-y-2">
              <li>1. Search for your information</li>
              <li>2. Click "Add to Tracker" on relevant results</li>
              <li>3. Update status as you work through removals</li>
              <li>4. Mark as completed when your info is removed</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-dark-700 bg-dark-900/50">
        <h2 className="text-2xl font-bold text-white mb-4">Removal Tracker</h2>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-xl">
            <p className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
            <p className="text-sm text-dark-400">Pending</p>
          </div>
          <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
            <p className="text-2xl font-bold text-blue-400">{statusCounts.in_progress}</p>
            <p className="text-sm text-dark-400">In Progress</p>
          </div>
          <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
            <p className="text-2xl font-bold text-green-400">{statusCounts.completed}</p>
            <p className="text-sm text-dark-400">Completed</p>
          </div>
          <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-xl">
            <p className="text-2xl font-bold text-red-400">{statusCounts.failed}</p>
            <p className="text-sm text-dark-400">Failed</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-400 mr-2">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            All ({removals.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' ? 'bg-green-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {filteredRemovals.map((removal) => (
            <div
              key={removal.id}
              className="p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-dark-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(removal.status)}`}>
                  {getStatusLabel(removal.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1">{removal.siteName}</h3>
                  <p className="text-sm text-primary-400 truncate cursor-pointer hover:underline" onClick={() => onOpenExternal(removal.url)}>
                    {removal.url}
                  </p>
                  <p className="text-xs text-dark-500 mt-2">
                    Added {formatDate(removal.dateAdded)}
                    {removal.dateCompleted && ` • Completed ${formatDate(removal.dateCompleted)}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={removal.status}
                    onChange={(e) => onUpdateStatus(removal.id, e.target.value as TrackedRemoval['status'])}
                    className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>

                  <button
                    onClick={() => onViewOptOut(removal)}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
                    title="View opt-out instructions"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onOpenExternal(removal.url)}
                    className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    title="Open in browser"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDelete(removal.id)}
                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackerView;

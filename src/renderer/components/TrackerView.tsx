import React, { useState } from 'react';
import { TrackedRemoval } from '../types';
import { Button, Card, Badge } from './ui';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRemovals = removals
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r =>
      searchQuery === '' ||
      r.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const statusCounts = {
    pending: removals.filter(r => r.status === 'pending').length,
    in_progress: removals.filter(r => r.status === 'in_progress').length,
    completed: removals.filter(r => r.status === 'completed').length,
    failed: removals.filter(r => r.status === 'failed').length,
  };

  const completionRate = removals.length > 0
    ? Math.round((statusCounts.completed / removals.length) * 100)
    : 0;

  const getStatusIcon = (status: TrackedRemoval['status']) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadgeVariant = (status: TrackedRemoval['status']): 'warning' | 'info' | 'success' | 'danger' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
    }
  };

  const getStatusLabel = (status: TrackedRemoval['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
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

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (removals.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-dark-700">
            <svg className="w-12 h-12 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Tracked Removals</h3>
          <p className="text-dark-400 mb-8 leading-relaxed">
            Start tracking your removal requests by adding sites from your search results or the Add Site page.
          </p>
          <Card variant="gradient" className="text-left">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to use the tracker
            </h4>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Search for your information using the Home page' },
                { step: '2', text: 'Add sites where your info appears to the tracker' },
                { step: '3', text: 'Follow opt-out guides to request removal' },
                { step: '4', text: 'Update status as you complete each removal' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">
                    {item.step}
                  </span>
                  <span className="text-sm text-dark-300">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Stats */}
      <div className="p-6 border-b border-dark-700 bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Removal Tracker</h2>
            <p className="text-sm text-dark-400 mt-1">Track your privacy protection progress</p>
          </div>
          {/* Progress Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-dark-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${completionRate * 1.76} 176`}
                  className="text-green-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{completionRate}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-400">Completion</p>
              <p className="text-xs text-dark-500">{statusCounts.completed} of {removals.length}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'yellow', icon: '⏳' },
            { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress, color: 'blue', icon: '🔄' },
            { key: 'completed', label: 'Completed', count: statusCounts.completed, color: 'green', icon: '✓' },
            { key: 'failed', label: 'Failed', count: statusCounts.failed, color: 'red', icon: '✗' },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(filter === stat.key ? 'all' : stat.key as TrackedRemoval['status'])}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                filter === stat.key
                  ? `bg-${stat.color}-900/40 border-${stat.color}-500/50 ring-2 ring-${stat.color}-500/30`
                  : `bg-${stat.color}-900/20 border-${stat.color}-800/30 hover:border-${stat.color}-700/50`
              }`}
              style={{
                backgroundColor: filter === stat.key
                  ? `rgba(var(--${stat.color}-900), 0.4)`
                  : `rgba(var(--${stat.color}-900), 0.2)`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-3xl font-bold text-${stat.color}-400`}>{stat.count}</span>
                <span className="text-lg opacity-50">{stat.icon}</span>
              </div>
              <p className="text-sm text-dark-400">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
            {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-dark-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredRemovals.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-dark-400">No matching removals found</p>
            <button onClick={() => { setFilter('all'); setSearchQuery(''); }} className="text-primary-400 text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRemovals.map((removal, index) => (
              <div
                key={removal.id}
                className="group p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-dark-600 hover:bg-dark-800 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    removal.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                    removal.status === 'in_progress' ? 'bg-blue-900/30 text-blue-400' :
                    removal.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {getStatusIcon(removal.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{removal.siteName}</h3>
                      <Badge variant={getStatusBadgeVariant(removal.status)} size="sm">
                        {getStatusLabel(removal.status)}
                      </Badge>
                    </div>
                    <p
                      className="text-sm text-primary-400/80 truncate cursor-pointer hover:text-primary-400 hover:underline"
                      onClick={() => onOpenExternal(removal.url)}
                    >
                      {removal.domain}
                    </p>
                    <p className="text-xs text-dark-500 mt-1.5 flex items-center gap-2">
                      <span>Added {getRelativeTime(removal.dateAdded)}</span>
                      {removal.dateCompleted && (
                        <>
                          <span className="text-dark-600">•</span>
                          <span className="text-green-500">Completed {getRelativeTime(removal.dateCompleted)}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Quick Status Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {removal.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateStatus(removal.id, 'completed')}
                        className="p-2 text-green-500 hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {removal.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(removal.id, 'in_progress')}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Start working"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewOptOut(removal)}
                      title="View opt-out guide"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenExternal(removal.url)}
                      title="Open in browser"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(removal.id)}
                      title="Delete"
                      className="text-dark-400 hover:text-red-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerView;

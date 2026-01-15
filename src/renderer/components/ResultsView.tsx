import React, { useState } from 'react';
import { SearchResult } from '../types';

interface ResultsViewProps {
  results: SearchResult[];
  selectedResults: SearchResult[];
  isSearching: boolean;
  searchProgress: { current: number; total: number; query: string };
  onSelectResult: (result: SearchResult) => void;
  onViewOptOut: (result: SearchResult) => void;
  onAddToTracker: (result: SearchResult) => void;
  onOpenExternal: (url: string) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  selectedResults,
  isSearching,
  searchProgress,
  onSelectResult,
  onViewOptOut,
  onAddToTracker,
  onOpenExternal,
}) => {
  const [filter, setFilter] = useState<'all' | 'people-search' | 'other'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredResults = results.filter(result => {
    const matchesType = filter === 'all' ||
      (filter === 'people-search' && result.isPeopleSearchSite) ||
      (filter === 'other' && !result.isPeopleSearchSite);

    const matchesSearch = searchFilter === '' ||
      result.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      result.domain.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesType && matchesSearch;
  });

  const peopleSearchCount = results.filter(r => r.isPeopleSearchSite).length;
  const isSelected = (result: SearchResult) => selectedResults.some(r => r.url === result.url);

  if (isSearching && results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Searching...</h3>
          <p className="text-dark-400 mb-4">Query {searchProgress.current} of {searchProgress.total}</p>
          <p className="text-sm text-dark-500 max-w-md mx-auto truncate px-4">
            {searchProgress.query}
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0 && !isSearching) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
          <p className="text-dark-400">Enter your personal information and start a search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 bg-dark-900/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isSearching ? 'Searching...' : `Found ${results.length} Results`}
            </h2>
            <p className="text-sm text-dark-400">
              {peopleSearchCount} from known people-search sites
            </p>
          </div>
          {selectedResults.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-400">{selectedResults.length} selected</span>
              <button
                onClick={() => selectedResults.forEach(r => onAddToTracker(r))}
                className="btn-primary text-sm py-2"
              >
                Add Selected to Tracker
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-dark-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setFilter('people-search')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'people-search' ? 'bg-yellow-600 text-white' : 'text-dark-400 hover:text-white'
              }`}
            >
              People Search ({peopleSearchCount})
            </button>
            <button
              onClick={() => setFilter('other')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'other' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white'
              }`}
            >
              Other ({results.length - peopleSearchCount})
            </button>
          </div>

          <input
            type="text"
            placeholder="Filter results..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 max-w-xs px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Search Progress Bar */}
      {isSearching && (
        <div className="px-4 py-2 bg-dark-800/50 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${(searchProgress.current / searchProgress.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-dark-400">{searchProgress.current}/{searchProgress.total}</span>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {filteredResults.map((result, index) => (
            <div
              key={result.url + index}
              className={`p-4 bg-dark-800 border rounded-lg transition-all duration-200 ${
                isSelected(result)
                  ? 'border-primary-500 bg-dark-800/80'
                  : result.isPeopleSearchSite
                  ? 'border-l-4 border-l-yellow-500 border-dark-700 hover:border-dark-600'
                  : 'border-dark-700 hover:border-dark-600'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => onSelectResult(result)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected(result)
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-dark-500 hover:border-primary-400'
                  }`}
                >
                  {isSelected(result) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {result.isPeopleSearchSite && (
                      <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs font-medium rounded">
                        People Search Site
                      </span>
                    )}
                    <span className="text-xs text-dark-500 truncate">{result.domain}</span>
                  </div>

                  <h3 className="text-white font-medium mb-1 line-clamp-1">{result.title}</h3>

                  <p className="text-sm text-primary-400 truncate mb-2 cursor-pointer hover:underline" onClick={() => onOpenExternal(result.url)}>
                    {result.url}
                  </p>

                  {result.snippet && (
                    <p className="text-sm text-dark-400 line-clamp-2">{result.snippet}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onOpenExternal(result.url)}
                    className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    title="Open in browser"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onViewOptOut(result)}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    View Opt-Out
                  </button>

                  <button
                    onClick={() => onAddToTracker(result)}
                    className="p-2 text-dark-400 hover:text-green-400 hover:bg-dark-700 rounded-lg transition-colors"
                    title="Add to tracker"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

export default ResultsView;

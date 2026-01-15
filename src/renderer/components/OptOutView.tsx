import React, { useState } from 'react';
import { SearchResult, OptOutInstructions } from '../types';

interface OptOutViewProps {
  result: SearchResult;
  instructions: OptOutInstructions;
  onOpenExternal: (url: string) => void;
  onAddToTracker: (result: SearchResult) => void;
  onBack: () => void;
}

const OptOutView: React.FC<OptOutViewProps> = ({
  result,
  instructions,
  onOpenExternal,
  onAddToTracker,
  onBack,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showTips, setShowTips] = useState(true);

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const progressPercentage = (completedSteps.size / instructions.steps.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'hard':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-dark-400 bg-dark-800';
    }
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-900 border-b border-dark-700 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{instructions.siteName} Opt-Out Guide</h2>
            <p className="text-sm text-dark-400">{result.domain}</p>
          </div>
          <button
            onClick={() => onAddToTracker(result)}
            className="btn-secondary text-sm"
          >
            Add to Tracker
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-dark-400">Progress</span>
            <span className="text-white font-medium">{completedSteps.size}/{instructions.steps.length} steps</span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        {/* AI Assistant Header */}
        <div className="flex items-start gap-4 mb-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-white">
              I'll guide you through removing your information from <strong>{instructions.siteName}</strong>.
              This process is rated as <span className={`px-2 py-0.5 rounded text-sm font-medium ${getDifficultyColor(instructions.difficulty)}`}>{instructions.difficulty}</span> difficulty
              and typically takes <strong>{instructions.estimatedTime}</strong>.
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-dark-400">Time Required</span>
            </div>
            <p className="text-white font-medium">{instructions.estimatedTime}</p>
          </div>

          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-dark-400">Email Needed</span>
            </div>
            <p className="text-white font-medium">{instructions.requiresEmail ? 'Yes' : 'No'}</p>
          </div>

          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <span className="text-sm text-dark-400">ID Required</span>
            </div>
            <p className="text-white font-medium">{instructions.requiresId ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Opt-Out URL */}
        {instructions.optOutUrl && (
          <div className="mb-6 p-4 bg-primary-900/20 border border-primary-800/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-400 mb-1">Direct Opt-Out Link</p>
                <p className="text-white font-medium">{instructions.optOutUrl}</p>
              </div>
              <button
                onClick={() => onOpenExternal(instructions.optOutUrl!)}
                className="btn-primary"
              >
                Open Page
              </button>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Step-by-Step Instructions</h3>
          <div className="space-y-3">
            {instructions.steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  completedSteps.has(index)
                    ? 'bg-green-900/20 border-green-800/30'
                    : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                }`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      completedSteps.has(index)
                        ? 'bg-green-600 text-white'
                        : 'bg-dark-700 text-dark-400'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <p className={`flex-1 ${completedSteps.has(index) ? 'text-green-300' : 'text-white'}`}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {instructions.notes && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-400 mb-1">Important Note</p>
                <p className="text-dark-300">{instructions.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-3"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showTips ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Helpful Tips</span>
          </button>

          {showTips && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-dark-300">Take screenshots of each step as proof of your opt-out request</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-dark-300">Use a dedicated email address for opt-out requests to track responses</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-dark-300">Set a reminder to check back in 1-2 weeks to verify removal</p>
              </div>
              <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-700 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-dark-300">For California residents: Reference your CCPA rights for faster processing</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
          <button
            onClick={() => onOpenExternal(result.url)}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Original Page
          </button>
          <button
            onClick={() => onAddToTracker(result)}
            className="btn-success flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Add to Removal Tracker
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptOutView;

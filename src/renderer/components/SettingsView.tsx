import React, { useState } from 'react';
import { PersonalInfo } from '../types';

interface SettingsViewProps {
  personalInfo: PersonalInfo;
  onUpdateInfo: (info: PersonalInfo) => void;
  onClearAllData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  personalInfo,
  onUpdateInfo,
  onClearAllData,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearData = () => {
    onClearAllData();
    setShowConfirmClear(false);
  };

  const hasData = personalInfo.fullName ||
    personalInfo.emails.length > 0 ||
    personalInfo.phones.length > 0 ||
    personalInfo.addresses.length > 0;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        {/* Privacy Section */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Privacy & Security
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-green-400">100% Local Storage</p>
                  <p className="text-sm text-dark-400 mt-1">
                    All your personal information is stored only on your computer.
                    Nothing is ever sent to external servers.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-green-400">Encrypted Storage</p>
                  <p className="text-sm text-dark-400 mt-1">
                    Your data is encrypted on disk to protect it from unauthorized access.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-green-400">No Tracking</p>
                  <p className="text-sm text-dark-400 mt-1">
                    TeleSTOP does not track your usage, collect analytics, or send any telemetry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stored Data Section */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Stored Data
          </h3>

          {hasData ? (
            <div className="space-y-3">
              {personalInfo.fullName && (
                <div className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-xs text-dark-400 mb-1">Name</p>
                  <p className="text-white">{personalInfo.fullName}</p>
                </div>
              )}

              {personalInfo.emails.length > 0 && (
                <div className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-xs text-dark-400 mb-1">Emails ({personalInfo.emails.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.emails.map((email, i) => (
                      <span key={i} className="px-2 py-1 bg-dark-600 rounded text-sm text-white">{email}</span>
                    ))}
                  </div>
                </div>
              )}

              {personalInfo.phones.length > 0 && (
                <div className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-xs text-dark-400 mb-1">Phone Numbers ({personalInfo.phones.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.phones.map((phone, i) => (
                      <span key={i} className="px-2 py-1 bg-dark-600 rounded text-sm text-white">{phone}</span>
                    ))}
                  </div>
                </div>
              )}

              {personalInfo.addresses.length > 0 && (
                <div className="p-3 bg-dark-700/50 rounded-lg">
                  <p className="text-xs text-dark-400 mb-1">Addresses ({personalInfo.addresses.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.addresses.map((address, i) => (
                      <span key={i} className="px-2 py-1 bg-dark-600 rounded text-sm text-white">{address}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-dark-400">No personal information stored yet.</p>
          )}
        </div>

        {/* Data Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Data Management
          </h3>

          <p className="text-dark-400 mb-4">
            Delete all stored data including your personal information, search history, and tracked removals.
            This action cannot be undone.
          </p>

          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="btn-danger"
            >
              Clear All Data
            </button>
          ) : (
            <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-xl">
              <p className="text-red-400 font-medium mb-3">Are you sure you want to delete all data?</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearData}
                  className="btn-danger"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mt-8 text-center text-dark-500 text-sm">
          <p className="mb-2">TeleSTOP v1.0.0</p>
          <p>A privacy-focused tool to help you find and remove your personal information from the web.</p>
          <p className="mt-2">Your data stays on your device. Always.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

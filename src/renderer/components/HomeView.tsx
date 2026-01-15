import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '../types';

interface HomeViewProps {
  personalInfo: PersonalInfo;
  onUpdateInfo: (info: PersonalInfo) => void;
  onOpenExternal: (url: string) => void;
  setStatusMessage: (msg: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ personalInfo, onUpdateInfo, onOpenExternal, setStatusMessage }) => {
  const [info, setInfo] = useState<PersonalInfo>(personalInfo);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showExtensionBanner, setShowExtensionBanner] = useState(true);

  useEffect(() => {
    setInfo(personalInfo);
  }, [personalInfo]);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const handleAddEmail = () => {
    if (newEmail.trim()) {
      const updated = { ...info, emails: [...info.emails, newEmail.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewEmail('');
    }
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      const updated = { ...info, phones: [...info.phones, newPhone.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewPhone('');
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      const updated = { ...info, addresses: [...info.addresses, newAddress.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewAddress('');
    }
  };

  const handleRemoveItem = (field: 'emails' | 'phones' | 'addresses', index: number) => {
    const updated = { ...info, [field]: info[field].filter((_, i) => i !== index) };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const generateSearchQueries = (): string[] => {
    const queries: string[] = [];
    const peopleSearchSites = 'site:spokeo.com OR site:whitepages.com OR site:beenverified.com OR site:truepeoplesearch.com OR site:fastpeoplesearch.com OR site:radaris.com';

    if (info.fullName) {
      const name = info.fullName.trim();
      queries.push(`"${name}" (${peopleSearchSites})`);
      queries.push(`"${name}" address phone`);
      if (info.city && info.state) {
        queries.push(`"${name}" "${info.city}, ${info.state}"`);
      } else if (info.state) {
        queries.push(`"${name}" "${info.state}"`);
      }
    }

    for (const phone of info.phones.filter(p => p.trim())) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 10) {
        const area = cleanPhone.slice(0, 3);
        const exchange = cleanPhone.slice(3, 6);
        const subscriber = cleanPhone.slice(6);
        queries.push(`"${cleanPhone}" OR "${area}-${exchange}-${subscriber}" OR "(${area}) ${exchange}-${subscriber}"`);
      } else {
        queries.push(`"${phone}"`);
      }
    }

    for (const email of info.emails.filter(e => e.trim())) {
      queries.push(`"${email}"`);
    }

    for (const address of info.addresses.filter(a => a.trim())) {
      queries.push(`"${address}"`);
    }

    return queries;
  };

  const handleOpenAllSearches = async () => {
    const queries = generateSearchQueries();
    if (queries.length === 0) {
      setStatusMessage('Please enter some information first');
      return;
    }

    setIsSearching(true);
    setStatusMessage(`Opening ${queries.length} searches in browser...`);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      await onOpenExternal(url);
      setStatusMessage(`Opened search ${i + 1} of ${queries.length}`);
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsSearching(false);
    setStatusMessage(`Opened ${queries.length} searches. Use xTELENUMSINT to analyze results!`);
  };

  const handleOpenSingleSearch = async (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await onOpenExternal(url);
    setStatusMessage('Opened search in browser');
  };

  const canSearch = info.fullName.trim() || info.emails.length > 0 || info.phones.length > 0 || info.addresses.length > 0;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Extension Install Banner */}
        {showExtensionBanner && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-primary-900/40 border border-purple-700/50 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Install xTELENUMSINT Extension (Recommended)</h3>
                <p className="text-sm text-dark-300 mb-3">
                  Enhance TeleSTOP with advanced pattern extraction. The xTELENUMSINT Chrome extension automatically
                  detects names, emails, usernames, and locations from search results.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenExternal('https://github.com/thumpersecure/xTELENUMSINT')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Get Extension
                  </button>
                  <button
                    onClick={() => setShowExtensionBanner(false)}
                    className="px-4 py-2 text-dark-400 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowExtensionBanner(false)}
                className="text-dark-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Find & Remove Your Personal Information</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Enter your details, open searches in Chrome, and use the opt-out guides to remove your info.
            <span className="text-green-400"> 100% local - no APIs, no servers.</span>
          </p>
        </div>

        {/* Input Form */}
        <div className="grid gap-6">
          {/* Name Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Name
            </h3>
            <input
              type="text"
              placeholder="Enter your full name (e.g., John Michael Smith)"
              value={info.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="browser-input"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City (optional)"
                value={info.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="browser-input"
              />
              <input
                type="text"
                placeholder="State (optional)"
                value={info.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="browser-input"
              />
            </div>
          </div>

          {/* Phone Section */}
          <div className="card border-purple-800/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Numbers
              <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full ml-auto">Best with xTELENUMSINT</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter a phone number (any format)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddPhone} className="btn-primary">Add</button>
            </div>
            {info.phones.length > 0 && (
              <div className="space-y-2 mt-4">
                {info.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-dark-700/50 rounded-lg">
                    <span className="flex-1 text-white font-mono">{phone}</span>
                    <button
                      onClick={async () => {
                        if (window.electronAPI) {
                          await window.electronAPI.openSmartSearch(phone);
                          setStatusMessage('Opened Smart Search (all formats with OR)');
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg"
                    >
                      Smart Search
                    </button>
                    <button
                      onClick={async () => {
                        if (window.electronAPI) {
                          const count = await window.electronAPI.openPhoneSearchTabs(phone);
                          setStatusMessage(`Opened ${count} tabs - use xTELENUMSINT to analyze!`);
                        }
                      }}
                      className="px-3 py-1.5 bg-dark-600 hover:bg-dark-500 text-white text-xs font-medium rounded-lg"
                    >
                      Multi-Tab (10+)
                    </button>
                    <button onClick={() => handleRemoveItem('phones', index)} className="p-1.5 text-dark-400 hover:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Addresses
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter an email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddEmail} className="btn-primary">Add</button>
            </div>
            {info.emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.emails.map((email, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
                    {email}
                    <button onClick={() => handleOpenSingleSearch(`"${email}"`)} className="text-primary-400 hover:text-primary-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemoveItem('emails', index)} className="text-dark-400 hover:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Addresses
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a street address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddAddress} className="btn-primary">Add</button>
            </div>
            {info.addresses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.addresses.map((address, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
                    {address}
                    <button onClick={() => handleOpenSingleSearch(`"${address}"`)} className="text-primary-400 hover:text-primary-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemoveItem('addresses', index)} className="text-dark-400 hover:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleOpenAllSearches}
            disabled={!canSearch || isSearching}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              canSearch && !isSearching
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg'
                : 'bg-dark-700 text-dark-400 cursor-not-allowed'
            }`}
          >
            {isSearching ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening searches...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open All Searches in Browser
              </>
            )}
          </button>

          {/* Queries Preview */}
          {canSearch && (
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700">
              <h4 className="text-sm font-medium text-dark-400 mb-3">Generated Queries ({generateSearchQueries().length})</h4>
              <div className="space-y-2 max-h-32 overflow-auto">
                {generateSearchQueries().map((query, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 text-dark-300 truncate font-mono text-xs">{query}</span>
                    <button onClick={() => handleOpenSingleSearch(query)} className="text-primary-400 hover:text-primary-300 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;

import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '../types';
import { Button, Card, Badge } from './ui';

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
  const [showQueryPreview, setShowQueryPreview] = useState(false);

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
  const itemCount = (info.fullName.trim() ? 1 : 0) + info.emails.length + info.phones.length + info.addresses.length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Extension Install Banner */}
        {showExtensionBanner && (
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-primary-900/60 border border-purple-500/30 shadow-lg shadow-purple-900/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative p-5 flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">Supercharge with xTELENUMSINT</h3>
                  <Badge variant="warning" size="sm">Recommended</Badge>
                </div>
                <p className="text-sm text-purple-200/80 mb-4">
                  Our Chrome extension automatically detects phone numbers, emails, and usernames from search results with advanced pattern extraction.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenExternal('https://github.com/thumpersecure/xTELENUMSINT')}
                    leftIcon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    }
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    Get Extension
                  </Button>
                  <button
                    onClick={() => setShowExtensionBanner(false)}
                    className="text-sm text-purple-300/60 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowExtensionBanner(false)}
                className="text-purple-300/40 hover:text-white p-1 transition-colors"
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6 shadow-xl shadow-primary-900/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Find & Remove Your Personal Information</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Enter your details below, then search to find where your info appears online.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="success" dot>100% Local</Badge>
            <Badge variant="info">No APIs</Badge>
            <Badge variant="primary">Encrypted Storage</Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        {itemCount > 0 && (
          <div className="mb-6 flex items-center justify-between p-3 bg-dark-800/50 rounded-xl border border-dark-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-400">{itemCount}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Items to Search</p>
                <p className="text-xs text-dark-400">{generateSearchQueries().length} queries will be generated</p>
              </div>
            </div>
            <button
              onClick={() => setShowQueryPreview(!showQueryPreview)}
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              {showQueryPreview ? 'Hide' : 'Preview'} Queries
              <svg className={`w-4 h-4 transition-transform ${showQueryPreview ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Query Preview Panel */}
        {showQueryPreview && canSearch && (
          <div className="mb-6 p-4 bg-dark-900 rounded-xl border border-dark-700 animate-slide-in">
            <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
              </svg>
              Generated Search Queries
            </h4>
            <div className="space-y-2 max-h-40 overflow-auto custom-scrollbar">
              {generateSearchQueries().map((query, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg group hover:bg-dark-700 transition-colors">
                  <span className="w-6 h-6 bg-dark-700 rounded text-xs flex items-center justify-center text-dark-400 font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-dark-300 truncate font-mono text-xs">{query}</span>
                  <button
                    onClick={() => handleOpenSingleSearch(query)}
                    className="opacity-0 group-hover:opacity-100 text-primary-400 hover:text-primary-300 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="space-y-5">
          {/* Name Section */}
          <Card variant="gradient" className="group hover:border-primary-700/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Your Name</h3>
                <p className="text-xs text-dark-400">Used to search people-finder sites</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter your full name (e.g., John Michael Smith)"
              value={info.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                placeholder="City (optional)"
                value={info.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="px-4 py-2.5 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              />
              <input
                type="text"
                placeholder="State (optional)"
                value={info.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="px-4 py-2.5 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </Card>

          {/* Phone Section */}
          <Card variant="gradient" className="border-purple-800/30 group hover:border-purple-700/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Phone Numbers</h3>
                <p className="text-xs text-dark-400">Multiple formats searched automatically</p>
              </div>
              <Badge variant="warning" size="sm">Best with xTELENUMSINT</Badge>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter a phone number (any format)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
                className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <Button onClick={handleAddPhone} className="bg-purple-600 hover:bg-purple-500">Add</Button>
            </div>
            {info.phones.length > 0 && (
              <div className="space-y-2 mt-4">
                {info.phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 group/item hover:border-purple-700/30 transition-colors">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="flex-1 text-white font-mono text-sm">{phone}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (window.electronAPI) {
                            await window.electronAPI.openSmartSearch(phone);
                            setStatusMessage('Opened Smart Search (all formats with OR)');
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-500"
                      >
                        Smart Search
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          if (window.electronAPI) {
                            const count = await window.electronAPI.openPhoneSearchTabs(phone);
                            setStatusMessage(`Opened ${count} tabs - use xTELENUMSINT to analyze!`);
                          }
                        }}
                      >
                        Multi-Tab
                      </Button>
                      <button onClick={() => handleRemoveItem('phones', index)} className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Email Section */}
          <Card variant="gradient" className="group hover:border-primary-700/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Email Addresses</h3>
                <p className="text-xs text-dark-400">Find accounts and data breaches</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter an email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <Button onClick={handleAddEmail}>Add</Button>
            </div>
            {info.emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-dark-900/50 rounded-lg border border-dark-700/50 group/tag hover:border-primary-700/30 transition-colors">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-white">{email}</span>
                    <button onClick={() => handleOpenSingleSearch(`"${email}"`)} className="text-primary-400 hover:text-primary-300 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemoveItem('emails', index)} className="text-dark-400 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Address Section */}
          <Card variant="gradient" className="group hover:border-primary-700/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Addresses</h3>
                <p className="text-xs text-dark-400">Find property records and listings</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a street address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                className="flex-1 px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <Button onClick={handleAddAddress}>Add</Button>
            </div>
            {info.addresses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-dark-900/50 rounded-lg border border-dark-700/50 group/tag hover:border-primary-700/30 transition-colors">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm text-white">{address}</span>
                    <button onClick={() => handleOpenSingleSearch(`"${address}"`)} className="text-primary-400 hover:text-primary-300 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemoveItem('addresses', index)} className="text-dark-400 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Search Button */}
          <button
            onClick={handleOpenAllSearches}
            disabled={!canSearch || isSearching}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
              canSearch && !isSearching
                ? 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white shadow-xl shadow-primary-900/30 hover:shadow-primary-800/40 hover:-translate-y-0.5'
                : 'bg-dark-800 text-dark-500 cursor-not-allowed border border-dark-700'
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Open All Searches in Browser
                {canSearch && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                    {generateSearchQueries().length} queries
                  </span>
                )}
              </>
            )}
          </button>

          {/* How It Works */}
          <div className="mt-8 p-5 bg-dark-900/50 rounded-xl border border-dark-700">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Enter Info', desc: 'Add your personal details' },
                { step: '2', title: 'Search', desc: 'Open searches in Chrome' },
                { step: '3', title: 'Find Sites', desc: 'Identify where your info appears' },
                { step: '4', title: 'Opt Out', desc: 'Follow our removal guides' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary-400 font-bold">{item.step}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-dark-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

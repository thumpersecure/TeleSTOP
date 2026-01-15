import React, { useState } from 'react';

interface AddSiteViewProps {
  onAddToTracker: (site: { url: string; domain: string; siteName: string }) => void;
  onViewOptOut: (domain: string, url?: string) => void;
}

// List of common people-search sites for quick add
const commonSites = [
  { name: 'Spokeo', domain: 'spokeo.com' },
  { name: 'Whitepages', domain: 'whitepages.com' },
  { name: 'BeenVerified', domain: 'beenverified.com' },
  { name: 'TruePeopleSearch', domain: 'truepeoplesearch.com' },
  { name: 'FastPeopleSearch', domain: 'fastpeoplesearch.com' },
  { name: 'Radaris', domain: 'radaris.com' },
  { name: 'MyLife', domain: 'mylife.com' },
  { name: 'Instant Checkmate', domain: 'instantcheckmate.com' },
  { name: 'TruthFinder', domain: 'truthfinder.com' },
  { name: 'PeopleFinder', domain: 'peoplefinder.com' },
  { name: 'FamilyTreeNow', domain: 'familytreenow.com' },
  { name: 'PeekYou', domain: 'peekyou.com' },
  { name: 'Nuwber', domain: 'nuwber.com' },
  { name: 'USPhonebook', domain: 'usphonebook.com' },
  { name: 'ThatsThem', domain: 'thatsthem.com' },
  { name: 'CocoFinder', domain: 'cocofinder.com' },
  { name: 'IDCrawl', domain: 'idcrawl.com' },
  { name: 'ZabaSearch', domain: 'zabasearch.com' },
  { name: 'AnyWho', domain: 'anywho.com' },
  { name: 'Addresses.com', domain: 'addresses.com' },
];

const AddSiteView: React.FC<AddSiteViewProps> = ({ onAddToTracker, onViewOptOut }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const extractDomain = (inputUrl: string): string => {
    try {
      let cleanUrl = inputUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const urlObj = new URL(cleanUrl);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  const handleAddUrl = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const domain = extractDomain(url);
    if (!domain) {
      setError('Invalid URL format');
      return;
    }

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    onAddToTracker({
      url: fullUrl,
      domain: domain,
      siteName: domain,
    });

    setUrl('');
    setError('');
  };

  const handleQuickAdd = (site: { name: string; domain: string }) => {
    onAddToTracker({
      url: `https://${site.domain}`,
      domain: site.domain,
      siteName: site.name,
    });
  };

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Add Site to Tracker</h2>
          <p className="text-dark-400">
            Add sites you found in your browser search to track your removal progress.
            Paste a URL or select from common people-search sites.
          </p>
        </div>

        {/* URL Input */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Add by URL
          </h3>
          <p className="text-sm text-dark-400 mb-4">
            Copy a URL from your browser search results and paste it here.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste URL (e.g., https://spokeo.com/John-Smith)"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
              className="browser-input flex-1"
            />
            <button onClick={handleAddUrl} className="btn-primary">
              Add to Tracker
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-400 mt-2">{error}</p>
          )}
        </div>

        {/* Quick Add */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Add - Common People Search Sites
          </h3>
          <p className="text-sm text-dark-400 mb-4">
            Click to add these common people-search sites to your tracker. You can then view opt-out instructions.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {commonSites.map((site) => (
              <div
                key={site.domain}
                className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{site.name}</p>
                  <p className="text-xs text-dark-400">{site.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOptOut(site.domain)}
                    className="px-3 py-1.5 text-primary-400 hover:text-primary-300 text-xs font-medium"
                  >
                    Opt-Out Guide
                  </button>
                  <button
                    onClick={() => handleQuickAdd(site)}
                    className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium rounded-lg"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips
          </h4>
          <ul className="text-sm text-dark-400 space-y-1">
            <li>1. Search for yourself using the Home page</li>
            <li>2. When you find a profile, copy the URL from your browser</li>
            <li>3. Paste the URL here to add it to your tracker</li>
            <li>4. Use the tracker to follow opt-out guides and track progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddSiteView;

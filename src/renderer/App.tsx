import React, { useState, useEffect, useCallback } from 'react';
import { PersonalInfo, SearchResult, TrackedRemoval, ViewType, OptOutInstructions } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import ResultsView from './components/ResultsView';
import OptOutView from './components/OptOutView';
import TrackerView from './components/TrackerView';
import SettingsView from './components/SettingsView';
import StatusBar from './components/StatusBar';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    emails: [],
    phones: [],
    addresses: [],
    city: '',
    state: '',
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [trackedRemovals, setTrackedRemovals] = useState<TrackedRemoval[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ current: 0, total: 0, query: '' });
  const [currentOptOut, setCurrentOptOut] = useState<{ result: SearchResult; instructions: OptOutInstructions } | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready');

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      if (window.electronAPI) {
        const savedInfo = await window.electronAPI.getPersonalInfo();
        if (savedInfo) {
          setPersonalInfo(savedInfo);
        }
        const savedRemovals = await window.electronAPI.getTrackedRemovals();
        if (savedRemovals) {
          setTrackedRemovals(savedRemovals);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const savePersonalInfo = useCallback(async (info: PersonalInfo) => {
    setPersonalInfo(info);
    if (window.electronAPI) {
      await window.electronAPI.savePersonalInfo(info);
    }
  }, []);

  const handleSearch = async (info: PersonalInfo) => {
    setIsSearching(true);
    setSearchResults([]);
    setSelectedResults([]);
    setCurrentView('results');
    setStatusMessage('Starting search...');

    try {
      const queries = generateSearchQueries(info);
      const allResults: SearchResult[] = [];
      const seenUrls = new Set<string>();

      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        setSearchProgress({ current: i + 1, total: queries.length, query });
        setStatusMessage(`Searching: ${query.substring(0, 50)}...`);

        try {
          if (window.electronAPI) {
            const results = await window.electronAPI.searchGoogle(query);
            for (const result of results) {
              if (!seenUrls.has(result.url)) {
                seenUrls.add(result.url);
                allResults.push(result);
              }
            }
            setSearchResults([...allResults]);
          }
        } catch (error) {
          console.error(`Error searching for "${query}":`, error);
        }

        // Small delay between searches to avoid rate limiting
        if (i < queries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // Sort results: people search sites first
      allResults.sort((a, b) => {
        if (a.isPeopleSearchSite && !b.isPeopleSearchSite) return -1;
        if (!a.isPeopleSearchSite && b.isPeopleSearchSite) return 1;
        return 0;
      });

      setSearchResults(allResults);
      setStatusMessage(`Found ${allResults.length} results`);
    } catch (error) {
      console.error('Search error:', error);
      setStatusMessage('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
      setSearchProgress({ current: 0, total: 0, query: '' });
    }
  };

  const generateSearchQueries = (info: PersonalInfo): string[] => {
    const queries: string[] = [];

    // Name variations
    if (info.fullName) {
      const name = info.fullName.trim();
      queries.push(`"${name}"`);
      queries.push(`"${name}" address`);
      queries.push(`"${name}" phone`);
      queries.push(`"${name}" site:spokeo.com OR site:whitepages.com`);
      queries.push(`"${name}" site:beenverified.com OR site:truepeoplesearch.com`);
      queries.push(`"${name}" site:fastpeoplesearch.com OR site:radaris.com`);
      queries.push(`"${name}" "public records"`);

      if (info.city && info.state) {
        queries.push(`"${name}" "${info.city}, ${info.state}"`);
        queries.push(`"${name}" "${info.city}" "${info.state}"`);
      } else if (info.state) {
        queries.push(`"${name}" "${info.state}"`);
      }

      // Name format variations
      const parts = name.split(/\s+/);
      if (parts.length >= 2) {
        const firstName = parts[0];
        const lastName = parts[parts.length - 1];
        queries.push(`"${lastName}, ${firstName}"`);
      }
    }

    // Email searches
    for (const email of info.emails.filter(e => e.trim())) {
      queries.push(`"${email}"`);
      if (info.fullName) {
        queries.push(`"${email}" "${info.fullName}"`);
      }
    }

    // Phone searches with variations
    for (const phone of info.phones.filter(p => p.trim())) {
      const cleanPhone = phone.replace(/\D/g, '');
      queries.push(`"${phone}"`);
      if (cleanPhone.length === 10) {
        queries.push(`"${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}"`);
        queries.push(`"(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}"`);
      }
      if (info.fullName) {
        queries.push(`"${phone}" "${info.fullName}"`);
      }
    }

    // Address searches
    for (const address of info.addresses.filter(a => a.trim())) {
      queries.push(`"${address}"`);
      if (info.fullName) {
        queries.push(`"${address}" "${info.fullName}"`);
      }
    }

    return [...new Set(queries)]; // Remove duplicates
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedResults(prev => {
      const isSelected = prev.some(r => r.url === result.url);
      if (isSelected) {
        return prev.filter(r => r.url !== result.url);
      }
      return [...prev, result];
    });
  };

  const handleViewOptOut = async (result: SearchResult) => {
    if (window.electronAPI) {
      const instructions = await window.electronAPI.getOptOutInstructions(result.domain);
      if (instructions) {
        setCurrentOptOut({ result, instructions });
        setCurrentView('optout');
      }
    }
  };

  const handleAddToTracker = async (result: SearchResult) => {
    const newRemoval: TrackedRemoval = {
      id: Date.now().toString(),
      siteName: result.title || result.domain,
      domain: result.domain,
      url: result.url,
      status: 'pending',
      dateAdded: new Date().toISOString(),
    };

    const updatedRemovals = [...trackedRemovals, newRemoval];
    setTrackedRemovals(updatedRemovals);

    if (window.electronAPI) {
      await window.electronAPI.saveTrackedRemovals(updatedRemovals);
    }
    setStatusMessage(`Added ${result.domain} to tracker`);
  };

  const handleUpdateRemovalStatus = async (id: string, status: TrackedRemoval['status']) => {
    const updatedRemovals = trackedRemovals.map(r =>
      r.id === id
        ? { ...r, status, dateCompleted: status === 'completed' ? new Date().toISOString() : undefined }
        : r
    );
    setTrackedRemovals(updatedRemovals);

    if (window.electronAPI) {
      await window.electronAPI.saveTrackedRemovals(updatedRemovals);
    }
  };

  const handleDeleteRemoval = async (id: string) => {
    const updatedRemovals = trackedRemovals.filter(r => r.id !== id);
    setTrackedRemovals(updatedRemovals);

    if (window.electronAPI) {
      await window.electronAPI.saveTrackedRemovals(updatedRemovals);
    }
  };

  const handleClearAllData = async () => {
    if (window.electronAPI) {
      await window.electronAPI.clearAllData();
    }
    setPersonalInfo({
      fullName: '',
      emails: [],
      phones: [],
      addresses: [],
      city: '',
      state: '',
    });
    setSearchResults([]);
    setSelectedResults([]);
    setTrackedRemovals([]);
    setStatusMessage('All data cleared');
  };

  const handleOpenExternal = async (url: string) => {
    if (window.electronAPI) {
      await window.electronAPI.openExternal(url);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            personalInfo={personalInfo}
            onUpdateInfo={savePersonalInfo}
            onSearch={handleSearch}
          />
        );
      case 'search':
        return (
          <SearchView
            personalInfo={personalInfo}
            onUpdateInfo={savePersonalInfo}
            onSearch={handleSearch}
          />
        );
      case 'results':
        return (
          <ResultsView
            results={searchResults}
            selectedResults={selectedResults}
            isSearching={isSearching}
            searchProgress={searchProgress}
            onSelectResult={handleSelectResult}
            onViewOptOut={handleViewOptOut}
            onAddToTracker={handleAddToTracker}
            onOpenExternal={handleOpenExternal}
          />
        );
      case 'optout':
        return currentOptOut ? (
          <OptOutView
            result={currentOptOut.result}
            instructions={currentOptOut.instructions}
            onOpenExternal={handleOpenExternal}
            onAddToTracker={handleAddToTracker}
            onBack={() => setCurrentView('results')}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-dark-400">
            No opt-out information selected
          </div>
        );
      case 'tracker':
        return (
          <TrackerView
            removals={trackedRemovals}
            onUpdateStatus={handleUpdateRemovalStatus}
            onDelete={handleDeleteRemoval}
            onViewOptOut={async (removal) => {
              if (window.electronAPI) {
                const instructions = await window.electronAPI.getOptOutInstructions(removal.domain);
                if (instructions) {
                  setCurrentOptOut({
                    result: { title: removal.siteName, url: removal.url, domain: removal.domain, snippet: '', isPeopleSearchSite: true },
                    instructions
                  });
                  setCurrentView('optout');
                }
              }
            }}
            onOpenExternal={handleOpenExternal}
          />
        );
      case 'settings':
        return (
          <SettingsView
            personalInfo={personalInfo}
            onUpdateInfo={savePersonalInfo}
            onClearAllData={handleClearAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-950">
      <Header
        currentView={currentView}
        isSearching={isSearching}
        searchProgress={searchProgress}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          trackedCount={trackedRemovals.length}
          pendingCount={trackedRemovals.filter(r => r.status !== 'completed').length}
        />
        <main className="flex-1 overflow-auto bg-dark-950">
          {renderView()}
        </main>
      </div>
      <StatusBar message={statusMessage} />
    </div>
  );
}

export default App;

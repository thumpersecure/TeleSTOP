import React, { useState, useEffect, useCallback } from 'react';
import { PersonalInfo, TrackedRemoval, ViewType, OptOutInstructions, SearchResult } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/HomeView';
import AddSiteView from './components/AddSiteView';
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
  const [trackedRemovals, setTrackedRemovals] = useState<TrackedRemoval[]>([]);
  const [currentOptOut, setCurrentOptOut] = useState<{ result: SearchResult; instructions: OptOutInstructions } | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready - 100% Local');

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

  const handleAddToTracker = async (site: { url: string; domain: string; siteName: string }) => {
    // Check if already tracked
    if (trackedRemovals.some(r => r.url === site.url || r.domain === site.domain)) {
      setStatusMessage(`${site.domain} is already being tracked`);
      return;
    }

    const newRemoval: TrackedRemoval = {
      id: Date.now().toString(),
      siteName: site.siteName || site.domain,
      domain: site.domain,
      url: site.url,
      status: 'pending',
      dateAdded: new Date().toISOString(),
    };

    const updatedRemovals = [...trackedRemovals, newRemoval];
    setTrackedRemovals(updatedRemovals);

    if (window.electronAPI) {
      await window.electronAPI.saveTrackedRemovals(updatedRemovals);
    }
    setStatusMessage(`Added ${site.domain} to tracker`);
  };

  const handleViewOptOut = async (domain: string, url?: string) => {
    if (window.electronAPI) {
      const instructions = await window.electronAPI.getOptOutInstructions(domain);
      if (instructions) {
        setCurrentOptOut({
          result: {
            title: instructions.siteName,
            url: url || `https://${domain}`,
            domain: domain,
            snippet: '',
            isPeopleSearchSite: true
          },
          instructions
        });
        setCurrentView('optout');
      }
    }
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
            onOpenExternal={handleOpenExternal}
            setStatusMessage={setStatusMessage}
          />
        );
      case 'search':
        return (
          <AddSiteView
            onAddToTracker={handleAddToTracker}
            onViewOptOut={handleViewOptOut}
          />
        );
      case 'optout':
        return currentOptOut ? (
          <OptOutView
            result={currentOptOut.result}
            instructions={currentOptOut.instructions}
            onOpenExternal={handleOpenExternal}
            onAddToTracker={(result) => handleAddToTracker({
              url: result.url,
              domain: result.domain,
              siteName: result.title
            })}
            onBack={() => setCurrentView('tracker')}
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
              await handleViewOptOut(removal.domain, removal.url);
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
        return (
          <HomeView
            personalInfo={personalInfo}
            onUpdateInfo={savePersonalInfo}
            onOpenExternal={handleOpenExternal}
            setStatusMessage={setStatusMessage}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-950">
      <Header
        currentView={currentView}
        isSearching={false}
        searchProgress={{ current: 0, total: 0, query: '' }}
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

import { useState, useEffect, useCallback } from 'react';
import { PersonalInfo, TrackedRemoval, ViewType, OptOutInstructions, SearchResult } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeView from './components/HomeView';
import AddSiteView from './components/AddSiteView';
import OptOutView from './components/OptOutView';
import TrackerView from './components/TrackerView';
import SettingsView from './components/SettingsView';
import StatusBar from './components/StatusBar';

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  emails: [],
  phones: [],
  addresses: [],
  city: '',
  state: '',
};

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [trackedRemovals, setTrackedRemovals] = useState<TrackedRemoval[]>([]);
  const [currentOptOut, setCurrentOptOut] = useState<{ result: SearchResult; instructions: OptOutInstructions } | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready - 100% Local');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        if (window.electronAPI) {
          const [savedInfo, savedRemovals] = await Promise.all([
            window.electronAPI.getPersonalInfo(),
            window.electronAPI.getTrackedRemovals(),
          ]);
          if (savedInfo) {
            // Ensure loaded data has all required fields with defaults
            setPersonalInfo({
              ...defaultPersonalInfo,
              ...savedInfo,
              emails: savedInfo.emails || [],
              phones: savedInfo.phones || [],
              addresses: savedInfo.addresses || [],
            });
          }
          if (savedRemovals && Array.isArray(savedRemovals)) {
            setTrackedRemovals(savedRemovals);
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedData();
  }, []);

  const savePersonalInfo = useCallback(async (info: PersonalInfo) => {
    setPersonalInfo(info);
    try {
      if (window.electronAPI) {
        await window.electronAPI.savePersonalInfo(info);
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  }, []);

  const handleAddToTracker = async (site: { url: string; domain: string; siteName: string }) => {
    // Check if already tracked
    if (trackedRemovals.some(r => r.url === site.url || r.domain === site.domain)) {
      setStatusMessage(`${site.domain} is already being tracked`);
      return;
    }

    const newRemoval: TrackedRemoval = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      siteName: site.siteName || site.domain,
      domain: site.domain,
      url: site.url,
      status: 'pending',
      dateAdded: new Date().toISOString(),
    };

    const updatedRemovals = [...trackedRemovals, newRemoval];
    setTrackedRemovals(updatedRemovals);

    try {
      if (window.electronAPI) {
        await window.electronAPI.saveTrackedRemovals(updatedRemovals);
      }
    } catch (error) {
      console.error('Error saving tracked removals:', error);
    }
    setStatusMessage(`Added ${site.domain} to tracker`);
  };

  const handleViewOptOut = async (domain: string, url?: string) => {
    try {
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
    } catch (error) {
      console.error('Error getting opt-out instructions:', error);
      setStatusMessage('Error loading opt-out instructions');
    }
  };

  const handleUpdateRemovalStatus = async (id: string, status: TrackedRemoval['status']) => {
    const updatedRemovals = trackedRemovals.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, status };
      if (status === 'completed') {
        updated.dateCompleted = new Date().toISOString();
      }
      return updated;
    });
    setTrackedRemovals(updatedRemovals);

    try {
      if (window.electronAPI) {
        await window.electronAPI.saveTrackedRemovals(updatedRemovals);
      }
    } catch (error) {
      console.error('Error updating removal status:', error);
    }
  };

  const handleDeleteRemoval = async (id: string) => {
    const updatedRemovals = trackedRemovals.filter(r => r.id !== id);
    setTrackedRemovals(updatedRemovals);

    try {
      if (window.electronAPI) {
        await window.electronAPI.saveTrackedRemovals(updatedRemovals);
      }
    } catch (error) {
      console.error('Error deleting removal:', error);
    }
  };

  const handleClearAllData = async () => {
    if (window.electronAPI) {
      await window.electronAPI.clearAllData();
    }
    setPersonalInfo(defaultPersonalInfo);
    setTrackedRemovals([]);
    setCurrentOptOut(null);
    setStatusMessage('All data cleared');
  };

  const handleOpenExternal = useCallback(async (url: string) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.openExternal(url);
      }
    } catch (error) {
      console.error('Error opening external URL:', error);
    }
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-dark-400 text-sm">Loading your data...</p>
        </div>
      </div>
    );
  }

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

import { contextBridge, ipcRenderer } from 'electron';

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  isPeopleSearchSite: boolean;
}

export interface PersonalInfo {
  fullName?: string;
  emails?: string[];
  phones?: string[];
  addresses?: string[];
  usernames?: string[];
}

export interface OptOutInstructions {
  siteName: string;
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requiresEmail: boolean;
  requiresId: boolean;
  steps: string[];
  optOutUrl?: string;
  notes?: string;
}

export interface SiteInfo {
  name: string;
  domain: string;
  description: string;
  dataTypes: string[];
  hasOptOut: boolean;
}

export interface TrackedRemoval {
  id: string;
  siteName: string;
  domain: string;
  url: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dateAdded: string;
  dateCompleted?: string;
  notes?: string;
}

const electronAPI = {
  // Search
  searchGoogle: (query: string): Promise<SearchResult[]> =>
    ipcRenderer.invoke('search-google', query),

  // Opt-out instructions
  getOptOutInstructions: (domain: string): Promise<OptOutInstructions | null> =>
    ipcRenderer.invoke('get-opt-out-instructions', domain),

  getSiteInfo: (domain: string): Promise<SiteInfo | null> =>
    ipcRenderer.invoke('get-site-info', domain),

  getKnownSites: (): Promise<string[]> =>
    ipcRenderer.invoke('get-known-sites'),

  // External links
  openExternal: (url: string): Promise<void> =>
    ipcRenderer.invoke('open-external', url),

  // Local storage
  savePersonalInfo: (info: PersonalInfo): Promise<boolean> =>
    ipcRenderer.invoke('save-personal-info', info),

  getPersonalInfo: (): Promise<PersonalInfo | null> =>
    ipcRenderer.invoke('get-personal-info'),

  saveSearchHistory: (history: object[]): Promise<boolean> =>
    ipcRenderer.invoke('save-search-history', history),

  getSearchHistory: (): Promise<object[]> =>
    ipcRenderer.invoke('get-search-history'),

  saveTrackedRemovals: (removals: TrackedRemoval[]): Promise<boolean> =>
    ipcRenderer.invoke('save-tracked-removals', removals),

  getTrackedRemovals: (): Promise<TrackedRemoval[]> =>
    ipcRenderer.invoke('get-tracked-removals'),

  clearAllData: (): Promise<boolean> =>
    ipcRenderer.invoke('clear-all-data'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;

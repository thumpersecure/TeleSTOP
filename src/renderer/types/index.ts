export interface PersonalInfo {
  fullName: string;
  emails: string[];
  phones: string[];
  addresses: string[];
  city: string;
  state: string;
}

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  isPeopleSearchSite: boolean;
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

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

export type ViewType = 'home' | 'search' | 'results' | 'optout' | 'tracker' | 'settings';

declare global {
  interface Window {
    electronAPI: {
      searchGoogle: (query: string) => Promise<SearchResult[]>;
      getOptOutInstructions: (domain: string) => Promise<OptOutInstructions | null>;
      getSiteInfo: (domain: string) => Promise<{ name: string; domain: string; description: string; dataTypes: string[]; hasOptOut: boolean } | null>;
      getKnownSites: () => Promise<string[]>;
      openExternal: (url: string) => Promise<void>;
      savePersonalInfo: (info: PersonalInfo) => Promise<boolean>;
      getPersonalInfo: () => Promise<PersonalInfo | null>;
      saveSearchHistory: (history: SearchHistoryItem[]) => Promise<boolean>;
      getSearchHistory: () => Promise<SearchHistoryItem[]>;
      saveTrackedRemovals: (removals: TrackedRemoval[]) => Promise<boolean>;
      getTrackedRemovals: () => Promise<TrackedRemoval[]>;
      clearAllData: () => Promise<boolean>;
    };
  }
}

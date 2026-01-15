import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import { searchGoogle, SearchResult } from './search';
import { getOptOutInstructions, getSiteInfo, knownSites } from './knowledge-base';
import Store from 'electron-store';

const store = new Store({
  name: 'telestop-data',
  encryptionKey: 'telestop-local-encryption-key',
});

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
    titleBarStyle: 'default',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

// Search for personal information on Google
ipcMain.handle('search-google', async (_event, query: string): Promise<SearchResult[]> => {
  try {
    const results = await searchGoogle(query);
    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
});

// Get opt-out instructions for a specific site
ipcMain.handle('get-opt-out-instructions', async (_event, domain: string) => {
  try {
    const instructions = getOptOutInstructions(domain);
    return instructions;
  } catch (error) {
    console.error('Error getting opt-out instructions:', error);
    throw error;
  }
});

// Get site info
ipcMain.handle('get-site-info', async (_event, domain: string) => {
  try {
    const siteInfo = getSiteInfo(domain);
    return siteInfo;
  } catch (error) {
    console.error('Error getting site info:', error);
    throw error;
  }
});

// Get list of known people-search sites
ipcMain.handle('get-known-sites', async () => {
  return knownSites;
});

// Open external URL
ipcMain.handle('open-external', async (_event, url: string) => {
  await shell.openExternal(url);
});

// Store personal info locally (encrypted)
ipcMain.handle('save-personal-info', async (_event, info: object) => {
  store.set('personalInfo', info);
  return true;
});

// Get stored personal info
ipcMain.handle('get-personal-info', async () => {
  return store.get('personalInfo', null);
});

// Save search history
ipcMain.handle('save-search-history', async (_event, history: object[]) => {
  store.set('searchHistory', history);
  return true;
});

// Get search history
ipcMain.handle('get-search-history', async () => {
  return store.get('searchHistory', []);
});

// Save tracked removals
ipcMain.handle('save-tracked-removals', async (_event, removals: object[]) => {
  store.set('trackedRemovals', removals);
  return true;
});

// Get tracked removals
ipcMain.handle('get-tracked-removals', async () => {
  return store.get('trackedRemovals', []);
});

// Clear all stored data
ipcMain.handle('clear-all-data', async () => {
  store.clear();
  return true;
});

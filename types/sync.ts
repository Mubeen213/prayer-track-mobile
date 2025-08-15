export interface SyncMetadata {
  lastMosquesSync: string;
  lastEventsSync: string;
  lastFavSync: string;
  lastUserSync: string;
  appVersion: string;
}

export interface SyncStatusResponse {
  mosquesChanged: boolean;
  eventsChanged: boolean;
  favoritesChanged: boolean;
  usersChanged: boolean;
  timestamp: string;
}

export interface SyncResult {
  mosquesUpdated: boolean;
  eventsUpdated: boolean;
  favoritesUpdated: boolean;
  usersUpdated: boolean;
  timestamp: string;
}

export interface EntitySyncOptions {
  forceRefresh?: boolean;
  retryCount?: number;
}

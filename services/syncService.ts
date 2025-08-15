import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/axios";
import {
  SyncMetadata,
  SyncStatusResponse,
  SyncResult,
  EntitySyncOptions,
} from "../types/sync";
import { MosqueService } from "./mosqueService";
import { EventService } from "./eventService";
import { FavoriteService } from "./favoriteService";
import { UserService } from "./userService";

const METADATA_KEY = "sync_metadata_v2";

export class SyncService {
  private static async getMetadata(): Promise<SyncMetadata> {
    try {
      const metadata = await AsyncStorage.getItem(METADATA_KEY);
      if (metadata) {
        return JSON.parse(metadata);
      }
    } catch (error) {
      console.error("Error reading sync metadata:", error);
    }

    // Default metadata
    return {
      lastMosquesSync: "1970-01-01T00:00:00.000Z",
      lastEventsSync: "1970-01-01T00:00:00.000Z",
      lastFavSync: "1970-01-01T00:00:00.000Z",
      lastUserSync: "1970-01-01T00:00:00.000Z",
      appVersion: "1.0.0",
    };
  }

  private static async saveMetadata(
    updates: Partial<SyncMetadata>
  ): Promise<void> {
    try {
      const existing = await this.getMetadata();
      const updated = { ...existing, ...updates };
      await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving sync metadata:", error);
    }
  }

  static async checkSyncStatus(): Promise<SyncStatusResponse | null> {
    try {
      const metadata = await this.getMetadata();

      const params = new URLSearchParams({
        lastMosquesSync: metadata.lastMosquesSync,
        lastEventsSync: metadata.lastEventsSync,
        lastFavSync: metadata.lastFavSync,
        lastUserSync: metadata.lastUserSync,
      });

      const response = await api.get(`/sync/status?${params}`);
      console.log("Sync status response:", response.data);
      return response.data as SyncStatusResponse;
    } catch (error) {
      console.error("Error checking sync status:", error);
      return null;
    }
  }

  static async syncMosques(options: EntitySyncOptions = {}): Promise<boolean> {
    const { forceRefresh = false, retryCount = 3 } = options;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const success = await MosqueService.syncMosques(forceRefresh);
        if (success) {
          await this.saveMetadata({
            lastMosquesSync: new Date().toISOString(),
          });
          return true;
        }
      } catch (error) {
        console.error(`Mosque sync attempt ${attempt} failed:`, error);
        if (attempt === retryCount) throw error;

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  }

  static async syncEvents(options: EntitySyncOptions = {}): Promise<boolean> {
    const { forceRefresh = false, retryCount = 3 } = options;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const success = await EventService.syncEvents(forceRefresh);
        if (success) {
          await this.saveMetadata({
            lastEventsSync: new Date().toISOString(),
          });
          return true;
        }
      } catch (error) {
        console.error(`Events sync attempt ${attempt} failed:`, error);
        if (attempt === retryCount) throw error;

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  }

  static async syncFavorites(
    userId: string,
    options: EntitySyncOptions = {}
  ): Promise<boolean> {
    const { forceRefresh = false, retryCount = 3 } = options;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const success = await FavoriteService.syncFavorites(
          userId,
          forceRefresh
        );
        if (success) {
          await this.saveMetadata({
            lastFavSync: new Date().toISOString(),
          });
          return true;
        }
      } catch (error) {
        console.error(`Favorites sync attempt ${attempt} failed:`, error);
        if (attempt === retryCount) throw error;

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  }

  static async syncUser(
    userId: string,
    options: EntitySyncOptions = {}
  ): Promise<boolean> {
    const { forceRefresh = false, retryCount = 3 } = options;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const success = await UserService.syncUserData(userId, forceRefresh);
        if (success) {
          await this.saveMetadata({
            lastUserSync: new Date().toISOString(),
          });
          return true;
        }
      } catch (error) {
        console.error(`User sync attempt ${attempt} failed:`, error);
        if (attempt === retryCount) throw error;

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  }

  static async performFullSync(
    userId?: string,
    forceRefresh = false
  ): Promise<SyncResult> {
    const result: SyncResult = {
      mosquesUpdated: false,
      eventsUpdated: false,
      favoritesUpdated: false,
      usersUpdated: false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Check what needs syncing if not forcing
      let syncStatus: SyncStatusResponse | null = null;
      if (!forceRefresh) {
        syncStatus = await this.checkSyncStatus();
      }

      const syncOptions: EntitySyncOptions = { forceRefresh, retryCount: 2 };

      // Sync entities based on what changed
      const shouldSyncMosques = forceRefresh || syncStatus?.mosquesChanged;
      if (shouldSyncMosques) {
        console.log("Syncing mosques...");
        result.mosquesUpdated = await this.syncMosques(syncOptions);
      }

      const shouldSyncEvents = forceRefresh || syncStatus?.eventsChanged;
      if (shouldSyncEvents) {
        console.log("Syncing events...");
        result.eventsUpdated = await this.syncEvents(syncOptions);
      }

      if (userId) {
        const shouldSyncFavorites =
          forceRefresh || syncStatus?.favoritesChanged;
        if (shouldSyncFavorites) {
          console.log("Syncing favorites...");
          result.favoritesUpdated = await this.syncFavorites(
            userId,
            syncOptions
          );
        }

        const shouldSyncUser = forceRefresh || syncStatus?.usersChanged;
        if (shouldSyncUser) {
          console.log("Syncing user data...");
          result.usersUpdated = await this.syncUser(userId, syncOptions);
        }
      }

      console.log("Full sync completed:", result);
      return result;
    } catch (error) {
      console.error("Full sync failed:", error);
      throw error;
    }
  }

  static async clearAllCache(userId?: string): Promise<void> {
    try {
      await Promise.all([
        MosqueService.clearCache(),
        EventService.clearCache(),
        UserService.clearCache(),
        userId ? FavoriteService.clearCache(userId) : Promise.resolve(),
        AsyncStorage.removeItem(METADATA_KEY),
      ]);

      console.log("All sync cache cleared");
    } catch (error) {
      console.error("Error clearing sync cache:", error);
    }
  }
}

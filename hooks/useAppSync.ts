import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SyncService } from "../services/syncService";
import { SyncResult } from "../types/sync";

export interface AppSyncState {
  isInitialSyncing: boolean;
  isSyncing: boolean;
  hasInitialSync: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
}

export const useAppSync = (userId?: string | null) => {
  const [syncState, setSyncState] = useState<AppSyncState>({
    isInitialSyncing: true,
    isSyncing: false,
    hasInitialSync: false,
    lastSyncTime: null,
    syncError: null,
  });

  const queryClient = useQueryClient();

  const updateSyncState = useCallback((updates: Partial<AppSyncState>) => {
    setSyncState((prev) => ({ ...prev, ...updates }));
  }, []);

  const invalidateQueries = useCallback(
    (result: SyncResult) => {
      if (result.mosquesUpdated) {
        queryClient.invalidateQueries({ queryKey: ["mosques"] });
        queryClient.invalidateQueries({ queryKey: ["mosque"] });
        queryClient.invalidateQueries({ queryKey: ["nearby-mosques"] });
      }

      if (result.eventsUpdated) {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["mosque-events"] });
      }

      if (result.favoritesUpdated) {
        queryClient.invalidateQueries({ queryKey: ["favorites-status"] });
        queryClient.invalidateQueries({ queryKey: ["favorites-mosques"] });
      }

      if (result.usersUpdated) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    [queryClient]
  );

  useEffect(() => {
    const performInitialSync = async () => {
      if (!userId || syncState.hasInitialSync) return;

      try {
        updateSyncState({
          isInitialSyncing: true,
          syncError: null,
        });

        console.log("Starting initial app sync...");
        const result = await SyncService.performFullSync(userId);

        console.log("Initial sync completed:", result);
        invalidateQueries(result);

        updateSyncState({
          lastSyncTime: result.timestamp,
          hasInitialSync: true,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sync failed";
        console.error("Initial sync failed:", error);

        updateSyncState({
          syncError: errorMessage,
          hasInitialSync: true,
        });
      } finally {
        updateSyncState({
          isInitialSyncing: false,
        });
      }
    };

    performInitialSync();
  }, [syncState.hasInitialSync, userId, updateSyncState, invalidateQueries]);

  const manualSync = useCallback(async (): Promise<SyncResult> => {
    updateSyncState({
      isSyncing: true,
      syncError: null,
    });

    try {
      console.log("Starting manual sync...");
      const result = await SyncService.performFullSync(
        userId || undefined,
        true
      );

      console.log("Manual sync completed:", result);
      invalidateQueries(result);

      updateSyncState({
        lastSyncTime: result.timestamp,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Manual sync failed";
      console.error("Manual sync failed:", error);

      updateSyncState({
        syncError: errorMessage,
      });

      throw error;
    } finally {
      updateSyncState({
        isSyncing: false,
      });
    }
  }, [userId, updateSyncState, invalidateQueries]);

  const clearSyncError = useCallback(() => {
    updateSyncState({ syncError: null });
  }, [updateSyncState]);

  const clearCache = useCallback(async () => {
    try {
      await SyncService.clearAllCache(userId || undefined);
      updateSyncState({
        hasInitialSync: false,
        lastSyncTime: null,
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, [userId, updateSyncState]);

  return {
    ...syncState,
    manualSync,
    clearSyncError,
    clearCache,
    isAnySyncing: syncState.isInitialSyncing || syncState.isSyncing,
  };
};

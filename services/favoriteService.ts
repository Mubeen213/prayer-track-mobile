import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/axios";
import { FavoriteMosque } from "../types/favMosque";

const CACHE_KEYS = {
  favorites: (userId: string) => `favorites_${userId}_v1`,
  favoriteStatus: (userId: string) => `favorite_status_${userId}_v1`,
};

export class FavoriteService {
  static async getFavorites(userId: string): Promise<FavoriteMosque[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.favorites(userId));
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("Error reading favorites from cache:", error);
      return [];
    }
  }

  static async getFavoriteStatus(
    userId: string
  ): Promise<Record<string, boolean>> {
    try {
      const cached = await AsyncStorage.getItem(
        CACHE_KEYS.favoriteStatus(userId)
      );
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error("Error reading favorite status from cache:", error);
      return {};
    }
  }

  static async saveFavorites(
    userId: string,
    favorites: FavoriteMosque[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CACHE_KEYS.favorites(userId),
        JSON.stringify(favorites)
      );
      const status = favorites.reduce(
        (acc, fav) => {
          acc[fav.mosque_id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );

      await AsyncStorage.setItem(
        CACHE_KEYS.favoriteStatus(userId),
        JSON.stringify(status)
      );
    } catch (error) {
      console.error("Error saving favorites to cache:", error);
    }
  }

  static async syncFavorites(
    userId: string,
    forceRefresh = false
  ): Promise<boolean> {
    try {
      console.log("Syncing favorites from server...");
      const response = await api.get("/favorites");
      const favorites = response.data || [];

      await this.saveFavorites(userId, favorites);
      console.log(`Successfully synced ${favorites.length} favorites`);
      return true;
    } catch (error) {
      console.error("Failed to sync favorites:", error);
      return false;
    }
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.favorites(userId));
      await AsyncStorage.removeItem(CACHE_KEYS.favoriteStatus(userId));
    } catch (error) {
      console.error("Error clearing favorites cache:", error);
    }
  }
}

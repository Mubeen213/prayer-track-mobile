import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mosque } from "../types/mosque";
import { calculateDistance } from "../utils/location";
import { api } from "../config/axios";

const CACHE_KEYS = {
  mosques: "mosques_all_v1",
};

export class MosqueService {
  static async getAllMosques(): Promise<Mosque[]> {
    try {
      console.log("Fetching mosques from cache...");
      let cached = await AsyncStorage.getItem(CACHE_KEYS.mosques);
      if (!cached) {
        await this.syncMosques(true);
      }
      cached = await AsyncStorage.getItem(CACHE_KEYS.mosques);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("Error reading mosques from cache:", error);
      return [];
    }
  }

  static async saveAllMosques(mosques: Mosque[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.mosques, JSON.stringify(mosques));
    } catch (error) {
      console.error("Error saving mosques to cache:", error);
    }
  }

  static async searchMosques(query: string): Promise<Mosque[]> {
    const allMosques = await this.getAllMosques();
    console.log(`Mosques size: ${allMosques.length}`);

    if (!query.trim()) return allMosques;

    return allMosques.filter((mosque) => {
      const isMatch =
        mosque.name?.toLowerCase().includes(query.toLowerCase()) ||
        mosque.address?.toLowerCase().includes(query.toLowerCase()) ||
        mosque.city?.toLowerCase().includes(query.toLowerCase());

      return isMatch;
    });
  }

  static async getNearbyMosques(
    userLat: number,
    userLng: number,
    radiusKm: number = 5
  ): Promise<Mosque[]> {
    const allMosques = await this.getAllMosques();
    console.log(
      `Finding mosques within ${radiusKm} km of (${userLat}, ${userLng})`
    );

    return allMosques
      .map((mosque) => ({
        ...mosque,
        distance: calculateDistance(
          userLat,
          userLng,
          mosque.latitude,
          mosque.longitude
        ),
      }))
      .filter((mosque) => mosque.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  static async getMosque(mosqueId: string): Promise<Mosque | null> {
    const allMosques = await this.getAllMosques();
    console.log(`Fetching mosque with ID: ${mosqueId}`);
    return allMosques.find((mosque) => mosque.id === mosqueId) || null;
  }

  static async syncMosques(forceRefresh = false): Promise<boolean> {
    try {
      console.log("Syncing mosques from server...");
      const response = await api.get("/mosques?limit=500");
      const data = response.data;

      if (data.mosques && Array.isArray(data.mosques)) {
        await this.saveAllMosques(data.mosques);
        console.log(`Successfully synced ${data.mosques.length} mosques`);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to sync mosques:", error);
      return false;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.mosques);
    } catch (error) {
      console.error("Error clearing mosques cache:", error);
    }
  }
}

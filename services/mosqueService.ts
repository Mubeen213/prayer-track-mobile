import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mosque, MosquesResponse } from '../types/mosque';
import { ApiService } from './apiService';

const MOSQUE_STORAGE_KEY = 'mosques_data';
const LAST_SYNC_KEY = 'mosques_last_sync';
const CACHE_DURATION = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

export class MosqueService {
  static async getMosquesFromCache(): Promise<Mosque[]> {
    try {
      const cached = await AsyncStorage.getItem(MOSQUE_STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error reading mosques from cache:', error);
      return [];
    }
  }

  static async saveMosquesToCache(mosques: Mosque[]): Promise<void> {
    try {
      if (!Array.isArray(mosques)) {
        return;
      }

      await AsyncStorage.setItem(MOSQUE_STORAGE_KEY, JSON.stringify(mosques));
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving mosques to cache:', error);
    }
  }

  static async isCacheExpired(): Promise<boolean> {
    try {
      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      if (!lastSync) return true;
      
      const timeDiff = Date.now() - parseInt(lastSync);
      return timeDiff > CACHE_DURATION;
    } catch {
      return true;
    }
  }

  static async fetchMosquesFromServer(): Promise<Mosque[]> {
    const response = await ApiService.get<MosquesResponse>('/api/mosques');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch mosques');
    }

    if (!response.data || !Array.isArray(response.data.mosques)) {
      console.warn('Invalid mosque data structure from server');
      return [];
    }

    return response.data.mosques;
  }

  static async getMosques(forceRefresh = false): Promise<Mosque[]> {
    const cached = await this.getMosquesFromCache();
    const cacheExpired = await this.isCacheExpired();

    if (Array.isArray(cached) && cached.length > 0 && !cacheExpired && !forceRefresh) {
      return cached;
    }

    try {
      const mosques = await this.fetchMosquesFromServer();
      
      if (Array.isArray(mosques) && mosques.length > 0) {
        await this.saveMosquesToCache(mosques);
        return mosques;
      } else {
        return Array.isArray(cached) ? cached : [];
      }
    } catch (error) {
      console.warn('Failed to fetch from server:', error);
      return Array.isArray(cached) ? cached : [];
    }
  }

  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOSQUE_STORAGE_KEY);
      await AsyncStorage.removeItem(LAST_SYNC_KEY);
    } catch (error) {
      console.warn('Error clearing mosque cache:', error);
    }
  }
}
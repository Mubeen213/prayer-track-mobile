import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/axios";

export interface Event {
  id: string;
  title: string;
  description: string;
  scholar?: string;
  event_date: string;
  event_time: string;
  mosque_id: string;
  created_at: string;
  updated_at: string;
}

const CACHE_KEYS = {
  events: "events_all_v1",
  mosqueEvents: (mosqueId: string) => `mosque_events_${mosqueId}_v1`,
};

export class EventService {
  static async getAllEvents(): Promise<Event[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.events);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("Error reading events from cache:", error);
      return [];
    }
  }

  static async getMosqueEvents(mosqueId: string): Promise<Event[]> {
    try {
      const cached = await AsyncStorage.getItem(
        CACHE_KEYS.mosqueEvents(mosqueId)
      );
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("Error reading mosque events from cache:", error);
      return [];
    }
  }

  static async saveAllEvents(events: Event[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.events, JSON.stringify(events));

      // Group events by mosque and cache separately
      const eventsByMosque = events.reduce(
        (acc, event) => {
          if (!acc[event.mosque_id]) {
            acc[event.mosque_id] = [];
          }
          acc[event.mosque_id].push(event);
          return acc;
        },
        {} as Record<string, Event[]>
      );

      // Cache events for each mosque
      const savePromises = Object.entries(eventsByMosque).map(
        ([mosqueId, mosqueEvents]) =>
          AsyncStorage.setItem(
            CACHE_KEYS.mosqueEvents(mosqueId),
            JSON.stringify(mosqueEvents)
          )
      );

      await Promise.all(savePromises);
    } catch (error) {
      console.error("Error saving events to cache:", error);
    }
  }

  static async syncEvents(forceRefresh = false): Promise<boolean> {
    try {
      console.log("Syncing events from server...");
      const response = await api.get("/events");
      const events = response.data || [];

      await this.saveAllEvents(events);
      console.log(`Successfully synced ${events.length} events`);
      return true;
    } catch (error) {
      console.error("Failed to sync events:", error);
      return false;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.events);
      // Note: Mosque-specific caches will be cleared on next sync
    } catch (error) {
      console.error("Error clearing events cache:", error);
    }
  }
}

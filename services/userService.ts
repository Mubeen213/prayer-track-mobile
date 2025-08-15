import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import { api } from "../config/axios";
import { User } from "../types/user";

const STORAGE_KEYS = {
  userId: "userId",
  userData: "userData_v1",
};

export const getOrCreateUserId = async (): Promise<{
  userId: string;
  isNew: boolean;
}> => {
  try {
    let userId = await SecureStore.getItemAsync(STORAGE_KEYS.userId);

    if (!userId) {
      userId = uuidv4();
      await SecureStore.setItemAsync(STORAGE_KEYS.userId, userId);
      return { userId, isNew: true };
    }

    return { userId, isNew: false };
  } catch (error) {
    console.error("Error managing user ID:", error);
    const fallbackId = uuidv4();
    return { userId: fallbackId, isNew: true };
  }
};

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const response = await api.get(`/auth/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const storeUserData = async (userData: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const getStoredUserData = async (): Promise<User | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.userData);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error reading stored user data:", error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.userData);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.userId);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

export class UserService {
  static async syncUserData(
    userId: string,
    forceRefresh = false
  ): Promise<boolean> {
    try {
      console.log("Syncing user data from server...");
      const userData = await fetchUserData(userId);

      if (userData) {
        await storeUserData(userData);
        console.log("Successfully synced user data");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to sync user data:", error);
      return false;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.userData);
    } catch (error) {
      console.error("Error clearing user cache:", error);
    }
  }
}

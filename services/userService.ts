import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { User } from "../types/user";
import { AuthService } from "./authService";

const STORAGE_KEYS = {
  userId: "userId",
  userData: "userData_v1",
};

export const storeUserId = async (userId: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.userId, userId);
  } catch (error) {
    console.error("Error storing user ID:", error);
    throw error;
  }
};

export const getStoredUserId = async (): Promise<string | null> => {
  try {
    const user_id = await SecureStore.getItemAsync(STORAGE_KEYS.userId);
    console.log(`Stored user ID: ${user_id}`);
    return user_id;
  } catch (error) {
    console.error("Error getting stored user ID:", error);
    return null;
  }
};

export const storeUserData = async (userData: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
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
      const userData = await AuthService.fetchUserData();

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

import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { api } from "../config/axios";
import { User } from "../types/user";
import NotificationService from "./notificationService";

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (userId) {
      console.log("Current user ID:", userId);
      return userId;
    } else {
      console.warn("No user ID found in SecureStore.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};

export async function getOrCreateUserId(): Promise<{
  userId: string;
  isNew: boolean;
}> {
  let userId = await SecureStore.getItemAsync("userId");
  console.log("Checking for existing user ID in SecureStore...", userId);
  if (!userId) {
    userId = uuidv4();
    await SecureStore.setItemAsync("userId", userId);
    console.log("No user ID found, created new user ID:", userId);
    await NotificationService.initialize();

    return { userId, isNew: true };
  }
  return { userId, isNew: false };
}

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    api.defaults.headers.common["x-user-id"] = userId;

    const response = await api.get("/auth/me");
    await NotificationService.registerTokenWithServer(userId);

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const storeUserData = async (user: User): Promise<void> => {
  try {
    await SecureStore.setItemAsync("userData", JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const getStoredUserData = async (): Promise<User | null> => {
  try {
    const userData = await SecureStore.getItemAsync("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error retrieving stored user data:", error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    if (userId) {
      await NotificationService.unregisterToken(userId);
    }

    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("userId");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

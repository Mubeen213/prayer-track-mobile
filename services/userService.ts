import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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
    return { userId, isNew: true };
  }
  return { userId, isNew: false };
}

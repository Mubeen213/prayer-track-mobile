import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { api } from "../config/axios";
import { Platform } from "react-native";

import { REGISTER_USER } from "../utils/urls";
import "../styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

async function getOrCreateUserId(): Promise<{
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

export default function RootLayout() {
  const [isReady, setIsReady] = React.useState(false);

  async function init() {
    try {
      if (__DEV__) {
        await SecureStore.deleteItemAsync("userId");
      }
      const { userId, isNew } = await getOrCreateUserId();
      if (isNew) {
        await api.post(REGISTER_USER, {
          user_id: userId,
          platform: Platform.OS,
        });
      }
      api.defaults.headers.common["x-user-id"] = userId;
    } catch (error) {
      console.error("Error initializing user:", error);
    }
    setIsReady(true);
  }

  React.useEffect(() => {
    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView
          className="flex-1 bg-gray-50 pt-10"
          edges={["left", "right"]}
        >
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

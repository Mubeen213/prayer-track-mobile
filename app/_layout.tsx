import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Slot } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as Device from "expo-device";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import NotificationService from "../services/notificationService";
import "../styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    const initializeNotifications = async () => {
      // Only initialize on physical devices and non-Expo Go builds
      if (Device.isDevice) {
        try {
          await NotificationService.initialize();
          const cleanup = NotificationService.setupNotificationListeners();
          return cleanup;
        } catch (error) {
          console.error("Failed to initialize notifications:", error);
          return () => {};
        }
      } else {
        console.log(
          "Skipping notification initialization - running in simulator or Expo Go"
        );
        return () => {};
      }
    };

    let cleanup: (() => void) | undefined;

    initializeNotifications().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView
            className="flex-1 pt-16 bg-gray-50"
            edges={["left", "right"]}
          >
            <Slot />
          </SafeAreaView>
        </AuthProvider>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

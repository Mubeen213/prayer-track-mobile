import React from "react";
import Toast from "react-native-toast-message";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../auth-context/authContext";
import "../styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView
            className="flex-1 bg-gray-50 pt-10"
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

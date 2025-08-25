import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { api } from "../config/axios";
import {
  storeUserId,
  getStoredUserId,
  storeUserData,
  getStoredUserData,
  clearUserData,
} from "../services/userService";
import { AuthService } from "../services/authService";
import NotificationService from "../services/notificationService";
import { User } from "../types/user";
import { AuthContextType } from "../types/auth";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      setIsLoading(true);

      // if (__DEV__) {
      //   console.log("Running in development mode, clearing user ID.");
      //   await AsyncStorage.clear();
      //   await SecureStore.deleteItemAsync("userId");
      // }

      // Check if we have a stored user ID
      const storedUserId = await getStoredUserId();

      if (storedUserId) {
        // User exists, load cached data only
        await handleExistingUser(storedUserId);
      } else {
        // New user, register with server
        await handleNewUser();
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUser = async (storedUserId: string) => {
    try {
      setUserId(storedUserId);
      api.defaults.headers.common["x-user-id"] = storedUserId;
      const cachedUserData = await getStoredUserData();
      if (cachedUserData) {
        setUser(cachedUserData);
      }

      // Silently check and register notification token if permissions granted
      await NotificationService.silentTokenRegistration(storedUserId);
    } catch (error) {
      console.error("Error handling existing user:", error);
      // If there's an error, treat as new user
      await clearUserData();
      await handleNewUser();
    }
  };

  const handleNewUser = async () => {
    try {
      // Register new user with server
      const newUser = await AuthService.registerUser(Platform.OS);
      await storeUserId(newUser.id);
      await storeUserData(newUser);

      setUserId(newUser.id);
      setUser(newUser);
      api.defaults.headers.common["x-user-id"] = newUser.id;
      await NotificationService.registerTokenWithServer(newUser.id);

      console.log("New user registered successfully:", newUser.id);
    } catch (error) {
      console.error("Failed to register new user:", error);
      // Don't store anything if registration fails
    }
  };

  const refreshUser = async () => {
    if (!userId) return;

    try {
      const freshUserData = await AuthService.fetchUserData();
      if (freshUserData) {
        setUser(freshUserData);
        await storeUserData(freshUserData);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const logout = async () => {
    try {
      if (userId) {
        await NotificationService.unregisterToken(userId);
      }
      await clearUserData();
      setUser(null);
      setUserId(null);
      delete api.defaults.headers.common["x-user-id"];
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const retryNotificationSetup = async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const success = await NotificationService.silentTokenRegistration(userId);
      if (success) {
        console.log("Notification setup successful after retry");
      }
      return success;
    } catch (error) {
      console.error("Error retrying notification setup:", error);
      return false;
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role) || user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some((role) => hasRole(role));
  };

  const contextValue: AuthContextType = {
    user,
    userId,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    refreshUser,
    logout,
    retryNotificationSetup,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

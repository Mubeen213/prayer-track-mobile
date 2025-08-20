import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { api } from "../config/axios";
import { REGISTER_USER } from "../utils/urls";
import {
  getOrCreateUserId,
  fetchUserData,
  storeUserData,
  getStoredUserData,
  clearUserData,
} from "../services/userService";
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
      // if (__DEV__) {
      //   console.log("Running in development mode, clearing user ID.");
      //   await AsyncStorage.clear();
      //   await SecureStore.deleteItemAsync("userId");
      // }
      setIsLoading(true);

      const { userId: currentUserId, isNew } = await getOrCreateUserId();
      setUserId(currentUserId);

      // Set user ID in API headers for all requests
      api.defaults.headers.common["x-user-id"] = currentUserId;

      // Register new user with server with notification token
      if (isNew) {
        await api.post(REGISTER_USER, {
          user_id: currentUserId,
          platform: Platform.OS,
        });
        await NotificationService.registerTokenWithServer(currentUserId);
      }

      const cachedUserData = await getStoredUserData();
      if (cachedUserData) {
        setUser(cachedUserData);
      } else {
        const freshUserData = await fetchUserData(currentUserId);
        if (freshUserData) {
          setUser(freshUserData);
          await storeUserData(freshUserData);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!userId) return;

    try {
      const freshUserData = await fetchUserData(userId);
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
      await clearUserData();
      setUser(null);
      setUserId(null);
      delete api.defaults.headers.common["x-user-id"];
    } catch (error) {
      console.error("Logout error:", error);
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
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

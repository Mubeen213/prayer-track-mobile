import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { api } from "../config/axios";
import { REGISTER_USER } from "../utils/urls";
import { getOrCreateUserId } from "../services/userService";

export type AuthContextType = {
  userId: string;
  isNew: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthContextType | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // if (__DEV__) {
        //   await SecureStore.deleteItemAsync("userId");
        // }

        const { userId, isNew } = await getOrCreateUserId();

        if (isNew) {
          await api.post(REGISTER_USER, {
            user_id: userId,
            platform: Platform.OS,
          });
        }

        api.defaults.headers.common["x-user-id"] = userId;
        setAuth({ userId, isNew });
      } catch (err) {
        console.error("Auth Init Error:", err);
      }
    };

    initAuth();
  }, []);

  if (!auth) return null;

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

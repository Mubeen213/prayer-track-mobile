import React from "react";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const shouldUseBottomInset =
    Platform.OS === "ios" || (Platform.OS === "android" && insets.bottom > 0);

  const bottomPadding = shouldUseBottomInset ? insets.bottom : 0;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10b981", // text-green-500
        tabBarInactiveTintColor: "#6b7280", // text-gray-600
        tabBarStyle: {
          backgroundColor: "#ffffff", // bg-white
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb", // border-gray-200
          paddingVertical: 12,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "PrayerTrack",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? "#10b981" : "#6b7280"}
            />
          ),
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              pressColor="transparent" //For android
              pressOpacity={0.3} //For ios
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mosque"
        options={{
          title: "Mosques",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "location" : "location-outline"}
              size={24}
              color={focused ? "#10b981" : "#6b7280"}
            />
          ),
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              pressColor="transparent" //For android
              pressOpacity={0.3} //For ios
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: "Quran",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={24}
              color={focused ? "#10b981" : "#6b7280"}
            />
          ),
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              pressColor="transparent" //For android
              pressOpacity={0.3} //For ios
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={24}
              color={focused ? "#10b981" : "#6b7280"}
            />
          ),
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              pressColor="transparent" //For android
              pressOpacity={0.3} //For ios
            />
          ),
        }}
      />
    </Tabs>
  );
}

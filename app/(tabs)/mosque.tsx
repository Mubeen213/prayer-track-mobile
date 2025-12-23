import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MapPin } from "lucide-react-native";
import { MosqueList } from "../../components/mosque/MosqueList";
import { useLocation } from "../../hooks/useLocation";

export default function MosqueTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const {
    location,
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation();

  // Effect to handle when location is obtained in nearby mode
  useEffect(() => {
    if (isNearbyMode && location && !locationLoading) {
      setIsRequestingLocation(false);
    }
  }, [isNearbyMode, location, locationLoading]);

  // Effect to handle location errors
  useEffect(() => {
    if (locationError && isRequestingLocation) {
      setIsRequestingLocation(false);
      setIsNearbyMode(false);
    }
  }, [locationError, isRequestingLocation]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsNearbyMode(false);
      setIsRequestingLocation(false);
    }
  }, []);

  const handleNearbyPress = useCallback(async () => {
    if (isNearbyMode) {
      // Exit nearby mode
      setIsNearbyMode(false);
      setIsRequestingLocation(false);
      setSearchQuery("");
      return;
    }

    // Enter nearby mode
    setSearchQuery("");
    setIsRequestingLocation(true);

    if (!location && !locationLoading) {
      const result = await requestLocation();
      if (result) {
        // Successfully got location
        setIsNearbyMode(true);
      }
      // Always reset requesting state
      setIsRequestingLocation(false);
    } else if (location) {
      // Location is already available
      setIsNearbyMode(true);
      setIsRequestingLocation(false);
    }
  }, [isNearbyMode, location, locationLoading, requestLocation]);

  const isLoading =
    isRequestingLocation || (locationLoading && isRequestingLocation);

  return (
    <View className="flex-1" style={{ backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 px-4 pt-3 pb-2">
        {/* Floating Search Container */}
        <View
          className="bg-white rounded-2xl p-2 flex-row items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Search Input */}
          <View className="flex-1">
            <TextInput
              className="pl-4 pr-4 py-2.5 text-gray-900 text-base"
              placeholder="Search mosques..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              editable={!isLoading}
              style={{ fontWeight: "500" }}
            />
          </View>

          {/* Near Me Button */}
          <TouchableOpacity
            onPress={handleNearbyPress}
            disabled={isLoading}
            className="rounded-xl items-center justify-center mr-1"
            style={{
              width: 44,
              height: 44,
              backgroundColor: isLoading
                ? "rgba(156, 163, 175, 0.1)"
                : isNearbyMode
                  ? "#10b981"
                  : "rgba(156, 163, 175, 0.1)",
              shadowColor: isNearbyMode ? "#10b981" : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: isNearbyMode ? 2 : 0,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <MapPin
                size={22}
                color={isNearbyMode ? "#fff" : "#6b7280"}
                strokeWidth={2.5}
              />
            )}
          </TouchableOpacity>
        </View>

        {isNearbyMode && (
          <View className="mt-3 flex-row justify-center">
            <View
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.2)",
              }}
            >
              <Text className="text-emerald-700 text-xs font-semibold">
                📍 Showing Results Nearby
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Spacer for floating header */}
      <View style={{ height: 85 }} />

      {/* Mosque List */}
      <MosqueList
        searchQuery={searchQuery}
        isNearbyMode={isNearbyMode && !!location}
        location={location}
      />
    </View>
  );
}

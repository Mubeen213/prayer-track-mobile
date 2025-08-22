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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-2">
        {/* Search Container */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-4">
          {/* Search Input */}
          <View className="relative mb-2">
            <TextInput
              className="bg-gray-50 rounded-lg pl-10 pr-4 py-3 text-gray-900"
              placeholder="Search mosques..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              editable={!isLoading}
            />
          </View>

          {/* Near Me Button */}
          <TouchableOpacity
            onPress={handleNearbyPress}
            disabled={isLoading}
            className={`border border-gray-200 rounded-lg py-3 flex-row items-center justify-center ${
              isLoading
                ? "bg-gray-100"
                : isNearbyMode
                  ? "bg-green-50 border-green-200"
                  : "bg-white"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <MapPin size={20} color={isNearbyMode ? "#059669" : "#10B981"} />
            )}
            <Text
              className={`font-medium ml-2 ${
                isLoading
                  ? "text-gray-400"
                  : isNearbyMode
                    ? "text-green-700"
                    : "text-gray-700"
              }`}
            >
              {isLoading
                ? "Finding Nearby Mosques..."
                : isNearbyMode
                  ? "Showing Nearby Mosques"
                  : "Find Mosques Near Me"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mosque List */}
      <MosqueList
        searchQuery={searchQuery}
        isNearbyMode={isNearbyMode && !!location}
        location={location}
      />
    </View>
  );
}

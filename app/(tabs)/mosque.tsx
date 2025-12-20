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
      <View className="absolute top-0 left-0 right-0 z-10 px-4 pt-2">
        {/* Floating Search Container */}
        <View className="bg-white rounded-full shadow-md border border-gray-100 p-2 flex-row items-center">
          {/* Search Input */}
          <View className="flex-1">
            <TextInput
              className="pl-4 pr-4 py-2 text-gray-900 h-10"
              placeholder="Search mosques..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              editable={!isLoading}
            />
          </View>

          {/* Near Me Button (Small Icon) */}
          <TouchableOpacity
            onPress={handleNearbyPress}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full items-center justify-center mr-1 ${
              isLoading
                ? "bg-gray-100"
                : isNearbyMode
                  ? "bg-emerald-500"
                  : "bg-gray-100"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <MapPin size={20} color={isNearbyMode ? "#fff" : "#6b7280"} />
            )}
          </TouchableOpacity>
        </View>

        {isNearbyMode && (
            <View className="mt-2 flex-row justify-center">
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                    <Text className="text-emerald-700 text-xs font-medium">Showing Results Nearby</Text>
                </View>
            </View>
        )}
      </View>
      
      {/* Spacer for floating header */}
      <View style={{ height: 80 }} />

      {/* Mosque List */}
      <MosqueList
        searchQuery={searchQuery}
        isNearbyMode={isNearbyMode && !!location}
        location={location}
      />
    </View>
  );
}

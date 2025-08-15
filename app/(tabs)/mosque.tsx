import React, { useState, useCallback } from "react";
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
  const [isNearbyMode, setIsNearbyMode] = useState(true);
  const [nearbyParams, setNearbyParams] = useState<{
    latitude: number;
    longitude: number;
    radius?: number;
  } | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const {
    location,
    loading: locationLoading,
    error,
    requestLocation,
  } = useLocation();

  React.useEffect(() => {
    if (
      isNearbyMode &&
      !location &&
      !locationLoading &&
      !locationRequested &&
      !error
    ) {
      setLocationRequested(true);
      requestLocation();
    }
  }, [
    isNearbyMode,
    location,
    locationLoading,
    locationRequested,
    error,
    requestLocation,
  ]);

  React.useEffect(() => {
    if (!isNearbyMode) {
      setLocationRequested(false);
    }
  }, [isNearbyMode]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsNearbyMode(false);
    setNearbyParams(null);
    setLocationRequested(false);
  }, []);

  const handleNearbyPress = useCallback(async () => {
    try {
      if (isNearbyMode) {
        // console.log("Exiting nearby mode");
        setIsNearbyMode(false);
        setNearbyParams(null);
        setSearchQuery("");
        setLocationRequested(false);
        return;
      }
      setIsNearbyMode(true);
      setSearchQuery("");
      setLocationRequested(true);

      await requestLocation();

      if (location) {
        setNearbyParams({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 10, // 10km radius
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setIsNearbyMode(false);
      setNearbyParams(null);
      setLocationRequested(false);
    }
  }, [requestLocation, location, isNearbyMode]);

  React.useEffect(() => {
    if (isNearbyMode && location && !nearbyParams) {
      setNearbyParams({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10,
      });
    }
  }, [location, isNearbyMode, nearbyParams]);

  const isLoading = locationLoading;

  return (
    <View className="flex-1 bg-gray-50 mb-8">
      {/* Header */}
      <View className="px-4 py-2">
        {/* <Text className="text-2xl font-bold bg-white text-gray-900 mb-4">
          Mosques
        </Text> */}

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
        isNearbyMode={isNearbyMode && !error}
      />
    </View>
  );
}

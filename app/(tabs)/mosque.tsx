import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MapPin } from "lucide-react-native";
import { MosqueList } from "../../components/MosqueList";
import { Mosque } from "../../types/mosque";

// Change this from named export to default export
export default function MosqueTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites] = useState<Record<string, boolean>>({}); // TODO: Implement favorites hook

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleMosquePress = useCallback((mosque: Mosque) => {
    // TODO: Navigate to mosque details
    console.log("Navigate to mosque:", mosque.id);
  }, []);

  const handleToggleFavorite = useCallback((mosqueId: string) => {
    // TODO: Implement toggle favorite
    console.log("Toggle favorite:", mosqueId);
  }, []);

  const handleNearbyPress = useCallback(() => {
    // TODO: Implement location functionality
    console.log("Find nearby mosques");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Mosques</Text>

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
            />
          </View>

          {/* Near Me Button */}
          <TouchableOpacity
            onPress={handleNearbyPress}
            className="bg-white border border-gray-200 rounded-lg py-3 flex-row items-center justify-center"
          >
            <MapPin size={20} color="#10B981" />
            <Text className="text-gray-700 font-medium ml-2">
              Find Mosques Near Me
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mosque List */}
      <MosqueList
        searchQuery={searchQuery}
        onMosquePress={handleMosquePress}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
      />
    </SafeAreaView>
  );
}

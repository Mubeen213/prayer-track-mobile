import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { MosqueCard } from "./MosqueCard";
import { useGetFavoriteMosques } from "../../hooks/useFavorites";
import { useFavoritesMutation } from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";
import { Mosque } from "../../types/mosque";
import { FavoriteMosque } from "../../types/favMosque";

export const FavoriteMosqueList = () => {
  const { userId } = useAuth();
  const { data: favorites, isLoading, isError } = useGetFavoriteMosques(userId);

  const favoriteMutation = useFavoritesMutation(userId);

  const handleToggleFavorite = (mosqueId: string) => {
    favoriteMutation.mutate(mosqueId);
  };

  const handleMosquePress = (mosque: Mosque) => {
    console.log("Navigate to mosque:", mosque.id);
  };

  // Transform FavoriteMosque to Mosque format
  const transformToMosque = (favMosque: FavoriteMosque): Mosque => ({
    id: favMosque.mosque_id,
    name: favMosque.mosque_name,
    address: favMosque.address,
    city: "", // Not available in FavoriteMosque
    state: "", // Not available in FavoriteMosque
    latitude: 0, // Not available in FavoriteMosque
    longitude: 0, // Not available in FavoriteMosque
    status: favMosque.status,
    prayer_timings: favMosque.prayer_timings,
    last_timings_update: "",
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading favorites...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center px-8 bg-gray-50">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Pull down to refresh and try again
        </Text>
      </View>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-8 bg-gray-50">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          No favorite mosques
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Start adding mosques to your favorites
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => (
        <MosqueCard
          mosque={transformToMosque(item)}
          onPress={handleMosquePress}
          isFavorite={true}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      className="bg-gray-50"
      showsVerticalScrollIndicator={false}
    />
  );
};

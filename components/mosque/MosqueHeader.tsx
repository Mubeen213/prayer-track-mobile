import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Mosque } from "../../types/mosque";
import { Bookmark } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import {
  useFavoritesMutation,
  useGetFavoritesStatus,
} from "../../hooks/useFavorites";

interface MosqueHeaderProps {
  mosque: Mosque;
}

export const MosqueHeader = ({ mosque }: MosqueHeaderProps) => {
  const { userId } = useAuth();
  const { data: favoritesData } = useGetFavoritesStatus(userId) as {
    data: Record<string, boolean> | undefined;
  };
  const favoriteMutation = useFavoritesMutation(userId);

  const isFavorite = favoritesData ? !!favoritesData[mosque.id] : false;

  const handleToggleFavorite = useCallback(() => {
    if (!userId) {
      console.log("User not logged in, cannot toggle favorite");
      return;
    }
    favoriteMutation.mutate(mosque.id);
  }, [userId, mosque.id, favoriteMutation]);

  return (
    <View className="p-4 border-b border-gray-100">
      <View className="flex-row items-center relative mb-2">
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-gray-900">{mosque.name}</Text>
        </View>
        <TouchableOpacity
          className="rounded-lg p-2"
          onPress={handleToggleFavorite}
        >
          <Bookmark
            className="h-5 w-5"
            color={isFavorite ? "#22c55e" : "#9ca3af"}
            fill={isFavorite ? "#22c55e" : "none"}
          />
        </TouchableOpacity>
      </View>
      <View className="items-center space-y-1">
        <Text className="text-sm text-gray-500">{mosque.address}</Text>
        {mosque.landmark && (
          <Text className="text-sm text-gray-500">{mosque.landmark}</Text>
        )}
        <Text className="text-sm text-gray-500">
          {mosque.city}, {mosque.state}
        </Text>
      </View>
    </View>
  );
};

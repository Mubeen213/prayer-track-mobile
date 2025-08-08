import React from "react";
import { View, Text } from "react-native";
import { FavoriteMosqueList } from "../../components/mosque/FavoriteMosqueList";

export default function FavoriteTab() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-6 bg-gray-50">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Favorites</Text>
      </View>
      <FavoriteMosqueList />
    </View>
  );
}

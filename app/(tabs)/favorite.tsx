import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { FavoriteMosqueList } from "../../components/FavoriteMosqueList";

export default function FavoriteTab() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Favorites</Text>
      </View>
      <FavoriteMosqueList />
    </SafeAreaView>
  );
}

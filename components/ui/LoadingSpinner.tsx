import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export const LoadingSpinner: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#059669" />
      <Text className="mt-4 text-gray-600">Loading chapter...</Text>
    </View>
  );
};
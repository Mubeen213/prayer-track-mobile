import React from "react";
import { View } from "react-native";

export const MosqueDetailSkeleton = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="max-w-4xl mx-auto">
        <View className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header Skeleton */}
          <View className="p-4 border-b border-gray-100">
            <View className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <View className="items-center space-y-1">
              <View className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <View className="h-4 bg-gray-200 rounded w-1/3" />
            </View>
          </View>
          {/* Content Skeleton */}
          <View className="p-4">
            <View className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <View key={i} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

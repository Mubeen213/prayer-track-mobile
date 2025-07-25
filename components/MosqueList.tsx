import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Mosque } from "../types/mosque";
import { MosqueCard } from "./MosqueCard";
import { useMosques } from "../hooks/useMosques";

interface MosqueListProps {
  searchQuery: string;
  onMosquePress?: (mosque: Mosque) => void;
  onToggleFavorite?: (mosqueId: string) => void;
  favorites?: Record<string, boolean>;
}

export const MosqueList: React.FC<MosqueListProps> = ({
  searchQuery,
  onMosquePress,
  onToggleFavorite,
  favorites = {},
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useMosques({
    search: searchQuery,
    limit: 6,
  });

  const mosques = data?.pages.flatMap((page) => page.mosques) || [];

  const renderMosque = ({ item }: { item: Mosque }) => (
    <MosqueCard
      mosque={item}
      onPress={onMosquePress}
      isFavorite={favorites[item.id] || false}
      onToggleFavorite={onToggleFavorite}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading mosques...</Text>
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

  if (mosques.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-8 bg-gray-50">
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          No mosques found
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          {searchQuery
            ? "Try adjusting your search"
            : "Pull down to refresh and load mosques"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mosques}
      renderItem={renderMosque}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={["#10B981"]}
          tintColor="#10B981"
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      className="bg-gray-50"
      contentContainerStyle={{ paddingVertical: 8 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

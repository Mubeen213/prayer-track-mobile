import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { InfiniteData } from "@tanstack/react-query";
import { useMosques } from "../../hooks/useMosques";
import { MosqueCard } from "./MosqueCard";
import { MosquesResponse } from "../../types/mosque";
import { useAuth } from "../../hooks/useAuth";
import { Mosque } from "../../types/mosque";
import {
  useGetFavoritesStatus,
  useFavoritesMutation,
} from "../../hooks/useFavorites";

interface MosqueListProps {
  searchQuery: string;
  isNearbyMode?: boolean;
  nearbyData?: InfiniteData<MosquesResponse>;
  nearbyLoading?: boolean;
  nearbyError?: Error | null;
  onLoadMoreNearby?: () => void;
  hasMoreNearby?: boolean;
  isLoadingMoreNearby?: boolean;
}

export const MosqueList: React.FC<MosqueListProps> = ({
  searchQuery,
  isNearbyMode = false,
  nearbyData,
  nearbyLoading,
  nearbyError,
  onLoadMoreNearby,
  hasMoreNearby,
  isLoadingMoreNearby,
}) => {
  // Get user authentication state
  const { user } = useAuth();

  // Favorites hooks
  const { data: favoritesStatus = {} } = useGetFavoritesStatus(
    user?.id || null
  ) as { data: Record<string, boolean> };
  const favoritesMutation = useFavoritesMutation(user?.id || null);

  // Use regular search when not in nearby mode
  const {
    data: searchData,
    isLoading: searchLoading,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: hasSearchNextPage,
    isFetchingNextPage: isSearchFetchingNext,
  } = useMosques({
    search: searchQuery,
    limit: 6,
    enabled: !isNearbyMode,
  });

  // Determine which data to use
  const data = isNearbyMode ? nearbyData : searchData;
  const isLoading = isNearbyMode ? nearbyLoading : searchLoading;
  const error = isNearbyMode ? nearbyError : null;
  const fetchNextPage = isNearbyMode ? onLoadMoreNearby : fetchSearchNextPage;
  const hasNextPage = isNearbyMode ? hasMoreNearby : hasSearchNextPage;
  const isFetchingNextPage = isNearbyMode
    ? isLoadingMoreNearby
    : isSearchFetchingNext;

  // Flatten the paginated data
  const mosques = data?.pages?.flatMap((page) => page.mosques) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  };

  const handleMosquePress = useCallback((mosque: Mosque) => {
    router.push(`/mosque/${mosque.id}?from=mosques`);
  }, []);

  const handleToggleFavorite = (mosqueId: string) => {
    if (!user) {
      // Handle unauthenticated user - could show login prompt
      return;
    }
    favoritesMutation.mutate(mosqueId);
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-500 mt-2">
            {isNearbyMode ? "Finding nearby mosques..." : "Loading mosques..."}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-red-500 text-center">
            {isNearbyMode
              ? "Failed to find nearby mosques"
              : "Failed to load mosques"}
          </Text>
          <Text className="text-gray-500 text-center mt-1">
            Please try again
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500 text-center">
          {isNearbyMode ? "No mosques found nearby" : "No mosques found"}
        </Text>
        <Text className="text-gray-400 text-center text-sm mt-1">
          {isNearbyMode
            ? "Try increasing the search radius"
            : "Try a different search term"}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 px-4">
      <FlatList
        data={mosques}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MosqueCard
            mosque={item}
            isFavorite={favoritesStatus[item.id] || false}
            onToggleFavorite={handleToggleFavorite}
            onPress={() => handleMosquePress(item)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mosques.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
};

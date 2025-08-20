import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { InfiniteData } from "@tanstack/react-query";
import { useMosques, useNearbyMosques } from "../../hooks/useMosques";
import { MosqueCard } from "./MosqueCard";
import { MosquesResponse } from "../../types/mosque";
import { useAuth } from "../../hooks/useAuth";
import { Mosque } from "../../types/mosque";
import { useLocation } from "../../hooks/useLocation";
import {
  useGetFavoritesStatus,
  useFavoritesMutation,
} from "../../hooks/useFavorites";

interface MosqueListProps {
  searchQuery: string;
  isNearbyMode?: boolean;
}

export const MosqueList: React.FC<MosqueListProps> = ({
  searchQuery,
  isNearbyMode = false,
}) => {
  const { user, userId } = useAuth();
  const { location, requestLocation } = useLocation();

  React.useEffect(() => {
    if (isNearbyMode && !location) {
      requestLocation();
    }
  }, [isNearbyMode, location, requestLocation]);

  // Favorites hooks
  const { data: favoritesStatus = {} } = useGetFavoritesStatus(
    userId || null
  ) as { data: Record<string, boolean> };
  const favoritesMutation = useFavoritesMutation(userId || null);

  // Regular search/browse mosques from cache
  const {
    data: searchData,
    isLoading: searchLoading,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: hasSearchNextPage,
    isFetchingNextPage: isSearchFetchingNext,
    error: searchError,
  } = useMosques({
    search: searchQuery,
    limit: 20,
    enabled: !isNearbyMode,
  });

  const {
    data: nearbyData,
    isLoading: nearbyLoading,
    fetchNextPage: fetchNearbyNextPage,
    hasNextPage: hasNearbyNextPage,
    isFetchingNextPage: isNearbyFetchingNext,
    error: nearbyError,
  } = useNearbyMosques(
    isNearbyMode ? location?.latitude || null : null,
    isNearbyMode ? location?.longitude || null : null,
    8 // 8km radius
  );

  // Determine which data to use
  const data = isNearbyMode ? nearbyData : searchData;
  const isLoading = isNearbyMode ? nearbyLoading : searchLoading;
  const error = isNearbyMode ? nearbyError : searchError;
  const fetchNextPage = isNearbyMode
    ? fetchNearbyNextPage
    : fetchSearchNextPage;
  const hasNextPage = isNearbyMode ? hasNearbyNextPage : hasSearchNextPage;
  const isFetchingNextPage = isNearbyMode
    ? isNearbyFetchingNext
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
    if (!userId) {
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
      console.error("Error loading mosques:", error);
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
      </View>
    );
  };

  return (
    <View className="flex-1 mb-20">
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
        initialNumToRender={10}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mosques.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
};

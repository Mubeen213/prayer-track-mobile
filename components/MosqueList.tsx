import React, { useCallback } from "react";
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
import {
  useGetFavoritesStatus,
  useFavoritesMutation,
} from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";

interface MosqueListProps {
  searchQuery: string;
}

export const MosqueList: React.FC<MosqueListProps> = ({ searchQuery }) => {
  const { userId } = useAuth();

  const {
    data,
    isLoading: isMosquesLoading,
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

  const { data: favoritesData, isLoading: isFavoritesLoading } =
    useGetFavoritesStatus(userId) as {
      data: Record<string, boolean> | undefined;
      isLoading: boolean;
    };

  const favoriteMutation = useFavoritesMutation(userId);

  const handleToggleFavorite = useCallback((mosqueId: string) => {
    if (!userId) {
      console.log("User not logged in, cannot toggle favorite");
      return;
    }
    favoriteMutation.mutate(mosqueId);
    console.log("Toggle favorite:", mosqueId);
  }, []);

  const handleMosquePress = useCallback((mosque: Mosque) => {
    // TODO: Navigate to mosque details
    console.log("Navigate to mosque:", mosque.id);
  }, []);

  const renderMosque = ({ item }: { item: Mosque }) => (
    <MosqueCard
      mosque={item}
      onPress={handleMosquePress}
      isFavorite={favoritesData?.[item.id] || false}
      onToggleFavorite={handleToggleFavorite}
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

  if (isMosquesLoading || isFavoritesLoading) {
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "../config/axios";
import { GET_FAVORITES } from "../utils/urls";
import { FavoriteMosque } from "../types/favMosque";
import { FavoriteService } from "../services/favoriteService";

const QUERY_KEYS = {
  favoriteStatus: (userId: string | null | undefined) => [
    "favorites-status",
    userId ?? undefined,
  ],
  favoriteMosques: (userId: string | null | undefined) => [
    "favorites-mosques",
    userId ?? undefined,
  ],
} as const;

export const useFavoritesMutation = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mosqueId: string) => api.post(`${GET_FAVORITES}/${mosqueId}`),
    onSuccess: async (
      data: {
        data: { action: "added" | "removed" | "restored" };
      },
      mosqueId
    ) => {
      const messages = {
        added: "Mosque added to favorites",
        removed: "Mosque removed from favorites",
        restored: "Mosque restored to favorites",
      };

      Toast.show({
        type: "success",
        text1: messages[data.data.action],
      });

      if (userId) {
        await FavoriteService.syncFavorites(userId, true);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.favoriteStatus(userId),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.favoriteMosques(userId),
          }),
        ]);
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: QUERY_KEYS.favoriteStatus(userId),
            type: "active",
          }),
          queryClient.refetchQueries({
            queryKey: QUERY_KEYS.favoriteMosques(userId),
            type: "active",
          }),
        ]);
      }
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Failed to update favorites",
      });
    },
  });
};

export const useGetFavoritesStatus = (userId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.favoriteStatus(userId),
    queryFn: async (): Promise<Record<string, boolean>> => {
      if (!userId) return {};

      const cachedStatus = await FavoriteService.getFavoriteStatus(userId);
      if (Object.keys(cachedStatus).length > 0) {
        return cachedStatus;
      }

      await FavoriteService.syncFavorites(userId, true);
      return await FavoriteService.getFavoriteStatus(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useGetFavoriteMosques = (userId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.favoriteMosques(userId),
    queryFn: async (): Promise<FavoriteMosque[]> => {
      if (!userId) return [];

      const cachedFavorites = await FavoriteService.getFavorites(userId);
      if (cachedFavorites.length > 0) {
        return cachedFavorites;
      }

      await FavoriteService.syncFavorites(userId, true);
      return await FavoriteService.getFavorites(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

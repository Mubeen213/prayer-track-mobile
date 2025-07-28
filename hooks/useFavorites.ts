import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "../config/axios";
import { GET_FAVORITES } from "../utils/urls";
import { FavoriteMosque } from "../types/favMosque";
const QUERY_KEYS = {
  favoriteStatus: (userId?: string) => ["favorites-status", userId],
  favoriteMosques: (userId?: string) => ["favorites-mosques", userId],
} as const;

export const useFavoritesMutation = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mosqueId: string) => api.post(`${GET_FAVORITES}/${mosqueId}`),
    onSuccess: (data: {
      data: { action: "added" | "removed" | "restored" };
    }) => {
      const messages = {
        added: "Mosque added to favorites",
        removed: "Mosque removed from favorites",
        restored: "Mosque restored to favorites",
      };
      Toast.show({ type: "success", text1: messages[data.data.action] });

      if (userId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.favoriteStatus(userId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.favoriteMosques(userId),
        });
      }
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Failed to update favorites" });
    },
  });
};

export const useGetFavoritesStatus = (userId: string | null) => {
  if (!userId) {
    return { data: {}, isLoading: false, isError: false };
  }
  return useQuery({
    queryKey: QUERY_KEYS.favoriteStatus(userId),
    queryFn: async (): Promise<Record<string, boolean>> => {
      const { data } = await api.get<FavoriteMosque[]>(`${GET_FAVORITES}`);
      return data.reduce(
        (acc, fav) => {
          acc[fav.mosque_id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// For FavoriteMosques page - returns full mosque data
export const useGetFavoriteMosques = (userId: string | null) => {
  if (!userId) {
    return { data: [], isLoading: false, isError: false };
  }
  return useQuery({
    queryKey: QUERY_KEYS.favoriteMosques(userId),
    queryFn: async () => {
      const { data } = await api.get<FavoriteMosque[]>(`${GET_FAVORITES}`);
      return data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "@prayer_track_favorite_verses";

export interface FavoriteVerse {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  addedAt: number;
  // We store minimal data to keep storage light.
  // We can look up the text from the chapter data when displaying the list.
}

export const useVerseFavorites = () => {
  const queryClient = useQueryClient();

  // Fetch Favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorite-verses"],
    queryFn: async (): Promise<FavoriteVerse[]> => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch (e) {
        console.error("Failed to fetch favorite verses", e);
        return [];
      }
    },
  });

  // Toggle Favorite Mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (verse: Omit<FavoriteVerse, "addedAt">) => {
      const currentFavorites = favorites;
      const existingIndex = currentFavorites.findIndex(
        (f) =>
          f.surahNumber === verse.surahNumber &&
          f.verseNumber === verse.verseNumber
      );

      let newFavorites = [...currentFavorites];
      let action: "added" | "removed" = "added";

      if (existingIndex >= 0) {
        // Remove
        newFavorites.splice(existingIndex, 1);
        action = "removed";
      } else {
        // Add
        newFavorites.push({ ...verse, addedAt: Date.now() });
        action = "added";
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return { action, newFavorites };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["favorite-verses"], data.newFavorites);
      Toast.show({
        type: "success",
        text1:
          data.action === "added"
            ? "Added to favorites"
            : "Removed from favorites",
        visibilityTime: 2000,
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Failed to update Favorites",
      });
    },
  });

  const isFavorite = (surahNumber: number, verseNumber: number) => {
    return favorites.some(
      (f) => f.surahNumber === surahNumber && f.verseNumber === verseNumber
    );
  };

  const toggleFavorite = (
    surahNumber: number,
    verseNumber: number,
    surahName: string
  ) => {
    toggleFavoriteMutation.mutate({ surahNumber, verseNumber, surahName });
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading: toggleFavoriteMutation.isPending,
  };
};

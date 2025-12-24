import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVerseFavorites } from "../../hooks/useVerseFavorites";
import chapters from "../../data/quran-chapters";
import { VerseCard } from "../../components/quran/VerseCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Note: In a real app with large data, we would need a more efficient way 
// to look up verse text than iterating through all chapters/verses.
// But for this MVP with local data, this is acceptable.
// We also need to fetch the *content* of the verse. 
// Assuming `useChapter` or a similar service can fetch content by ID.
// However, the `chapters` data file only has names.
// Does the app have the full Quran text locally?
// Based on `ChapterPage` code: `useChapter` hook fetches data.
// So we should probably use a component that fetches the text for each favorite.
// Or, simplified: The `ChapterPage` gets data from an API/JSON.
// Let's create a `FavoriteVerseItem` component that fetches its own data or displays what it has.
// Wait, `useVerseFavorites` only stores IDs.
// If we don't have the text offline, we can't show it easily without fetching.
// Let's assume for now we list them and clicking goes to the chapter.
// OR, we can try to fetch.

// Let's make a simple list first that links to the verse.

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useVerseFavorites();
  const insets = useSafeAreaInsets();

  const handlePress = (surahNumber: number, verseNumber: number) => {
    router.push(`/chapter/${surahNumber}/?verse=${verseNumber}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View style={{ paddingTop: insets.top }} className="shadow-sm border-b border-gray-100 z-10">
        <View className="px-4 pb-4 flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full bg-gray-100"
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Favorite Verses</Text>
        </View>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.surahNumber}:${item.verseNumber}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-lg mb-2">No favorites yet</Text>
            <Text className="text-gray-400 text-center px-8">
              Tap the heart icon on any verse while reading to save it here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.surahNumber, item.verseNumber)}
            className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100 flex-row justify-between items-center"
          >
            <View>
              <Text className="font-semibold text-gray-800 text-lg">
                {item.surahName}
              </Text>
              <Text className="text-gray-500">
                Verse {item.verseNumber}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                <Text className="text-emerald-600 font-bold">{item.surahNumber}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

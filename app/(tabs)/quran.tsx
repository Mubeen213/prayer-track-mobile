import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ChaptersList } from "../../components/quran/ChaptersList";
import { SearchBar } from "../../components/quran/SearchBar";
import { ContinueReadingCard } from "../../components/quran/ContinueReadingCard";
import { useReadingProgress } from "../../hooks/useReadingProgress";
import chapters from "../../data/quran-chapters";

export default function Quran() {
  const router = useRouter();
  const { progress, hasProgress } = useReadingProgress();

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    if (query.includes(":")) {
      const [chapter, verse] = query.split(":").map((num) => parseInt(num));
      router.push(`/chapter/${chapter}/?verse=${verse}`);
      return;
    }

    // Search by name
    interface Chapter {
      number: number;
      chapter: string;
    }

    const foundChapter = chapters.find((chapter: Chapter) =>
      chapter.number.toString().includes(query.toLowerCase())
    );

    if (foundChapter) {
      router.push(`/chapter/${foundChapter.number}`);
    } else {
      Alert.alert("Not Found", "Chapter not found.");
    }
  };

  const handleContinueReading = () => {
    if (progress) {
      router.push(`/chapter/${progress.chapter}/?verse=${progress.verse}`);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="">
        <Text className="text-3xl font-bold mb-8 text-center px-4">
          The Holy Quran
        </Text>

        {hasProgress && progress && (
          <ContinueReadingCard
            progress={progress}
            onPress={handleContinueReading}
          />
        )}

        <SearchBar onSearch={handleSearch} />

        {/* Favorites Button */}
        <TouchableOpacity
          onPress={() => router.push("/quran/favorites")}
          className="mx-4 mb-6 mt-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center">
               <Ionicons name="heart" size={24} color="#db2777" />
            </View>
            <View>
                <Text className="text-lg font-bold text-gray-900">Favorite Verses</Text>
                <Text className="text-gray-500">View your saved ayahs</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <ChaptersList chapters={chapters} />
      </View>
    </View>
  );
}

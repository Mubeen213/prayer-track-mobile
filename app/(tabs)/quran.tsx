import React, { useState } from "react";
import { View, Text, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ChaptersList } from "../../components/quran/ChaptersList";
import { SearchBar } from "../../components/quran/SearchBar";
import chapters from "../../data/quran-chapters";

export default function Quran() {
  const router = useRouter();

  const handleChapterPress = (chapterNumber: number) => {
    router.push(`/quran/${chapterNumber}`);
  };

  const handleSearch = (query: string) => {
    if (query.includes(":")) {
      const [chapter, verse] = query.split(":").map((num) => parseInt(num));
      router.push(`/quran/${chapter}?verse=${verse}`);
      return;
    }

    const chapterNum = parseInt(query);
    if (!isNaN(chapterNum)) {
      router.push(`/quran/${chapterNum}`);
      return;
    }

    // Search by name
    interface Chapter {
      number: number;
      chapter: string;
    }

    const foundChapter = chapters.find((chapter: Chapter) =>
      chapter.chapter.toLowerCase().includes(query.toLowerCase())
    );

    if (foundChapter) {
      router.push(`/quran/${foundChapter.number}`);
    } else {
      Alert.alert("Not Found", "Chapter not found.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="max-w-4xl  px-4">
        <Text className="text-3xl font-bold mb-8 text-center">
          The Holy Quran
        </Text>

        <SearchBar onSearch={handleSearch} />

        <ChaptersList chapters={chapters} onChapterPress={handleChapterPress} />
      </View>
    </SafeAreaView>
  );
}

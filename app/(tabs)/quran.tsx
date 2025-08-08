import React, { useState } from "react";
import { View, Text, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ChaptersList } from "../../components/quran/ChaptersList";
import { SearchBar } from "../../components/quran/SearchBar";
import chapters from "../../data/quran-chapters";

export default function Quran() {
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="max-w-4xl px-4">
        <Text className="text-3xl font-bold mb-8 text-center">
          The Holy Quran
        </Text>

        <SearchBar onSearch={handleSearch} />

        <ChaptersList chapters={chapters} />
      </View>
    </View>
  );
}

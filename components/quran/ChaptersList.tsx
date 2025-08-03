import React from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import { ChapterCard } from "./ChapterCard";

interface Chapter {
  number: number;
  chapter: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
}

export const ChaptersList: React.FC<ChaptersListProps> = ({ chapters }) => {
  const handleChapterPress = (chapterNumber: number) => {
    router.push(`/chapter/${chapterNumber}`);
  };

  return (
    <FlatList
      data={chapters}
      keyExtractor={(item) => item.number.toString()}
      renderItem={({ item }) => (
        <ChapterCard
          number={item.number}
          name={item.chapter}
          onPress={() => handleChapterPress(item.number)}
        />
      )}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

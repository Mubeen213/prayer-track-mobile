import React from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const tabBarHeight = 80;

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
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + tabBarHeight + 300,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

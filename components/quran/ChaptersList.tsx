import React from "react";
import { FlatList, View } from "react-native";
import { ChapterCard } from "./ChapterCard";

interface Chapter {
  number: number;
  chapter: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
  onChapterPress: (chapterNumber: number) => void;
}

export const ChaptersList: React.FC<ChaptersListProps> = ({
  chapters,
  onChapterPress,
}) => {
  return (
    <FlatList
      data={chapters}
      keyExtractor={(item) => item.number.toString()}
      renderItem={({ item }) => (
        <ChapterCard
          number={item.number}
          name={item.chapter}
          onPress={() => onChapterPress(item.number)}
        />
      )}
      contentContainerStyle={{ padding: 16 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      showsVerticalScrollIndicator={false}
    />
  );
};

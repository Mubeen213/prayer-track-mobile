import React from "react";
import { View, Text } from "react-native";
import {
  useFonts,
  ScheherazadeNew_400Regular,
} from "@expo-google-fonts/scheherazade-new";
import { Chapter } from "../../types/quran";

interface ChapterTitleProps {
  chapter: Chapter;
}

export const ChapterTitle: React.FC<ChapterTitleProps> = ({ chapter }) => {
  const [fontLoaded] = useFonts({ ScheherazadeNew_400Regular });
  return (
    <View className="px-4 py-8 bg-[#fafaf7]">
      <View className="items-center">
        <Text
          className="text-3xl mb-2 text-center text-gray-900"
          style={{
            fontFamily: fontLoaded ? "ScheherazadeNew_400Regular" : undefined,
          }}
        >
          سورة {chapter.surah_name}
        </Text>
        <Text className="text-lg text-gray-600">
          Chapter {chapter.surah_number}
        </Text>
      </View>
    </View>
  );
};

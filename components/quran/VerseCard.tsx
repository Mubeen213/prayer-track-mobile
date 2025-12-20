import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  useFonts,
  ScheherazadeNew_400Regular,
} from "@expo-google-fonts/scheherazade-new";
import { Heart } from "lucide-react-native";

interface VerseCardProps {
  ayah: {
    ayah_number: number;
    arabic: string;
    english: string;
    urdu: string;
  };
  fontSize: string;
  showTranslation: string;
  getFontSize: (size: string) => string;
  getTranslationFontSize: (size: string) => string;
  toArabicNumeral: (num: number) => string;
  isHighlighted?: boolean;
  // Favorites Props
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  ayah,
  fontSize,
  showTranslation,
  getFontSize,
  getTranslationFontSize,
  toArabicNumeral,
  isHighlighted = false,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [fontLoaded] = useFonts({ ScheherazadeNew_400Regular });
  return (
    <View
      className={`rounded-xl mb-2 shadow-sm border ${
        isHighlighted
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header Row: Number & Actions */}
      <View className="px-4 pt-3 flex-row justify-between items-center bg-gray-50/30 rounded-t-xl">
        <View className="flex-row items-center gap-2">
            <View className="rounded-full w-8 h-8 bg-emerald-100 items-center justify-center">
                <Text className="text-sm text-emerald-800 font-bold">
                    {ayah.ayah_number}
                </Text>
            </View>
        </View>

        {onToggleFavorite && (
            <TouchableOpacity 
                onPress={onToggleFavorite}
                className="p-2 active:opacity-60"
            >
                <Heart 
                    size={20} 
                    color={isFavorite ? "#ec4899" : "#9ca3af"} 
                    fill={isFavorite ? "#ec4899" : "transparent"} 
                />
            </TouchableOpacity>
        )}
      </View>

      {/* Arabic Text */}
      <View className="p-4 pt-2">
        <View className="flex-row-reverse items-start">
          <View className="flex-1">
            <Text
              className={`${getFontSize(fontSize)} text-right leading-[2.5] text-gray-900`}
              style={{
                fontFamily: fontLoaded
                  ? "ScheherazadeNew_400Regular"
                  : undefined,
              }}
            >
              {ayah.arabic}
            </Text>
          </View>
        </View>
      </View>
      {/* Translations */}
      {showTranslation !== "none" && (
        <View className="p-4 border-t bg-gray-50/50 border-gray-200">
          {(showTranslation === "english" || showTranslation === "both") && (
            <Text
              className={`${getTranslationFontSize(fontSize)} mb-4 text-gray-600`}
            >
              {ayah.english}
            </Text>
          )}

          {(showTranslation === "urdu" || showTranslation === "both") && (
            <Text
              className={`${getTranslationFontSize(fontSize)} text-right text-gray-600 font-nastaliq`}
            >
              {ayah.urdu}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

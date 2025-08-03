import React from "react";
import { View, Text } from "react-native";

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
}

export const VerseCard: React.FC<VerseCardProps> = ({
  ayah,
  fontSize,
  showTranslation,
  getFontSize,
  getTranslationFontSize,
  toArabicNumeral,
  isHighlighted = false,
}) => {
  return (
    <View
      className={`rounded-xl mb-2 shadow-sm border ${
        isHighlighted
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Arabic Text */}
      <View className="p-4">
        <View className="flex-row-reverse items-start">
          <View className="flex-1">
            <Text
              className={`${getFontSize(fontSize)} text-right leading-10 text-gray-900 font-amiri`}
            >
              {ayah.arabic}
            </Text>
            {/* Separate verse number container */}
            <View className="flex-row-reverse mt-2">
              <View className="rounded-full w-6 h-6 bg-gray-50 border-2 border-gray-200 items-center justify-center">
                <Text className="text-xs text-gray-600 font-amiri">
                  {toArabicNumeral(ayah.ayah_number)}
                </Text>
              </View>
            </View>
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

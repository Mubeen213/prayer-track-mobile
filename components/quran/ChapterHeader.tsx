import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Settings } from "lucide-react-native";
import { Select } from "../ui/Select";

interface ChapterHeaderProps {
  fontSize: string;
  showTranslation: string;
  isMobileMenuOpen: boolean;
  fontSizeOptions: Array<{ value: string; label: string }>;
  translationOptions: Array<{ value: string; label: string }>;
  onNavigateBack: () => void;
  onFontSizeChange: (size: string) => void;
  onTranslationChange: (type: string) => void;
  onMobileMenuToggle: () => void;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  fontSize,
  showTranslation,
  isMobileMenuOpen,
  fontSizeOptions,
  translationOptions,
  onNavigateBack,
  onFontSizeChange,
  onTranslationChange,
  onMobileMenuToggle,
}) => {
  return (
    <View className="bg-white border-b border-gray-200 shadow-sm">
      <View className="px-4 mt-7">
        {/* Top Row - Back Button and Settings */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={onNavigateBack}
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 active:bg-gray-200"
            activeOpacity={0.8}
          >
            <ArrowLeft size={16} color="#374151" />
            <Text className="text-gray-700">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onMobileMenuToggle}
            className="p-2 rounded-lg bg-gray-100 active:bg-gray-200"
            activeOpacity={0.8}
          >
            <Settings size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Mobile Controls - Collapsible */}
        {isMobileMenuOpen && (
          <View>
            <View>
              <Select
                value={fontSize}
                onChange={onFontSizeChange}
                options={fontSizeOptions}
                placeholder="Font Size"
              />
            </View>
            <View>
              <Select
                value={showTranslation}
                onChange={onTranslationChange}
                options={translationOptions}
                placeholder="Translation"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

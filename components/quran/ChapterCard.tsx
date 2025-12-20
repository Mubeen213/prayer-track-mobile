import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ChapterCardProps {
  number: number;
  name: string;
  onPress: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  number,
  name,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-4">
        {/* Index Circle */}
        <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
            <Text className="text-emerald-600 font-bold font-sans">{number}</Text>
        </View>
        
        {/* English Name (Placeholder if we had it) or just Number Label */}
        <View>
             <Text className="text-gray-400 text-xs uppercase tracking-wider font-medium">Chapter {number}</Text>
        </View>
      </View>

      {/* Arabic Name */}
      <Text className="text-xl font-bold text-gray-800 font-amiri min-w-[100px] text-right">
        {name}
      </Text>
    </TouchableOpacity>
  );
};

import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) {
      return;
    }

    if (query.includes(":")) {
      const [chapter, verse] = query.split(":").map((num) => parseInt(num));
      if (chapter >= 1 && chapter <= 114) {
        onSearch(query);
        return;
      } else {
        Alert.alert("Error", "Invalid chapter number.");
        return;
      }
    }

    const chapterNum = parseInt(query);
    if (!isNaN(chapterNum)) {
      if (chapterNum >= 1 && chapterNum <= 114) {
        onSearch(query);
        return;
      } else {
        Alert.alert("Error", "Invalid chapter number.");
        return;
      }
    }

    onSearch(query);
  };

  return (
    <View className="mb-8">
      <View className="flex-row gap-2">
        <TextInput
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Eg: 18 or 2:89"
          placeholderTextColor="#9CA3AF"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex-row items-center gap-2"
          activeOpacity={0.8}
        >
          <Search size={16} color="#ffffff" />
          <Text className="text-white">Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

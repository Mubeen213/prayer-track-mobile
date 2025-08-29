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
    <View className="flex-1 justify-center items-center p-4 mb-6">
      <View className="mb-6 w-full">
        <View className="flex-row">
          <TextInput
            className="flex-1 rounded-lg border border-gray-300 mr-2 text-gray-900"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              minHeight: 44,
              fontSize: 16,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Eg: 18 or 2:89"
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            onPress={handleSearch}
            className="bg-green-500 rounded-lg flex-row items-center"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              minHeight: 44,
            }}
            activeOpacity={0.8}
          >
            <Search size={16} color="#ffffff" />
            <Text className="text-white ml-2">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

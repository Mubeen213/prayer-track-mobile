import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    setIsOpen(false);
    onChange(optionValue);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between px-3 py-2 rounded-md border border-gray-200 bg-white active:bg-gray-50 mb-2"
        activeOpacity={0.8}
      >
        <Text className="flex-1 text-sm text-gray-700">
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={16} color="#374151" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="w-4/5 max-h-80 rounded-lg shadow-lg bg-white">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className={`p-4 border-b border-gray-200 active:bg-gray-50 ${
                    item.value === value ? "bg-gray-50" : ""
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-gray-700 ${
                      item.value === value ? "font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

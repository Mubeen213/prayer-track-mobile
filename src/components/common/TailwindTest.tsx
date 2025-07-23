import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function TailwindTest() {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="space-y-4">
        {/* Header */}
        <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
          Tailwind CSS Test
        </Text>

        {/* Color Test */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Color Tests
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-red-500 p-3 rounded">
              <Text className="text-white font-medium">Red</Text>
            </View>
            <View className="bg-blue-500 p-3 rounded">
              <Text className="text-white font-medium">Blue</Text>
            </View>
            <View className="bg-green-500 p-3 rounded">
              <Text className="text-white font-medium">Green</Text>
            </View>
            <View className="bg-yellow-500 p-3 rounded">
              <Text className="text-black font-medium">Yellow</Text>
            </View>
          </View>
        </View>

        {/* Typography Test */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Typography Tests
          </Text>
          <Text className="text-xs text-gray-600 mb-1">Extra Small Text</Text>
          <Text className="text-sm text-gray-700 mb-1">Small Text</Text>
          <Text className="text-base text-gray-800 mb-1">Base Text</Text>
          <Text className="text-lg text-gray-900 mb-1">Large Text</Text>
          <Text className="text-xl font-bold text-purple-600">Extra Large Bold</Text>
        </View>

        {/* Spacing Test */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Spacing Tests
          </Text>
          <View className="space-y-2">
            <View className="bg-indigo-200 p-2 rounded">
              <Text className="text-indigo-800">Small Padding</Text>
            </View>
            <View className="bg-indigo-300 p-4 rounded">
              <Text className="text-indigo-900">Medium Padding</Text>
            </View>
            <View className="bg-indigo-400 p-6 rounded">
              <Text className="text-white">Large Padding</Text>
            </View>
          </View>
        </View>

        {/* Flexbox Test */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Flexbox Tests
          </Text>
          <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded mb-2">
            <Text className="text-gray-700">Left</Text>
            <Text className="text-gray-700">Center</Text>
            <Text className="text-gray-700">Right</Text>
          </View>
          <View className="flex-row justify-center bg-teal-100 p-3 rounded">
            <Text className="text-teal-800 font-medium">Centered Content</Text>
          </View>
        </View>

        {/* Border and Shadow Test */}
        <View className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-200">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Borders & Shadows
          </Text>
          <View className="border border-gray-300 rounded-md p-3 mb-2">
            <Text className="text-gray-700">Light Border</Text>
          </View>
          <View className="border-2 border-red-400 rounded-lg p-3 shadow-md">
            <Text className="text-red-700 font-medium">Thick Border with Shadow</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
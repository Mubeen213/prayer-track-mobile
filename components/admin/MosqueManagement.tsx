import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Search,
  ArrowLeft,
  Building2,
  Clock,
  Calendar,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAdminMosques } from "../../hooks/useAdminMosques";
import { Mosque } from "../../types/mosque";
import { AdminMosqueCard } from "./MosqueAdminCard";

export const MosqueManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mosques, isLoading, refetch, isRefetching } = useAdminMosques();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const filteredMosques =
    mosques?.filter(
      (mosque) =>
        mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mosque.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const renderMosqueItem = ({ item }: { item: Mosque }) => (
    <AdminMosqueCard mosque={item} />
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading your mosques...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={handleGoBack}
            className="mr-4 p-2 rounded-lg bg-gray-100"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 flex-1">
            My Mosques
          </Text>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Search your mosques..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Building2 size={20} color="#10B981" />
            <Text className="text-sm text-gray-600 ml-2">
              Managing {filteredMosques.length} mosque
              {filteredMosques.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <Clock size={16} color="#3B82F6" />
              <Text className="text-xs text-gray-500 ml-1">Timings</Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={16} color="#10B981" />
              <Text className="text-xs text-gray-500 ml-1">Events</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mosques List */}
      <FlatList
        data={filteredMosques}
        renderItem={renderMosqueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#10B981"]}
            tintColor="#10B981"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Building2 size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 mb-2 mt-4">
              No mosques found
            </Text>
            <Text className="text-sm text-gray-600 text-center px-8">
              {searchQuery
                ? "Try adjusting your search terms"
                : "You don't have any mosques assigned yet"}
            </Text>
            {!searchQuery && (
              <Text className="text-xs text-gray-500 text-center px-8 mt-2">
                Contact support if you believe this is an error
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

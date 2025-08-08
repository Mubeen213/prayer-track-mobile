import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react-native";
import { useMosque } from "../../../../hooks/useMosques";
import { useMosqueEvents, useDeleteEvent } from "../../../../hooks/useEvents";
import { Event } from "../../../../types/event";

export default function ManageEventsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: mosque } = useMosque(id || "");
  const {
    data: events,
    isLoading,
    refetch,
    isRefetching,
  } = useMosqueEvents(id || "", true);
  const deleteEventMutation = useDeleteEvent();

  const handleAddEvent = () => {
    router.push(`/admin/mosque/${id}/events/create` as any);
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/admin/mosque/${id}/events/${eventId}/edit` as any);
  };

  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteEventMutation.mutate(event.id, {
              onSuccess: () => refetch(),
            });
          },
        },
      ]
    );
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-semibold text-gray-900 flex-1 mr-2">
          {item.title}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleEditEvent(item.id)}
            className="p-2 rounded-lg bg-blue-100"
          >
            <Edit size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteEvent(item)}
            className="p-2 rounded-lg bg-red-100"
            disabled={deleteEventMutation.isPending}
          >
            <Trash2 size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {item.scholar && (
        <Text className="text-sm text-gray-600 mb-2">
          Speaker: {item.scholar}
        </Text>
      )}

      <View className="flex-row items-center gap-4 mb-2">
        <View className="flex-row items-center">
          <Calendar size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">{item.event_date}</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">{item.event_time}</Text>
        </View>
      </View>

      {item.description && (
        <Text className="text-sm text-gray-600" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading events...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-lg bg-gray-100"
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900">
                Manage Events
              </Text>
              <Text className="text-sm text-gray-600">{mosque?.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddEvent}
            className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Add Event</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      <FlatList
        data={events || []}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
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
            <Calendar size={48} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 mb-2 mt-4">
              No events scheduled
            </Text>
            <Text className="text-sm text-gray-600 text-center px-8 mb-4">
              Create your first event to get started
            </Text>
            <TouchableOpacity
              onPress={handleAddEvent}
              className="bg-green-500 rounded-lg px-6 py-3 flex-row items-center"
            >
              <Plus size={16} color="white" />
              <Text className="text-white font-medium ml-2">
                Add First Event
              </Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

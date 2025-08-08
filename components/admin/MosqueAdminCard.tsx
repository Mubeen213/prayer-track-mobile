import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, Clock, Calendar, Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mosque } from "../../types/mosque";
import { router } from "expo-router";

interface AdminMosqueCardProps {
  mosque: Mosque;
}

export const AdminMosqueCard: React.FC<AdminMosqueCardProps> = ({ mosque }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "unverified":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateTimings = () => {
    router.push(`/admin/mosque/${mosque.id}/timings` as any);
  };

  const handleManageEvents = () => {
    router.push(`/admin/mosque/${mosque.id}/events` as any);
  };

  const handleViewDetails = () => {
    router.push(`/mosque/${mosque.id}`);
  };

  const getLastUpdated = () => {
    if (!mosque.last_timings_update) return "Never updated";
    const date = new Date(mosque.last_timings_update);
    return `Last Updated ${date.toLocaleDateString()}`;
  };

  return (
    <View className="bg-white rounded-xl p-4 mx-4 my-2 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-lg mb-1">
            {mosque.name}
          </Text>
          <View className="flex-row items-center mb-2">
            <MapPin size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1" numberOfLines={2}>
              {mosque.address}
            </Text>
          </View>
          <Text className="text-sm text-gray-500">
            {mosque.city}, {mosque.state}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(mosque.status)}`}
        >
          <Text className="text-xs font-medium capitalize">
            {mosque.status}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-500">{getLastUpdated()}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="space-y-2">
        {/* Primary Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleUpdateTimings}
            className="flex-1 bg-blue-500 rounded-lg py-3 flex-row items-center justify-center"
          >
            <Clock size={16} color="white" />
            <Text className="text-white font-medium ml-2">Update Timings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleManageEvents}
            className="flex-1 bg-green-500 rounded-lg py-3 flex-row items-center justify-center"
          >
            <Calendar size={16} color="white" />
            <Text className="text-white font-medium ml-2">Manage Events</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Action */}
        <TouchableOpacity
          onPress={handleViewDetails}
          className="bg-gray-100 rounded-lg py-2 flex-row items-center justify-center"
        >
          <Settings size={16} color="#6B7280" />
          <Text className="text-gray-600 font-medium ml-2">
            View Public Page
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

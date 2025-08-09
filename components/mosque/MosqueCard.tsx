import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Mosque } from "../../types/mosque";
import { CheckCircle, Landmark, MapPin, Bookmark } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ClaimMosqueModal } from "./ClaimMosqueModal";
import { openMaps } from "../../utils/mapLinking";

interface MosqueCardProps {
  mosque: Mosque;
  onPress?: (mosque: Mosque) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (mosqueId: string) => void;
}

export const MosqueCard: React.FC<MosqueCardProps> = ({
  mosque,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const nextPrayer = mosque.prayer_timings.find((prayer) => {
      const [hours, minutes] = prayer.jamaat_time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;
      return prayerTime > currentTime;
    });

    return nextPrayer || mosque.prayer_timings[0];
  };

  const nextPrayer = getNextPrayer();

  return (
    <>
      <TouchableOpacity
        className="bg-white rounded-2xl p-6 mx-4 my-2 shadow-sm border border-gray-100"
        onPress={() => onPress?.(mosque)}
        activeOpacity={0.7}
      >
        {/* Verified Badge */}
        {mosque.status === "active" && (
          <View className="absolute right-0 top-0 z-10 flex-row items-center bg-green-500 rounded-bl-lg px-3 py-1.5">
            <CheckCircle size={14} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              Verified
            </Text>
          </View>
        )}

        {mosque.status === "unverified" && (
          <TouchableOpacity
            onPress={() => setShowClaimModal(true)}
            className="absolute right-0 top-0 z-10 flex-row items-center bg-orange-500 rounded-bl-lg px-3 py-1.5"
            activeOpacity={0.8}
          >
            {/* <CheckCircle size={14} color="white" /> */}
            <Text className="text-white text-xs font-medium ml-1">
              Claim Now
            </Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View className="flex-row items-start mb-4 mr-16">
          <View className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 mr-4">
            <LinearGradient
              colors={["#22c55e", "#059669"]}
              start={[0, 0]}
              end={[1, 1]}
              className="rounded-full p-2"
            >
              <Landmark size={20} color="white" />
            </LinearGradient>
          </View>

          <View className="flex-1">
            <Text
              className="text-lg font-semibold text-gray-900 mb-1"
              numberOfLines={2}
            >
              {mosque.name}
            </Text>

            <View className="flex-row items-start">
              <MapPin size={16} color="#10B981" className="mt-0.5 mr-1.5" />
              <Text className="text-sm text-gray-600 flex-1" numberOfLines={2}>
                {mosque.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-gray-600 font-bold mr-2">
                  Next Prayer
                </Text>
                <Text className="text-green-700 font-medium capitalize mr-1">
                  {nextPrayer.prayer_name}
                </Text>
                <Text className="text-gray-600 mr-1">at</Text>
                <Text className="text-green-900 font-bold">
                  {nextPrayer.jamaat_time}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 rounded-lg overflow-hidden">
            <LinearGradient colors={["#22c55e", "#059669"]}>
              <Text className="text-white text-center py-2 font-medium">
                View Details
              </Text>
            </LinearGradient>
          </View>

          <TouchableOpacity
            className="rounded-lg p-2 mr-2"
            onPress={() => onToggleFavorite?.(mosque.id)}
          >
            <Bookmark
              size={20}
              color={isFavorite ? "#10B981" : "#9CA3AF"}
              fill={isFavorite ? "#10B981" : "none"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg p-2"
            onPress={() => openMaps(mosque.latitude, mosque.longitude)}
          >
            <MapPin size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Claim Modal */}
      <ClaimMosqueModal
        visible={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        mosqueId={mosque.id}
        mosqueName={mosque.name}
      />
    </>
  );
};

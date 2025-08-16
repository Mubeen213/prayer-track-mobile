import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle, MapPin, Bookmark, Clock } from "lucide-react-native";

import { Mosque } from "../../types/mosque";
import { ClaimMosqueModal } from "./ClaimMosqueModal";
import { openMaps } from "../../utils/mapLinking";
import { convert24to12 } from "../../utils/timeConversions";

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
        className="bg-white rounded-2xl p-4 mx-4 my-2 shadow-sm border border-gray-100"
        onPress={() => onPress?.(mosque)}
        activeOpacity={0.7}
      >
        {/* Status Badge - Fixed curves to match card radius */}
        {mosque.status === "active" && (
          <View className="absolute right-0 top-0 z-10 flex-row items-center bg-green-500 rounded-bl-2xl rounded-tr-2xl px-3 py-2">
            <CheckCircle size={14} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              Verified
            </Text>
          </View>
        )}

        {mosque.status === "unverified" && (
          <TouchableOpacity
            onPress={() => setShowClaimModal(true)}
            className="absolute right-0 top-0 z-10 flex-row items-center bg-orange-500 rounded-bl-2xl rounded-tr-2xl px-3 py-2"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xs font-medium">Claim Now</Text>
          </TouchableOpacity>
        )}

        {/* Header - Removed problematic icon, kept clean design */}
        <View className="flex-row items-start mb-4 pr-20">
          <View className="flex-1">
            <Text
              className="text-lg font-semibold text-gray-900 mb-2"
              numberOfLines={2}
            >
              {mosque.name}
            </Text>

            <View className="flex-row items-start">
              <MapPin size={16} color="#10B981" className="mt-0.5 mr-2" />
              <Text className="text-sm text-gray-600 flex-1" numberOfLines={2}>
                {mosque.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Next Prayer Section */}
        {nextPrayer && (
          <LinearGradient
            colors={["#f0fdf4", "#ecfdf5"]} // Example hex codes for the from-green-50 to-emerald-50 gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 16, // Equivalent to p-4
              borderRadius: 12, // Equivalent to rounded-xl
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontWeight: "600", fontSize: 16, color: "#4b5563" }}
              >
                Next Prayer
              </Text>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  textTransform: "capitalize",
                  color: "#047857",
                  marginLeft: 8,
                }}
              >
                {nextPrayer.prayer_name}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4b5563",
                  marginLeft: 4,
                  marginRight: 4,
                }}
              >
                at
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, color: "#064e3b" }}
              >
                {convert24to12(nextPrayer.jamaat_time)}
              </Text>
            </View>
          </LinearGradient>
        )}

        {/* Action Buttons - Fixed spacing and consistency */}
        <View className="flex-row items-center">
          <View className="flex-1 rounded-lg overflow-hidden mr-3">
            <LinearGradient colors={["#22c55e", "#059669"]}>
              <Text className="text-white text-center py-3 font-medium">
                View Details
              </Text>
            </LinearGradient>
          </View>

          <TouchableOpacity
            className="rounded-lg p-3  mr-3"
            onPress={() => onToggleFavorite?.(mosque.id)}
          >
            <Bookmark
              size={20}
              color={isFavorite ? "#10B981" : "#9CA3AF"}
              fill={isFavorite ? "#10B981" : "none"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg p-3"
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

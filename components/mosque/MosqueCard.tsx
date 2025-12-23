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
export const MosqueCard = React.memo<MosqueCardProps>(
  ({ mosque, isFavorite, onToggleFavorite, onPress }) => {
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
          className="mx-4 my-2"
          onPress={() => onPress?.(mosque)}
          activeOpacity={0.95}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <LinearGradient
            colors={["#ffffff", "#fafafa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Status Badge */}
            {mosque.status === "active" && (
              <View className="absolute right-0 top-0 z-10 overflow-hidden rounded-bl-2xl rounded-tr-[20px]">
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <CheckCircle size={14} color="white" />
                  <Text className="text-white text-xs font-semibold ml-1.5">
                    Verified
                  </Text>
                </LinearGradient>
              </View>
            )}

            {mosque.status === "unverified" && (
              <TouchableOpacity
                onPress={() => setShowClaimModal(true)}
                className="absolute right-0 top-0 z-10 overflow-hidden rounded-bl-2xl rounded-tr-[20px]"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f97316", "#ea580c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text className="text-white text-xs font-semibold">
                    Claim Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Header Section */}
            <View className="mb-4 pr-24">
              <Text
                className="text-xl font-bold text-gray-900 mb-3 leading-6"
                numberOfLines={2}
                style={{ letterSpacing: -0.3 }}
              >
                {mosque.name}
              </Text>

              <View className="flex-row items-start">
                <View
                  className="rounded-full p-1.5 mr-2 mt-0.5"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                >
                  <MapPin size={14} color="#10B981" strokeWidth={2.5} />
                </View>
                <Text
                  className="text-sm text-gray-600 flex-1 leading-5"
                  numberOfLines={2}
                >
                  {mosque.address}
                </Text>
              </View>
            </View>

            {/* Next Prayer Section - Enhanced Design */}
            {nextPrayer && (
              <View className="mb-5">
                <LinearGradient
                  colors={["#ecfdf5", "#d1fae5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <View className="flex-row items-center mb-1">
                    <Clock size={16} color="#059669" strokeWidth={2.5} />
                    <Text className="text-xs font-semibold text-emerald-700 ml-1.5 uppercase tracking-wide">
                      Next Prayer
                    </Text>
                  </View>
                  <View className="flex-row items-baseline mt-1">
                    <Text
                      className="text-2xl font-bold text-emerald-900 capitalize"
                      style={{ letterSpacing: -0.5 }}
                    >
                      {nextPrayer.prayer_name}
                    </Text>
                    <Text className="text-base text-emerald-700 mx-2 font-medium">
                      at
                    </Text>
                    <Text
                      className="text-2xl font-bold text-emerald-900"
                      style={{ letterSpacing: -0.5 }}
                    >
                      {convert24to12(nextPrayer.jamaat_time)}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Action Buttons - Premium Design */}
            <View className="flex-row items-center gap-3">
              <View className="flex-1 rounded-xl overflow-hidden">
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 14,
                    shadowColor: "#10b981",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text className="text-white text-center font-bold text-base">
                    View Details
                  </Text>
                </LinearGradient>
              </View>

              <TouchableOpacity
                className="rounded-xl p-3.5"
                onPress={() => onToggleFavorite?.(mosque.id)}
                style={{
                  backgroundColor: isFavorite
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(156, 163, 175, 0.1)",
                  borderWidth: 1,
                  borderColor: isFavorite
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(156, 163, 175, 0.2)",
                }}
              >
                <Bookmark
                  size={22}
                  color={isFavorite ? "#10B981" : "#6B7280"}
                  fill={isFavorite ? "#10B981" : "none"}
                  strokeWidth={2}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl p-3.5"
                onPress={() => openMaps(mosque.latitude, mosque.longitude)}
                style={{
                  backgroundColor: "rgba(156, 163, 175, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(156, 163, 175, 0.2)",
                }}
              >
                <MapPin size={22} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.mosque.id === nextProps.mosque.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.onToggleFavorite === nextProps.onToggleFavorite &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

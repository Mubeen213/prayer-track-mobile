import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MosqueDetailSkeleton } from "../skeleton/MosqueDetailSkeleton";
import { useMosque } from "../../hooks/useMosques";
import {
  useFavoritesMutation,
  useGetFavoritesStatus,
} from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";
import { MosqueTimings } from "./MosqueTimings";
import { MosqueEvents } from "./MosqueEvents";
import { Bookmark, ChevronLeft } from "lucide-react-native";

export const MosqueDetails = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState<"timings" | "events">("timings");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: mosque, isLoading: isLoadingMosque } = useMosque(id || "");

  const { data: favoritesData, isLoading: isFavoritesLoading } =
    useGetFavoritesStatus(userId) as {
      data: Record<string, boolean> | undefined;
      isLoading: boolean;
    };
  const favoriteMutation = useFavoritesMutation(userId);

  let isFavorite = favoritesData ? !!favoritesData[id || ""] : false;

  const handleToggleFavorite = useCallback(
    (mosqueId: string) => {
      if (!userId) {
        console.log("User not logged in, cannot toggle favorite");
        return;
      }
      favoriteMutation.mutate(mosqueId);
    },
    [userId, favoriteMutation]
  );

  const handleGoBack = () => {
    router.push("/mosque");
  };

  if (isLoadingMosque) {
    return <MosqueDetailSkeleton />;
  }

  if (!mosque) return null;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header */}
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center relative mb-2">
              <TouchableOpacity
                onPress={handleGoBack}
                className="p-2 -ml-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={24} color="#374151" strokeWidth={1.5} />
              </TouchableOpacity>
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-gray-900">
                  {mosque.name}
                </Text>
              </View>
              <TouchableOpacity
                className="rounded-lg p-2"
                onPress={() => handleToggleFavorite(mosque.id)}
              >
                <Bookmark
                  className="h-5 w-5"
                  color={isFavorite ? "#22c55e" : "#9ca3af"}
                  fill={isFavorite ? "#22c55e" : "none"}
                />
              </TouchableOpacity>
            </View>
            <View className="items-center space-y-1">
              <Text className="text-sm text-gray-500">{mosque.address}</Text>
              {mosque.landmark && (
                <Text className="text-sm text-gray-500">{mosque.landmark}</Text>
              )}
              <Text className="text-sm text-gray-500">
                {mosque.city}, {mosque.state}
              </Text>
            </View>
          </View>

          {/* Tab Buttons */}
          <View className="px-4 pt-4 mb-6">
            <View className="flex-row gap-4">
              {["timings", "events"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab as "timings" | "events")}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    activeTab === tab ? "bg-green-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium text-center ${
                      activeTab === tab ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tab Content */}
          <View className="px-4 pb-4">
            {activeTab === "timings" ? (
              <MosqueTimings mosque={mosque} />
            ) : (
              <MosqueEvents
                mosqueId={id || ""}
                isVisible={activeTab === "events"}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

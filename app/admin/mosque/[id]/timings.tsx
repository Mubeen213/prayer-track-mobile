import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Save, Clock, Sun, Sunset, Moon } from "lucide-react-native";
import { useMosque } from "../../../../hooks/useMosques";
import { useUpdateTimings } from "../../../../hooks/useUpdateTimings";
import { PrayerTime } from "../../../../types/mosque";
import { TimePickerInput } from "../../../../components/ui/TimePickerInput";

const getPrayerConfig = (prayerName: string) => {
  switch (prayerName) {
    case "fajr":
      return {
        icon: <Moon size={20} color="#1E40AF" />,
        theme: "bg-blue-50 border-blue-200",
        color: "#1E40AF",
      };
    case "dhuhr":
      return {
        icon: <Sun size={20} color="#F59E0B" />,
        theme: "bg-yellow-50 border-yellow-200",
        color: "#F59E0B",
      };
    case "asr":
      return {
        icon: <Sun size={20} color="#F97316" />,
        theme: "bg-orange-50 border-orange-200",
        color: "#F97316",
      };
    case "maghrib":
      return {
        icon: <Sunset size={20} color="#DC2626" />,
        theme: "bg-red-50 border-red-200",
        color: "#DC2626",
      };
    case "isha":
      return {
        icon: <Moon size={20} color="#7C3AED" />,
        theme: "bg-purple-50 border-purple-200",
        color: "#7C3AED",
      };
    case "juma":
      return {
        icon: <Sun size={20} color="#10B981" />,
        theme: "bg-green-50 border-green-200",
        color: "#10B981",
      };
    default:
      return {
        icon: <Clock size={20} color="#6B7280" />,
        theme: "bg-gray-50 border-gray-200",
        color: "#6B7280",
      };
  }
};

export default function UpdateTimingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: mosque, isLoading } = useMosque(id || "");
  const { mutate: updateTimings, isPending } = useUpdateTimings(id || "");

  const [timings, setTimings] = useState<PrayerTime[]>([]);

  useEffect(() => {
    if (mosque?.prayer_timings) {
      // Convert to HH:MM format (remove seconds)
      const formattedTimings = mosque.prayer_timings.map((timing) => ({
        ...timing,
        adhan_time: timing.adhan_time.slice(0, 5),
        jamaat_time: timing.jamaat_time.slice(0, 5),
      }));
      setTimings(formattedTimings);
    }
  }, [mosque]);

  const handleTimeChange = (
    prayerIndex: number,
    type: keyof Pick<PrayerTime, "adhan_time" | "jamaat_time">,
    value: string
  ) => {
    setTimings((prev) =>
      prev.map((timing, index) =>
        index === prayerIndex ? { ...timing, [type]: value } : timing
      )
    );
  };

  const handleSubmit = () => {
    // Add seconds back for API
    const updatedTimings = timings.map((timing) => ({
      ...timing,
      adhan_time: `${timing.adhan_time}:00`,
      jamaat_time: `${timing.jamaat_time}:00`,
    }));

    updateTimings(updatedTimings, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading mosque details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 mb-20">
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
                Update Prayer Timings
              </Text>
              <Text className="text-sm text-gray-600">{mosque?.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Save size={16} color="white" />
                <Text className="text-white font-medium ml-1">Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-blue-50 rounded-lg p-4 mb-4">
          <Text className="text-blue-800 font-medium mb-1">
            Prayer Time Management
          </Text>
          <Text className="text-blue-600 text-sm">
            Update the prayer times for your mosque.
          </Text>
        </View>

        <View className="space-y-3">
          {timings.map((timing, index) => {
            const config = getPrayerConfig(timing.prayer_name);
            const isMaghrib = timing.prayer_name === "maghrib";

            return (
              <View
                key={timing.prayer_name}
                className={`rounded-lg p-4 border ${config.theme} shadow-sm`}
              >
                <View className="flex-row items-center gap-2 mb-3">
                  {config.icon}
                  <Text className="font-semibold text-gray-800 text-lg capitalize">
                    {timing.prayer_name}
                  </Text>
                  {timing.prayer_name === "juma" && (
                    <View className="bg-green-100 px-2 py-1 rounded ml-auto">
                      <Text className="text-xs text-green-700">
                        Friday Only
                      </Text>
                    </View>
                  )}
                </View>

                {isMaghrib ? (
                  <View className="bg-orange-50 rounded-lg p-3">
                    <Text className="text-orange-800 text-sm font-medium">
                      Sunset Prayer Time
                    </Text>
                    <Text className="text-orange-600 text-xs mt-1">
                      Maghrib times are automatically calculated based on sunset
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Adhan Time
                      </Text>
                      <TimePickerInput
                        value={timing.adhan_time}
                        onChange={(value) =>
                          handleTimeChange(index, "adhan_time", value)
                        }
                        placeholder="05:30"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Jamaat Time
                      </Text>
                      <TimePickerInput
                        value={timing.jamaat_time}
                        onChange={(value) =>
                          handleTimeChange(index, "jamaat_time", value)
                        }
                        placeholder="05:45"
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Submit Button (Mobile version) */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isPending}
          className="w-full py-4 bg-green-600 rounded-lg mt-6 mb-8"
        >
          <Text className="text-white font-medium text-center text-lg">
            {isPending ? "Updating..." : "Update Prayer Times"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

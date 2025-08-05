import React from "react";
import { View, Text } from "react-native";
import { Mosque, PrayerTime } from "../../types/mosque";
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Star,
  Calendar,
} from "lucide-react-native";

interface MosqueTimingsProps {
  mosque: Mosque;
}

type PrayerConfig = {
  icon: React.ReactElement;
  theme: string;
  dayOnly?: string;
};

const prayerOrder = ["fajr", "dhuhr", "asr", "maghrib", "isha", "juma"];

const getPrayerConfig = (prayerName: string): PrayerConfig => {
  const configs = {
    fajr: {
      icon: <Sunrise className="w-5 h-5 text-blue-600" />,
      theme: "bg-blue-50 border border-blue-100",
    },
    dhuhr: {
      icon: <Sun className="w-5 h-5 text-yellow-600" />,
      theme: "bg-yellow-50 border border-yellow-100",
    },
    asr: {
      icon: <Sun className="w-5 h-5 text-orange-600" />,
      theme: "bg-orange-50 border border-orange-100",
    },
    maghrib: {
      icon: <Sunset className="w-5 h-5 text-red-600" />,
      theme: "bg-red-50 border border-red-100",
    },
    isha: {
      icon: <Moon className="w-5 h-5 text-purple-600" />,
      theme: "bg-purple-50 border border-purple-100",
    },
    juma: {
      icon: <Calendar className="w-5 h-5 text-green-600" />,
      theme: "bg-green-50 border border-green-100",
      dayOnly: "Friday Only",
    },
  };
  return configs[prayerName as keyof typeof configs] || configs.fajr;
};

const convert24to12 = (time24: string): string => {
  const [hour, minute] = time24.split(":");
  const hour12 = parseInt(hour) % 12 || 12;
  const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${ampm}`;
};

export const MosqueTimings = ({ mosque }: MosqueTimingsProps) => {
  const sortedPrayers = [...mosque.prayer_timings].sort(
    (a, b) =>
      prayerOrder.indexOf(a.prayer_name) - prayerOrder.indexOf(b.prayer_name)
  );

  return (
    <View className="">
      {sortedPrayers.map((prayer: PrayerTime) => {
        const config = getPrayerConfig(prayer.prayer_name);

        // Special case for Maghrib
        if (prayer.prayer_name === "maghrib") {
          return (
            <View
              key={prayer.prayer_name}
              className={`rounded-lg p-4 mb-4 ${config.theme}`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  {config.icon}
                  <Text className="font-semibold text-gray-800 capitalize">
                    Maghrib
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-gray-600">Sunset time</Text>
            </View>
          );
        }

        return (
          <View
            key={prayer.prayer_name}
            className={`rounded-lg p-4 mb-4 ${config.theme}`}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                {config.icon}
                <Text className="font-semibold text-gray-800 capitalize">
                  {prayer.prayer_name}
                </Text>
              </View>
              {config.dayOnly && (
                <View className="bg-green-100 px-2 py-1 rounded">
                  <Text className="text-xs text-green-700">
                    {config.dayOnly}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Adhan</Text>
                <Text className="font-semibold text-gray-800">
                  {convert24to12(prayer.adhan_time)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Jamaat</Text>
                <Text className="font-semibold text-green-600">
                  {convert24to12(prayer.jamaat_time)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

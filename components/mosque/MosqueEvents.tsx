import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Clock, Share2, User, Calendar } from "lucide-react-native";
import { useMosqueEvents } from "../../hooks/useEvents";
import { Event } from "../../types/event";

interface MosqueEventsProps {
  mosqueId: string;
  isVisible: boolean;
}

const convert24to12 = (time24: string): string => {
  const [hour, minute] = time24.split(":");
  const hour12 = parseInt(hour) % 12 || 12;
  const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${ampm}`;
};

export const MosqueEvents = ({ mosqueId, isVisible }: MosqueEventsProps) => {
  const { data: events, isLoading } = useMosqueEvents(mosqueId, isVisible);

  const handleShare = async (eventId: string) => {
    try {
      Alert.alert("Share Event", `Event ID: ${eventId}`, [
        { text: "OK", onPress: () => console.log("Event shared") },
      ]);
    } catch (err) {
      console.error(`Error occurred while sharing ${err}`);
      Alert.alert("Error", "Failed to share event");
    }
  };

  if (isLoading) {
    return (
      <View className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <View key={i} className="h-24 bg-gray-200 rounded-xl mb-4" />
        ))}
      </View>
    );
  }

  if (!events?.length) {
    return (
      <View className="py-12 bg-gray-50 rounded-xl items-center">
        <Calendar size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-sm text-center">
          No upcoming events scheduled
        </Text>
        <Text className="text-gray-400 text-sm mt-1 text-center">
          Check back later for updates
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {events.map((event: Event) => (
        <View
          key={event.id}
          className="rounded-xl bg-slate-50 p-4 border border-gray-100 mb-4"
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1 space-y-3">
              {/* Event Header */}
              <View>
                <View className="bg-emerald-500 px-3 py-1 rounded-full self-start">
                  <Text className="text-white text-xs font-medium">
                    Featured Event
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-900 mt-2">
                  {event.title}
                </Text>
              </View>

              {/* Event Details */}
              <View className="space-y-2">
                {event?.scholar && (
                  <View className="flex-row items-center gap-2">
                    <View className="p-1.5 rounded-lg bg-emerald-100">
                      <User size={16} color="#059669" />
                    </View>
                    <Text className="text-sm text-gray-700">
                      Speaker: {event.scholar}
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center gap-2">
                  <View className="p-1.5 rounded-lg bg-emerald-100">
                    <Clock size={16} color="#059669" />
                  </View>
                  <Text className="text-sm text-gray-700">
                    {event.event_date} at {convert24to12(event.event_time)}
                  </Text>
                </View>
              </View>

              {/* Description */}
              {event.description && (
                <View className="bg-white rounded-lg p-3 border border-gray-100">
                  <Text className="text-sm text-gray-600 leading-5">
                    {event.description}
                  </Text>
                </View>
              )}
            </View>

            {/* Share Button */}
            <TouchableOpacity
              onPress={() => handleShare(event.id)}
              className="p-2 rounded-lg bg-white border border-gray-200 ml-3"
            >
              <Share2 size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

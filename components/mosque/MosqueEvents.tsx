import React from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import {
  Clock,
  Share2,
  User,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react-native";
import { useMosqueEvents } from "../../hooks/useEvents";
import { Event } from "../../types/event";
import { convert24to12 } from "../../utils/timeConversions";
import { handleShare } from "../../utils/eventSharing";

interface MosqueEventsProps {
  mosqueId: string;
  mosqueName: string;
  isVisible: boolean;
}

const formatEventDate = (
  dateString: string
): { day: string; month: string; year: string } => {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    year: date.getFullYear().toString(),
  };
};

const isEventToday = (dateString: string): boolean => {
  const eventDate = new Date(dateString);
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
};

const isEventTomorrow = (dateString: string): boolean => {
  const eventDate = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return eventDate.toDateString() === tomorrow.toDateString();
};

const getEventTimeLabel = (dateString: string): string => {
  if (isEventToday(dateString)) return "Today";
  if (isEventTomorrow(dateString)) return "Tomorrow";

  const eventDate = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil(
    (eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  if (diffDays <= 7) {
    return eventDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  return eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const MosqueEvents = ({
  mosqueId,
  mosqueName,
  isVisible,
}: MosqueEventsProps) => {
  const { data: events, isLoading } = useMosqueEvents(mosqueId, isVisible);

  if (isLoading) {
    return (
      <View className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <View className="flex-row">
              <View className="w-16 h-16 bg-gray-200 rounded-xl mr-4" />
              <View className="flex-1 justify-center space-y-2">
                <View className="h-4 bg-gray-200 rounded-md w-4/5" />
                <View className="h-3 bg-gray-200 rounded-md w-1/2" />
                <View className="h-3 bg-gray-200 rounded-md w-2/3" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (!events?.length) {
    return (
      <View className="py-16 items-center">
        <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
          <Calendar size={28} color="#9CA3AF" />
        </View>
        <Text className="text-gray-900 font-semibold text-lg mb-2 text-center">
          No Events Scheduled
        </Text>
        <Text className="text-gray-500 text-sm text-center px-8">
          This mosque hasn't scheduled any upcoming events yet. Check back later
          for updates.
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {events.map((event: Event, index: number) => {
        const dateInfo = formatEventDate(event.event_date);
        const timeLabel = getEventTimeLabel(event.event_date);
        const isUpcoming =
          isEventToday(event.event_date) || isEventTomorrow(event.event_date);
        const cardBgColor = isUpcoming ? "bg-white" : "bg-gray-50";

        return (
          <TouchableOpacity
            key={event.id}
            className={`rounded-2xl border border-gray-100 overflow-hidden shadow-sm ${cardBgColor}`}
            activeOpacity={0.8}
          >
            <View className="p-5 flex-row">
              {/* Left Date Section */}
              <View
                className={`w-16 h-16 rounded-xl items-center justify-center mr-4 ${
                  isUpcoming ? "bg-green-600" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isUpcoming ? "text-white" : "text-gray-500"
                  }`}
                >
                  {dateInfo.month}
                </Text>
                <Text
                  className={`text-lg font-bold ${
                    isUpcoming ? "text-white" : "text-gray-900"
                  }`}
                >
                  {dateInfo.day}
                </Text>
              </View>

              {/* Right Content Section */}
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-shrink">
                    <Text className="text-lg font-bold text-gray-900 leading-tight mb-1">
                      {event.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleShare(event, mosqueId, mosqueName)}
                    className="p-2 rounded-lg bg-gray-50 ml-2"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Share2 size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-1">
                  <Clock size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2 font-medium">
                    {timeLabel} • {convert24to12(event.event_time)}
                  </Text>
                </View>

                {event.scholar && (
                  <View className="flex-row items-center mb-1">
                    <User size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {event.scholar}
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center">
                  <MapPin size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">
                    {mosqueName}
                  </Text>
                </View>

                {event.description && (
                  <Text
                    className="text-sm text-gray-600 mt-3 leading-5"
                    numberOfLines={2}
                  >
                    {event.description}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

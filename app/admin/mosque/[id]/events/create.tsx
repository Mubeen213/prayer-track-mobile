import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMosque } from "../../../../../hooks/useMosques";
import { useCreateEvent } from "../../../../../hooks/useEvents";

export default function CreateEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: mosque } = useMosque(id || "");
  const { mutate: createEvent, isPending } = useCreateEvent();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scholar: "",
    event_date: "",
    event_time: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0].slice(0, 5);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        event_date: formatDate(date),
      }));
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (time) {
      setSelectedTime(time);
      setFormData((prev) => ({
        ...prev,
        event_time: formatTime(time),
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Event title is required");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Event description is required");
      return;
    }
    if (!formData.event_date) {
      Alert.alert("Error", "Event date is required");
      return;
    }
    if (!formData.event_time) {
      Alert.alert("Error", "Event time is required");
      return;
    }

    createEvent(
      {
        ...formData,
        mosque_id: id || "",
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          Alert.alert("Error", "Failed to create event");
        },
      }
    );
  };

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
                Create Event
              </Text>
              <Text className="text-sm text-gray-600">{mosque?.name}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-green-50 rounded-lg p-4 mb-6">
          <Text className="text-green-800 font-medium mb-1">
            New Event Creation
          </Text>
          <Text className="text-green-600 text-sm">
            Fill in the details below to create a new event for your mosque.
          </Text>
        </View>

        {/* Event Title */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <FileText size={16} color="#374151" />
            <Text className="text-gray-700 font-medium ml-2">
              Event Title *
            </Text>
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Enter event title"
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Scholar Name */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <User size={16} color="#374151" />
            <Text className="text-gray-700 font-medium ml-2">Scholar Name</Text>
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Enter scholar name (optional)"
            value={formData.scholar}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, scholar: text }))
            }
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <FileText size={16} color="#374151" />
            <Text className="text-gray-700 font-medium ml-2">
              Description *
            </Text>
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Enter event description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Date and Time */}
        <View className="flex-row gap-4 mb-6">
          {/* Date Picker */}
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Date *</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <Text
                className={
                  formData.event_date ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.event_date || "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker */}
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Time *</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <Text
                className={
                  formData.event_time ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.event_time || "Select time"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isPending}
          className="w-full py-4 bg-green-600 rounded-lg mb-8"
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium text-center text-lg">
              Create Event
            </Text>
          )}
        </TouchableOpacity>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>
    </View>
  );
}

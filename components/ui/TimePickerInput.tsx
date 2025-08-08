import React, { useState } from "react";
import { TouchableOpacity, Text, View, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Clock } from "lucide-react-native";

interface TimePickerInputProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChange,
  placeholder = "Select time",
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const getDateFromTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
    date.setSeconds(0);
    return date;
  };

  // Convert Date object to HH:MM string
  const getTimeFromDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate) {
      const timeString = getTimeFromDate(selectedDate);
      onChange(timeString);
    }
  };

  const handlePress = () => {
    setShowPicker(true);
  };

  const displayValue = value || placeholder;
  const currentDate = value ? getDateFromTime(value) : new Date();

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="bg-gray-50 rounded-lg px-3 py-3 border border-gray-200 flex-row items-center justify-between"
      >
        <Text className={`${value ? "text-gray-900" : "text-gray-500"}`}>
          {displayValue}
        </Text>
        <Clock size={16} color="#6B7280" />
      </TouchableOpacity>

      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            <Modal
              transparent
              visible={showPicker}
              animationType="slide"
              onRequestClose={() => setShowPicker(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "flex-end",
                }}
              >
                <View className="bg-white rounded-t-3xl">
                  <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text className="text-red-500 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="font-semibold text-gray-900">
                      Select Time
                    </Text>
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text className="text-blue-500 font-medium">Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={currentDate}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                    style={{ backgroundColor: "white" }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={currentDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </>
      )}
    </>
  );
};

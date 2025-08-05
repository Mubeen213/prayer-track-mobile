import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, User, Phone, MessageSquare } from "lucide-react-native";
import { useCreateClaimRequest } from "../../hooks/useClaim";

interface ClaimMosqueModalProps {
  visible: boolean;
  onClose: () => void;
  mosqueId: string;
  mosqueName: string;
}

const { height: screenHeight } = Dimensions.get("window");

export const ClaimMosqueModal: React.FC<ClaimMosqueModalProps> = ({
  visible,
  onClose,
  mosqueId,
  mosqueName,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    message: "",
  });

  const createClaimMutation = useCreateClaimRequest();

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone_number.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.phone_number.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    createClaimMutation.mutate(
      {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        mosque_id: mosqueId,
        message: formData.message.trim() || undefined,
      },
      {
        onSuccess: () => {
          setFormData({ name: "", phone_number: "", message: "" });
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!createClaimMutation.isPending) {
      setFormData({ name: "", phone_number: "", message: "" });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: screenHeight * 0.9,
              minHeight: screenHeight * 0.6,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Claim Mosque
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="p-2 rounded-full bg-gray-100"
                disabled={createClaimMutation.isPending}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="p-6">
                {/* Mosque Info */}
                <View className="bg-green-50 rounded-xl p-4 mb-6">
                  <Text className="font-semibold text-green-800 mb-1">
                    Claiming: {mosqueName}
                  </Text>
                  <Text className="text-sm text-green-600">
                    Please ensure you are authorized to manage this mosque
                  </Text>
                </View>

                {/* Warning Messages */}
                <View className="bg-yellow-50 rounded-xl p-4 mb-6">
                  <Text className="font-semibold text-yellow-800 mb-2">
                    Important Notice
                  </Text>
                  <Text className="text-sm text-yellow-700 mb-3">
                    Please submit this claim only if you are the maintainer of
                    this mosque or ask the maintainer to claim this mosque.
                  </Text>
                  <Text
                    className="text-sm text-yellow-700 text-right"
                    style={{ fontFamily: "System" }}
                  >
                    یہ دعویٰ صرف اسی وقت جمع کریں جب آپ اس مسجد کے منتظم ہوں یا
                    منتظم سے کہیں کہ وہ اس مسجد کا دعویٰ کرے۔
                  </Text>
                </View>

                {/* Form Fields */}
                <View className="space-y-4">
                  {/* Name Field */}
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
                      <View className="p-3">
                        <User size={20} color="#6B7280" />
                      </View>
                      <TextInput
                        className="flex-1 p-3 text-gray-900"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, name: text }))
                        }
                        editable={!createClaimMutation.isPending}
                      />
                    </View>
                  </View>

                  {/* Phone Field */}
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
                      <View className="p-3">
                        <Phone size={20} color="#6B7280" />
                      </View>
                      <TextInput
                        className="flex-1 p-3 text-gray-900"
                        placeholder="Enter phone number"
                        value={formData.phone_number}
                        onChangeText={(text) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone_number: text,
                          }))
                        }
                        keyboardType="phone-pad"
                        editable={!createClaimMutation.isPending}
                      />
                    </View>
                  </View>

                  {/* Message Field */}
                  <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Additional Message (Optional)
                    </Text>
                    <View className="flex-row items-start bg-gray-50 rounded-lg border border-gray-200">
                      <View className="p-3 pt-4">
                        <MessageSquare size={20} color="#6B7280" />
                      </View>
                      <TextInput
                        className="flex-1 p-3 text-gray-900"
                        placeholder="Any additional information..."
                        value={formData.message}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, message: text }))
                        }
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        editable={!createClaimMutation.isPending}
                        style={{ minHeight: 80 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={createClaimMutation.isPending}
                  style={{
                    backgroundColor: createClaimMutation.isPending
                      ? "#D1D5DB"
                      : "#10B981",
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 8,
                  }}
                >
                  {createClaimMutation.isPending ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold ml-2">
                        Submitting...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-center">
                      Submit Claim Request
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const ClaimsFeatureCard: React.FC = () => {
  const handlePress = () => {
    router.push("/claims-management" as any);
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-1">
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
        style={{
          padding: 24,
          borderRadius: 16,
          minHeight: 140,
          justifyContent: "flex-start",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={["#A855F7", "#9333EA"]}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="documents" size={24} color="white" />
        </LinearGradient>

        <Text className="text-lg font-semibold text-white mb-2">
          Mosque Claims
        </Text>
        <Text className="text-sm leading-5 text-purple-100">
          Review and manage mosque ownership claims from users
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

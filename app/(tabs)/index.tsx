import React from "react";
import { Text, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FeatureCard } from "../../components/common/FeatureCard";
import { features, adminFeatures } from "../../constants/features";
import { useAuth, useRoles } from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const { hasAnyRole } = useRoles();

  const showAdminFeatures = hasAnyRole([
    "admin_approver",
    "super_admin",
    "mosque_admin",
  ]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View className="pt-8 px-4">
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{
            padding: 20,
            borderRadius: 16,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LinearGradient
              colors={["#ffffff", "#f8f9fa"]}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#667eea" />
            </LinearGradient>
            <View>
              <Text className="text-white font-semibold text-lg">Today</Text>
              <Text className="text-white/80 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Features */}
        <View className="flex-1 justify-between gap-4 py-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </View>

        {/* Admin Features */}
        {showAdminFeatures && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Admin Tools
            </Text>
            <View className="gap-4">
              {adminFeatures.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

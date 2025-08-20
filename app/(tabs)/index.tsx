import React from "react";
import { Text, View, ScrollView, Pressable, Modal, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FeatureCard } from "../../components/common/FeatureCard";
import { features, adminFeatures } from "../../constants/features";
import { useAuth } from "../../hooks/useAuth";
import * as Clipboard from "expo-clipboard";

export default function Home() {
  const { user, hasRole } = useAuth();
  const [showUserIdModal, setShowUserIdModal] = React.useState(false);
  const [tapCount, setTapCount] = React.useState(0);
  const tapTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handleHeaderPress = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Clear existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // If user reaches 10 taps, show modal
    if (newTapCount >= 10) {
      console.log("User ID tapped 10 times");
      setShowUserIdModal(true);
      setTapCount(0);
      return;
    }

    // Reset tap count after 2 seconds of inactivity
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 3000);
  };

  React.useEffect(() => {
    // Reset tap count when component unmounts or user navigates away
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      setTapCount(0);
    };
  }, []);

  const copyUserId = async () => {
    if (user?.id) {
      await Clipboard.setStringAsync(user.id);
      Alert.alert("Copied", "User ID copied to clipboard");
      setShowUserIdModal(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="bg-gray-50 mb-10"
    >
      {/* Header */}
      <View className="pt-8 px-4">
        <Pressable onPress={handleHeaderPress}>
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
        </Pressable>

        {/* Feature Cards */}
        <View className="mt-6">
          <View className="gap-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </View>
        </View>

        {/* Admin Feature Cards */}
        <View className="mt-6">
          <View className="gap-4">
            {adminFeatures.map((feature) => {
              if (
                feature.title === "Mosque Claims" &&
                hasRole("admin_approver")
              ) {
                return <FeatureCard key={feature.title} feature={feature} />;
              } else if (
                feature.title === "Mosque Management" &&
                hasRole("mosque_admin")
              ) {
                return <FeatureCard key={feature.title} feature={feature} />;
              }
              return null;
            })}
          </View>
        </View>
      </View>

      {/* User ID Modal */}
      <Modal
        visible={showUserIdModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserIdModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg m-4 w-80">
            <Text className="text-lg font-semibold mb-4 text-center">
              User ID
            </Text>
            <Text className="text-sm text-gray-600 mb-4 text-center break-all">
              {user?.id || "No user ID available"}
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={copyUserId}
                className="flex-1 bg-blue-500 p-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">Copy</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowUserIdModal(false)}
                className="flex-1 bg-gray-500 p-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

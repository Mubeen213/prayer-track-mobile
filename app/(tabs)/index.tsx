import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Modal, Alert, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FeatureCard } from "../../components/common/FeatureCard";
import { TodayCard } from "../../components/home/TodayCard";
import { BentoGrid } from "../../components/home/BentoGrid";
import { features, adminFeatures } from "../../constants/features";
import { useAuth } from "../../hooks/useAuth";
import * as Clipboard from "expo-clipboard";
import { useGetFavoriteMosques } from "../../hooks/useFavorites";
import { useLocation } from "../../hooks/useLocation";
import { useNearbyMosques } from "../../hooks/useMosques";
import { convert24to12 } from "../../utils/timeConversions";

export default function Home() {
  const { user, hasRole, userId } = useAuth();
  const [showUserIdModal, setShowUserIdModal] = React.useState(false);
  const [tapCount, setTapCount] = React.useState(0);
  const tapTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Data Hooks
  const { data: favorites = [], isLoading: isFavoritesLoading } = useGetFavoriteMosques(userId || null);
  
  const { location, error: locationError } = useLocation();
  // We only fetch nearby mosques if we have location and no favorites to prioritize
  const shouldFetchNearby = !favorites || favorites.length === 0;
  const { 
    data: nearbyMosques, 
    isLoading: isNearbyLoading 
  } = useNearbyMosques(
    shouldFetchNearby ? (location?.latitude || null) : null,
    shouldFetchNearby ? (location?.longitude || null) : null
  );

  // State for TodayCard
  const [prayerState, setPrayerState] = useState<{
    nextPrayer?: { name: string; time: string };
    countdown?: string;
    source?: string;
    error?: string;
  }>({});

  // Logic to determine Next Prayer
  useEffect(() => {
    const calculateNextPrayer = () => {
        let selectedMosque: any = null;
        let sourceName = "";

        // 1. Try Favorites First
        if (favorites && favorites.length > 0) {
            selectedMosque = favorites[0];
            // FavoriteMosque has `mosque_name`
            sourceName = selectedMosque.mosque_name || selectedMosque.name;
            console.log("Using Favorite Mosque:", sourceName);
        }
        // 2. Fallback to Nearest Mosque (if location available)
        else if (nearbyMosques && nearbyMosques.pages && nearbyMosques.pages.length > 0 && nearbyMosques.pages[0].mosques.length > 0) {
             // nearbyMosques is InfiniteData, so we check pages[0].mosques
            selectedMosque = nearbyMosques.pages[0].mosques[0];
            sourceName = selectedMosque.name;
            console.log("Using Nearby Mosque:", sourceName);
        }

        if (!selectedMosque) {
            if (locationError && (!favorites || favorites.length === 0)) {
                setPrayerState({ error: "Enable location or add a favorite." });
            } else if ((!favorites || favorites.length === 0) && (!nearbyMosques?.pages?.[0]?.mosques?.length)) {
                 setPrayerState({ error: "No mosques found." });
            }
            return;
        }

        // Calculate Next Prayer for the selected mosque
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Find next prayer in timings
        if (!selectedMosque.prayer_timings) {
             setPrayerState({ error: "Timings unavailable." });
             return;
        }

        let next = selectedMosque.prayer_timings.find((t: any) => {
            const [h, m] = t.jamaat_time.split(':').map(Number);
            return (h * 60 + m) > currentTimeMinutes;
        });

        // If no prayer left today, show Fajr of tomorrow (or first in list)
        if (!next) {
            next = selectedMosque.prayer_timings[0];
            // Todo: Handle "tomorrow" logic for countdown correctly
        }

        if (next) {
            // Calculate Countdown (Roughly)
            const [h, m] = next.jamaat_time.split(':').map(Number);
            let diffMinutes = (h * 60 + m) - currentTimeMinutes;
            if (diffMinutes < 0) diffMinutes += 24 * 60; // Add 24h if next day

            const hoursLeft = Math.floor(diffMinutes / 60);
            const minsLeft = diffMinutes % 60;
            const countdownStr = `${hoursLeft}h ${minsLeft}m`;

            setPrayerState({
                nextPrayer: {
                    name: next.prayer_name,
                    time: convert24to12(next.jamaat_time)
                },
                countdown: countdownStr,
                source: sourceName
            });
        }
    };

    calculateNextPrayer();
    // Update every minute (could use interval here in future)
  }, [favorites, nearbyMosques, location, locationError]);


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
        className="flex-1 bg-gray-50 mb-10"
        showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="pt-8 px-4 mb-2">
        <TodayCard 
          onPress={handleHeaderPress}
          nextPrayer={prayerState.nextPrayer}
          countdown={prayerState.countdown}
          source={prayerState.source}
          isLoading={isFavoritesLoading || (shouldFetchNearby && isNearbyLoading)}
          error={prayerState.error}
        />
        
        <BentoGrid />

        {/* Admin Features Section - Only show if role active */}
        <View className="mt-8 gap-4 pb-20">
            {adminFeatures.map((feature) => {
              const shouldShow = 
                (feature.title === "Mosque Claims" && hasRole("admin_approver")) ||
                (feature.title === "Mosque Management" && hasRole("mosque_admin"));
              
              if (shouldShow) {
                return <FeatureCard key={feature.title} feature={feature} />;
              }
              return null;
            })}
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

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TodayCardProps {
  onPress: () => void;
  nextPrayer?: {
    name: string;
    time: string;
  };
  countdown?: string;
  source?: string;
  isLoading?: boolean;
  error?: string;
}

export const TodayCard: React.FC<TodayCardProps> = ({ 
  onPress, 
  nextPrayer, 
  countdown, 
  source,
  isLoading,
  error 
}) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#4c1d95', '#7c3aed']} // violet-900 to violet-600
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          height: 220,
          justifyContent: 'space-between',
        }}
      >
        {/* Header: Greeting & Date */}
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-violet-200 text-3xl font-medium mb-1">Salam</Text>
            {/* Removed User Name as per request */}
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white font-medium text-xs">{formattedDate}</Text>
          </View>
        </View>

        {/* Main Content: Next Prayer */}
        <View>
            {isLoading ? (
                <View>
                     <Text className="text-violet-200 text-lg">Finding timings...</Text>
                </View>
            ) : nextPrayer ? (
                <>
                    <View className="flex-row items-end gap-3 mb-1">
                        <Text className="text-white text-5xl font-bold tracking-tight capitalize">{nextPrayer.name}</Text>
                        <Text className="text-violet-200 text-2xl font-medium mb-2">{nextPrayer.time}</Text>
                    </View>
                    <Text className="text-violet-300 text-sm">Next prayer in {countdown || "--"}</Text>
                </>
            ) : error ? (
                <View>
                     <Text className="text-white text-2xl font-bold mb-1">No Timings</Text>
                     <Text className="text-violet-200 text-sm">Add favorite mosque to view timings</Text>
                </View>
            ) : (
                <View>
                     <Text className="text-white text-2xl font-bold mb-1">Setup Prayer Times</Text>
                     <Text className="text-violet-200 text-sm">Favorite a mosque</Text>
                </View>
            )}
        </View>

        {/* Footer: Location */}
        {source ? (
        <View className="flex-row items-center gap-2 mt-2 bg-black/10 self-start px-3 py-1.5 rounded-full">
            <Ionicons name="location-sharp" size={12} color="#ddd6fe" />
            <Text className="text-violet-100 text-xs font-medium">
                Based on {source}
            </Text>
        </View>
        ) : <View />}
      </LinearGradient>
    </Pressable>
  );
};

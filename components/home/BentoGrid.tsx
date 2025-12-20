import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Reusable Bento Card Component
const BentoCard = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  className = "", 
  variant = "white",
  height = 160
}: {
  title: string,
  subtitle?: string,
  icon: keyof typeof Ionicons.glyphMap,
  onPress: () => void,
  className?: string,
  variant?: "white" | "primary",
  height?: number
}) => {
    const isPrimary = variant === "primary";
    
    return (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.9}
            className={`rounded-3xl p-5 justify-between shadow-sm ${className} ${isPrimary ? '' : 'bg-white'}`}
            style={{ height }}
        >
            {isPrimary ? (
                <LinearGradient
                    colors={['#10b981', '#059669']} // emerald-500 to emerald-700
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 24 }}
                />
            ) : null}

            <View className={`w-12 h-12 rounded-full items-center justify-center ${isPrimary ? 'bg-white/20' : 'bg-gray-50'}`}>
                <Ionicons name={icon} size={24} color={isPrimary ? '#fff' : '#374151'} />
            </View>

            <View>
                <Text className={`text-lg font-bold ${isPrimary ? 'text-white' : 'text-gray-900'}`}>{title}</Text>
                {subtitle && <Text className={`text-sm mt-1 ${isPrimary ? 'text-emerald-100' : 'text-gray-500'}`}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
};

import { useReadingProgress } from '../../hooks/useReadingProgress';
import chapters from '../../data/quran-chapters';

export const BentoGrid = () => {
  const { progress } = useReadingProgress();

  const getSubtitle = () => {
      if (!progress) return "Start Reading";
      const chapter = chapters.find(c => c.number === progress.chapter);
      return `Continue Reading Verse ${progress.verse} - ${chapter?.chapter || 'Quran'}`;
  };

  const handleQuranPress = () => {
      if (progress) {
          router.push(`/chapter/${progress.chapter}/?verse=${progress.verse}`);
      } else {
          router.push("/quran");
      }
  };

  return (
    <View className="gap-4 mt-6">
        {/* Row 1: Mosques & Favorites */}
        <View className="flex-row gap-4">
            <View className="flex-1">
                <BentoCard 
                    title="Mosques" 
                    subtitle="Find Nearby" 
                    icon="business" 
                    onPress={() => router.push("/mosque")}
                    variant="white"
                    height={160}
                />
            </View>
            <View className="flex-1">
                <BentoCard 
                    title="Favorites"
                    subtitle="Saved Verses" 
                    icon="heart" 
                    onPress={() => router.push("/quran/favorites")}
                    height={160}
                />
            </View>
        </View>

        {/* Row 2: Quran (Full Width) */}
        <View>
             <BentoCard 
                title="Quran" 
                subtitle={getSubtitle()}
                icon="book" 
                onPress={handleQuranPress}
                variant="primary" // Highlight Quran
                height={140}
            />
        </View>
    </View>
  );
};

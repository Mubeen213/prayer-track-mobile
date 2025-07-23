import React from 'react';
import { Text, TouchableOpacity, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ColorValue } from 'react-native';

export interface Feature {
  title: string;
  description: string;
  icon: string;
  link: string;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  iconGradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const handlePress = () => {
    router.push(feature.link as any);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="flex-1"
    >
      <LinearGradient
        colors={feature.gradient}
        style={{
          padding: 24,
          borderRadius: 16,
          minHeight: 140,
          justifyContent: 'flex-start',
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={feature.iconGradient}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name={feature.icon as any} 
            size={24} 
            color="white" 
          />
        </LinearGradient>

        <Text className="text-lg font-semibold text-gray-700  mb-2">
          {feature.title}
        </Text>
        <Text className="text-sm leading-5">
          {feature.description}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
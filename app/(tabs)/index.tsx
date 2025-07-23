import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatureCard } from '../../components/common/FeatureCard';
import { features } from '../../constants/features';

export default function Home() {
  return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Features Grid */}
        <View className="p-4">
          <View className="flex-1 justify-between gap-4 py-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </View>
        </View>
      </ScrollView>

  );
}
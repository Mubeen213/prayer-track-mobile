import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10b981', // text-green-500
        tabBarInactiveTintColor: '#6b7280', // text-gray-600
        tabBarStyle: {
          backgroundColor: '#ffffff', // bg-white
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // border-gray-200
          paddingVertical: 12,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'PrayerTrack',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={focused ? '#10b981' : '#6b7280'} // Force the colors
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mosque"
        options={{
          title: 'Mosques',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "location" : "location-outline"} 
              size={24} 
              color={focused ? '#10b981' : '#6b7280'} // Force the colors
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "book" : "book-outline"} 
              size={24} 
              color={focused ? '#10b981' : '#6b7280'} // Force the colors
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={focused ? '#10b981' : '#6b7280'} // Force the colors
            />
          ),
        }}
      />
    </Tabs>
  );
}
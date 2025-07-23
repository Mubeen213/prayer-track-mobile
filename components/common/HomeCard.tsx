
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

type HomeCardProps = {
  title: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  href: string;
};

export default function HomeCard({ title, iconName, href }: HomeCardProps) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.card}>
        <FontAwesome size={40} name={iconName} color="#333" />
        <Text style={styles.cardText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '40%', // Adjust width to fit 2 cards per row
    aspectRatio: 1, // Make the card a square
  },
  cardText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

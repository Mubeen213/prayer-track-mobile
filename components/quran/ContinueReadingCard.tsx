import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReadingProgress } from "../../services/quranReadingProgressService";

interface ContinueReadingCardProps {
  progress: ReadingProgress;
  onPress: () => void;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({
  progress,
  onPress,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={["#059669", "#22c55e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Continue Reading</Text>
          <Text style={styles.reference}>
            {progress.chapterName} - Verse {progress.verse}
          </Text>
          <Text style={styles.timestamp}>
            Last read: {formatDate(progress.timestamp)}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📖</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  reference: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 2,
  },
  timestamp: {
    color: "white",
    fontSize: 12,
    opacity: 0.7,
  },
  iconContainer: {
    marginLeft: 16,
  },
  icon: {
    fontSize: 24,
  },
});

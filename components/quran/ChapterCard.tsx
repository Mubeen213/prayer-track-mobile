import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity } from "react-native";

interface ChapterCardProps {
  number: number;
  name: string;
  onPress: () => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  number,
  name,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.rowContainer}>
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={["#22c55e", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.numberText}>{number}</Text>
          </LinearGradient>
        </View>
        <View>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  gradientContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "white",
    fontWeight: "500",
  },
  nameText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    color: "#1f2937",
  },
});

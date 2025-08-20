import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CardContent = ({ children, style }: CardProps) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

export const ChapterSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.backButton} />
            <View style={styles.headerControls}>
              <View style={styles.dropdown1} />
              <View style={styles.dropdown2} />
              <View style={styles.menuButton} />
            </View>
          </View>
        </View>
      </View>

      {/* Chapter Title Skeleton */}
      <View style={styles.titleContainer}>
        <View style={styles.titleContent}>
          <View style={styles.mainTitle} />
          <View style={styles.subtitle} />
        </View>
      </View>

      {/* Verses Skeleton */}
      <View style={styles.versesContainer}>
        <View style={styles.versesContent}>
          {[...Array(5)].map((_, index) => (
            <Card key={index} style={styles.verseCard}>
              <CardContent>
                {/* Arabic Text Skeleton */}
                <View style={styles.arabicSection}>
                  <View style={styles.arabicTextLine} />
                </View>
                {/* Translation Skeleton */}
                <View style={styles.translationSection}>
                  <View style={styles.translationLines}>
                    <View style={styles.translationLine1} />
                    <View style={styles.translationLine2} />
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf7",
    minHeight: "100%",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
  },
  headerContent: {
    maxWidth: 1280,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "center",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    height: 36,
    width: 80,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dropdown1: {
    height: 36,
    width: 140,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
  dropdown2: {
    height: 36,
    width: 130,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
  menuButton: {
    height: 36,
    width: 36,
    backgroundColor: "#e5e7eb",
    borderRadius: 18,
  },
  titleContainer: {
    maxWidth: 768,
    alignSelf: "center",
    paddingTop: 32,
    paddingHorizontal: 8,
    width: "100%",
  },
  titleContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  mainTitle: {
    height: 40,
    width: 192,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 8,
  },
  subtitle: {
    height: 24,
    width: 128,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
  versesContainer: {
    maxWidth: 768,
    alignSelf: "center",
    paddingBottom: 32,
    paddingHorizontal: 4,
    width: "100%",
  },
  versesContent: {
    gap: 24,
  },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: 0,
  },
  verseCard: {
    marginBottom: 16,
  },
  arabicSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "flex-end",
  },
  arabicTextLine: {
    height: 32,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
  translationSection: {
    padding: 24,
    backgroundColor: "rgba(249, 250, 251, 0.5)",
  },
  translationLines: {
    gap: 16,
  },
  translationLine1: {
    height: 16,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  translationLine2: {
    height: 16,
    width: "75%",
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
});

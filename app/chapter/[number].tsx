import React, { useState, useEffect, useRef } from "react";
import { View, Alert, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useChapter } from "../../hooks/useChapter";
import { ChapterHeader } from "../../components/quran/ChapterHeader";
import { VerseCard } from "../../components/quran/VerseCard";
import { ChapterTitle } from "../../components/quran/ChapterTitle";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function ChapterPage() {
  const { number, verse } = useLocalSearchParams<{
    number: string;
    verse?: string;
  }>();
  const { chapter, isLoading, error } = useChapter({ chapterNumber: number });
  const flatListRef = useRef<FlatList>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState<string>("both");
  const [fontSize, setFontSize] = useState<string>("medium");

  const fontSizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const translationOptions = [
    { value: "none", label: "Arabic Only" },
    { value: "english", label: "With English" },
    { value: "urdu", label: "With Urdu" },
    { value: "both", label: "All Translations" },
  ];

  const handleNavigateBack = () => {
    router.replace("/quran");
  };

  useEffect(() => {
    if (chapter && verse && flatListRef.current) {
      const verseNumber = parseInt(verse);
      const verseIndex = chapter.ayahs.findIndex(
        (ayah: any) => ayah.ayah_number === verseNumber
      );
      let scrollTimeout = 500;
      if (verseIndex !== -1) {
        const initialRenderCount = Math.max(15, verseIndex + 5);
        if (initialRenderCount > 100) {
          scrollTimeout = 1500;
        } else if (initialRenderCount > 50) {
          scrollTimeout = 1000;
        }
        setTimeout(() => {
          console.log("Attempting to scroll to index:", verseIndex);
          flatListRef.current?.scrollToIndex({
            index: verseIndex,
            animated: false,
            viewPosition: 0.1,
          });
        }, scrollTimeout);
      }
    }
  }, [chapter, verse]);

  useEffect(() => {
    if (error && !isLoading) {
      Alert.alert("Error", error?.message || "Chapter not found", [
        {
          text: "OK",
          onPress: handleNavigateBack,
        },
      ]);
    }
  }, [error, isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !chapter) {
    return <LoadingSpinner />;
  }

  const getFontSize = (size: string) => {
    const sizes = {
      small: "text-2xl",
      medium: "text-3xl",
      large: "text-4xl",
    };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  };

  const getTranslationFontSize = (size: string) => {
    const sizes = {
      small: "text-base",
      medium: "text-lg",
      large: "text-xl",
    };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  };

  const toArabicNumeral = (num: number): string => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumerals[parseInt(digit)])
      .join("");
  };

  const renderVerse = ({ item: ayah }: { item: any }) => (
    <VerseCard
      key={ayah.ayah_number}
      ayah={ayah}
      fontSize={fontSize}
      showTranslation={showTranslation}
      getFontSize={getFontSize}
      getTranslationFontSize={getTranslationFontSize}
      toArabicNumeral={toArabicNumeral}
      isHighlighted={verse ? ayah.ayah_number === parseInt(verse) : false}
    />
  );

  const handleScrollToIndexFailed = (info: any) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0.1,
      });
    });
  };

  return (
    <View className="flex-1 bg-[#fafaf7]">
      <ChapterHeader
        fontSize={fontSize}
        showTranslation={showTranslation}
        isMobileMenuOpen={isMobileMenuOpen}
        fontSizeOptions={fontSizeOptions}
        translationOptions={translationOptions}
        onNavigateBack={handleNavigateBack}
        onFontSizeChange={setFontSize}
        onTranslationChange={setShowTranslation}
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <FlatList
        ref={flatListRef}
        data={chapter.ayahs}
        renderItem={renderVerse}
        keyExtractor={(item) => item.ayah_number.toString()}
        ListHeaderComponent={<ChapterTitle chapter={chapter} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={20}
        windowSize={20}
        initialNumToRender={verse ? Math.max(30, parseInt(verse) + 10) : 30} // Dynamic initial render
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Alert, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useChapter } from "../../hooks/useChapter";
import { useReadingProgress } from "../../hooks/useReadingProgress";
import { ChapterHeader } from "../../components/quran/ChapterHeader";
import { VerseCard } from "../../components/quran/VerseCard";
import { ChapterTitle } from "../../components/quran/ChapterTitle";
import { ChapterSkeleton } from "../../components/ui/ChapterSkeleton";
import { useVerseFavorites } from "../../hooks/useVerseFavorites";

export default function ChapterPage() {
  const { number, verse } = useLocalSearchParams<{
    number: string;
    verse?: string;
  }>();
  const { chapter, isLoading, error } = useChapter({ chapterNumber: number });
  const { updateProgress } = useReadingProgress();
  const { isFavorite, toggleFavorite } = useVerseFavorites();
  const flatListRef = useRef<FlatList>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState<string>("both");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [visibleVerses, setVisibleVerses] = useState<number[]>([]);
  const [listReady, setListReady] = useState(false);
  const scrollAttempted = useRef(false);

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

  // Update reading progress when user scrolls
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && chapter) {
        const currentVerses = viewableItems.map(
          (item) => item.item.ayah_number
        );
        setVisibleVerses(currentVerses);

        // Update progress to the first visible verse
        const firstVisibleVerse = currentVerses[0];
        if (firstVisibleVerse) {
          updateProgress(
            parseInt(number),
            firstVisibleVerse,
            chapter.surah_name
          );
        }
      }
    },
    [chapter, number, updateProgress]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000, // 1 second
  };

  useEffect(() => {
    if (
      chapter &&
      verse &&
      listReady &&
      flatListRef.current &&
      !scrollAttempted.current
    ) {
      const verseNumber = parseInt(verse);
      const verseIndex = chapter.ayahs.findIndex(
        (ayah: any) => ayah.ayah_number === verseNumber
      );

      if (verseIndex !== -1) {
        scrollAttempted.current = true;
        // Use a longer delay to ensure all items are laid out
        setTimeout(() => {
          console.log("Scrolling to verse index:", verseIndex);
          flatListRef.current?.scrollToIndex({
            index: verseIndex,
            animated: true,
            viewPosition: 0.1,
          });
        }, 300);
      }
    }
  }, [chapter, verse, listReady]);

  // Reset scroll attempted when verse changes
  useEffect(() => {
    scrollAttempted.current = false;
  }, [verse]);

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
    return <ChapterSkeleton />;
  }

  if (error || !chapter) {
    return <ChapterSkeleton />;
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
      isFavorite={isFavorite(parseInt(number), ayah.ayah_number)}
      onToggleFavorite={() =>
        toggleFavorite(parseInt(number), ayah.ayah_number, chapter.surah_name)
      }
    />
  );

  const handleScrollToIndexFailed = (info: any) => {
    console.log("Scroll to index failed, retrying...", info);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: false,
        viewPosition: 0.1,
      });
    }, 100);
  };

  // Estimate item layout for better scrolling performance
  const getItemLayout = (_: any, index: number) => {
    const ESTIMATED_ITEM_HEIGHT = 250; // Average height of a verse card
    return {
      length: ESTIMATED_ITEM_HEIGHT,
      offset: ESTIMATED_ITEM_HEIGHT * index,
      index,
    };
  };

  const handleListLayout = () => {
    if (!listReady) {
      setListReady(true);
    }
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 55 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={20}
        windowSize={21}
        initialNumToRender={verse ? Math.max(30, parseInt(verse) + 10) : 30}
        getItemLayout={getItemLayout}
        onLayout={handleListLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

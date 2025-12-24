import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { View, Alert } from "react-native";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useLocalSearchParams, router } from "expo-router";

import { useChapter } from "../../hooks/useChapter";
import { useReadingProgress } from "../../hooks/useReadingProgress";
import { useVerseFavorites } from "../../hooks/useVerseFavorites";
import type { Chapter } from "../../services/quranService";

type Ayah = Chapter["ayahs"][number];

import { ChapterHeader } from "../../components/quran/ChapterHeader";
import { VerseCard } from "../../components/quran/VerseCard";
import { ChapterTitle } from "../../components/quran/ChapterTitle";
import { ChapterSkeleton } from "../../components/ui/ChapterSkeleton";

export default function ChapterPage() {
  const { number, verse } = useLocalSearchParams<{
    number: string;
    verse?: string;
  }>();

  console.log("ChapterPage params:", { number, verse });

  const { chapter, isLoading, error } = useChapter({ chapterNumber: number });
  const { updateProgress } = useReadingProgress();
  const { isFavorite, toggleFavorite } = useVerseFavorites();

  const flatListRef = useRef<FlashListRef<Ayah>>(null);

  // UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState("both");
  const [fontSize, setFontSize] = useState("medium");

  // Scrolling States
  const [targetVerse, setTargetVerse] = useState<number | null>(null);
  const hasScrolledRef = useRef(false);
  const visibleVersesRef = useRef<number[]>([]);

  // -----------------------------
  // HANDLE PARAM STABILIZATION
  // -----------------------------
  useEffect(() => {
    if (verse) {
      const v = parseInt(verse);
      if (v !== targetVerse) {
        console.log("Setting target verse:", v);
        setTargetVerse(v);
        hasScrolledRef.current = false; // Allow scroll again
      }
    } else {
      setTargetVerse(null);
    }
  }, [verse]);

  // -----------------------------
  // VIEWABILITY HANDLER (NO STATE)
  // -----------------------------
  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ item: { ayah_number: number } }>;
    }) => {
      if (!chapter) return;

      const verses = viewableItems.map((v) => v.item.ayah_number);

      visibleVersesRef.current = verses;

      if (verses.length > 0) {
        updateProgress(parseInt(number), verses[0], chapter.surah_name);
      }
    },
    [chapter, number, updateProgress]
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
      minimumViewTime: 1000,
    }),
    []
  );

  // -----------------------------
  // LAYOUT READY → SCROLL
  // -----------------------------
  const onListReady = useCallback(() => {
    if (!chapter || !targetVerse || hasScrolledRef.current) return;

    const index = chapter.ayahs.findIndex((a) => a.ayah_number === targetVerse);

    if (index < 0 || !flatListRef.current) return;

    console.log("Scrolling to index:", index);

    hasScrolledRef.current = true;

    flatListRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.1,
    });
  }, [chapter, targetVerse]);



  // -----------------------------
  // SCREEN ERROR HANDLING
  // -----------------------------
  useEffect(() => {
    if (error && !isLoading) {
      Alert.alert("Error", error?.message || "Chapter not found", [
        { text: "OK", onPress: () => router.replace("/quran") },
      ]);
    }
  }, [error, isLoading]);



  const getFontSize = useCallback((size: string) => {
    const sizes = {
      small: "text-2xl",
      medium: "text-3xl",
      large: "text-4xl",
    };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  }, []);

  const getTranslationFontSize = useCallback((size: string) => {
    const sizes = {
      small: "text-base",
      medium: "text-lg",
      large: "text-xl",
    };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  }, []);

  const toArabicNumeral = useCallback((num: number): string => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumerals[parseInt(digit)])
      .join("");
  }, []);

  // -----------------------------
  // MEMOIZED HEADER
  // -----------------------------
  const headerElement = useMemo(
    () => (
      <ChapterHeader
        fontSize={fontSize}
        showTranslation={showTranslation}
        isMobileMenuOpen={isMobileMenuOpen}
        fontSizeOptions={[
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ]}
        translationOptions={[
          { value: "none", label: "Arabic Only" },
          { value: "english", label: "With English" },
          { value: "urdu", label: "With Urdu" },
          { value: "both", label: "All Translations" },
        ]}
        onNavigateBack={() => router.replace("/quran")}
        onFontSizeChange={setFontSize}
        onTranslationChange={setShowTranslation}
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />
    ),
    [fontSize, showTranslation, isMobileMenuOpen]
  );

  // -----------------------------
  // MEMOIZED RENDER ITEM
  // -----------------------------
  const renderVerse = useCallback(
    ({ item }: { item: Ayah }) => (
      <VerseCard
        ayah={item}
        fontSize={fontSize}
        showTranslation={showTranslation}
        getFontSize={getFontSize}
        getTranslationFontSize={getTranslationFontSize}
        toArabicNumeral={toArabicNumeral}
        isHighlighted={targetVerse ? item.ayah_number === targetVerse : false}
        isFavorite={isFavorite(parseInt(number), item.ayah_number)}
        onToggleFavorite={() =>
          toggleFavorite(parseInt(number), item.ayah_number, chapter?.surah_name || "")
        }
      />
    ),
    [
      fontSize,
      showTranslation,
      getFontSize,
      getTranslationFontSize,
      toArabicNumeral,
      targetVerse,
      number,
      chapter?.surah_name,
      isFavorite,
      toggleFavorite,
    ]
  );

  // -----------------------------
  // UI
  // -----------------------------
  if (isLoading || !chapter) {
    return <ChapterSkeleton />;
  }

  return (
    <View className="flex-1 bg-[#fafaf7]">
      {headerElement}

      <FlashList
        ref={flatListRef}
        data={chapter.ayahs}
        renderItem={renderVerse}
        keyExtractor={(item) => item.ayah_number.toString()}
        ListHeaderComponent={<ChapterTitle chapter={chapter} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 55 }}
        showsVerticalScrollIndicator={false}
        onLayout={onListReady}
        onLoad={onListReady}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

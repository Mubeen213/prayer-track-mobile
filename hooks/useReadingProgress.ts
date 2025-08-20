import { useState, useEffect } from "react";
import {
  ReadingProgressService,
  ReadingProgress,
} from "../services/quranReadingProgressService";

export const useReadingProgress = () => {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await ReadingProgressService.getProgress();
      setProgress(savedProgress);
    } catch (error) {
      console.error("Error loading reading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (
    chapter: number,
    verse: number,
    chapterName: string
  ) => {
    await ReadingProgressService.updateProgress(chapter, verse, chapterName);
    setProgress({ chapter, verse, chapterName, timestamp: Date.now() });
  };

  const clearProgress = async () => {
    await ReadingProgressService.clearProgress();
    setProgress(null);
  };

  return {
    progress,
    loading,
    updateProgress,
    clearProgress,
    hasProgress: progress !== null,
  };
};

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ReadingProgress {
  chapter: number;
  verse: number;
  chapterName: string;
  timestamp: number;
}

const STORAGE_KEY = "quran_reading_progress";

export class ReadingProgressService {
  /**
   * Update reading progress when user scrolls to a verse
   */
  static async updateProgress(
    chapter: number,
    verse: number,
    chapterName: string
  ): Promise<void> {
    try {
      const progress: ReadingProgress = {
        chapter,
        verse,
        chapterName,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving reading progress:", error);
    }
  }

  /**
   * Get last reading progress
   */
  static async getProgress(): Promise<ReadingProgress | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const progress = JSON.parse(stored) as ReadingProgress;

      // Validate progress data
      if (
        !progress.chapter ||
        !progress.verse ||
        progress.chapter < 1 ||
        progress.chapter > 114 ||
        progress.verse < 1
      ) {
        return null;
      }

      return progress;
    } catch (error) {
      console.error("Error reading progress:", error);
      return null;
    }
  }

  /**
   * Clear reading progress
   */
  static async clearProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing reading progress:", error);
    }
  }

  /**
   * Check if there's saved progress
   */
  static async hasProgress(): Promise<boolean> {
    const progress = await this.getProgress();
    return progress !== null;
  }
}

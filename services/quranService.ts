import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ayah {
  ayah_number: number;
  arabic: string;
  english: string;
  urdu: string;
}

export interface Chapter {
  surah_number: number;
  surah_name: string;
  ayahs: Ayah[];
}

const CACHE_KEYS = {
  chapter: (chapterNumber: string) => `quran_chapter_${chapterNumber}_v1`,
};

export class QuranService {
  private static cloudfrontUrl = process.env.EXPO_PUBLIC_QURAN_CLOUDFRONT_URL;

  /**
   * Get chapter - cache first, then server
   */
  static async getChapter(chapterNumber: string): Promise<Chapter> {
    try {
      // Try cache first
      const cached = await this.getFromCache(chapterNumber);
      if (cached) {
        console.log(`Chapter ${chapterNumber} loaded from cache`);
        return cached;
      }

      // Fetch from server
      console.log(`Fetching chapter ${chapterNumber} from server...`);
      const chapter = await this.fetchFromServer(chapterNumber);

      // Cache it
      await this.saveToCache(chapterNumber, chapter);

      return chapter;
    } catch (error) {
      console.error(`Error getting chapter ${chapterNumber}:`, error);
      throw new Error(`Failed to load chapter ${chapterNumber}`);
    }
  }

  /**
   * Search by chapter:verse format (e.g., "2:43", "1:2")
   */
  static parseSearchQuery(
    query: string
  ): { chapter: number; verse?: number } | null {
    const trimmed = query.trim();

    if (trimmed.includes(":")) {
      const [chapterStr, verseStr] = trimmed.split(":");
      const chapter = parseInt(chapterStr);
      const verse = parseInt(verseStr);

      if (isNaN(chapter) || chapter < 1 || chapter > 114) {
        return null;
      }

      if (isNaN(verse) || verse < 1) {
        return null;
      }

      return { chapter, verse };
    } else {
      const chapter = parseInt(trimmed);
      if (isNaN(chapter) || chapter < 1 || chapter > 114) {
        return null;
      }
      return { chapter };
    }
  }

  /**
   * Get specific verse from chapter
   */
  static async getVerse(
    chapterNumber: number,
    verseNumber: number
  ): Promise<{
    chapter: Chapter;
    verse: Ayah | null;
  }> {
    const chapter = await this.getChapter(chapterNumber.toString());
    const verse =
      chapter.ayahs.find((ayah) => ayah.ayah_number === verseNumber) || null;

    return { chapter, verse };
  }

  /**
   * Cache operations
   */
  private static async getFromCache(
    chapterNumber: string
  ): Promise<Chapter | null> {
    try {
      const cached = await AsyncStorage.getItem(
        CACHE_KEYS.chapter(chapterNumber)
      );
      if (!cached) return null;

      const chapter = JSON.parse(cached) as Chapter;

      // Validate cache
      if (
        !chapter.ayahs ||
        !Array.isArray(chapter.ayahs) ||
        chapter.ayahs.length === 0
      ) {
        await this.removeFromCache(chapterNumber);
        return null;
      }

      return chapter;
    } catch (error) {
      console.error(
        `Error reading chapter ${chapterNumber} from cache:`,
        error
      );
      await this.removeFromCache(chapterNumber);
      return null;
    }
  }

  private static async saveToCache(
    chapterNumber: string,
    chapter: Chapter
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CACHE_KEYS.chapter(chapterNumber),
        JSON.stringify(chapter)
      );
      console.log(`Chapter ${chapterNumber} cached successfully`);
    } catch (error) {
      console.error(`Error caching chapter ${chapterNumber}:`, error);
    }
  }

  private static async removeFromCache(chapterNumber: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.chapter(chapterNumber));
    } catch (error) {
      console.error(
        `Error removing chapter ${chapterNumber} from cache:`,
        error
      );
    }
  }

  private static async fetchFromServer(
    chapterNumber: string
  ): Promise<Chapter> {
    if (!this.cloudfrontUrl) {
      throw new Error("Quran CloudFront URL not configured");
    }

    const url = `${this.cloudfrontUrl}/Quran/chapter-${chapterNumber}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch chapter ${chapterNumber}: ${response.status}`
      );
    }

    const chapter = (await response.json()) as Chapter;

    // Validate response
    if (!chapter.ayahs || !Array.isArray(chapter.ayahs)) {
      throw new Error(`Invalid chapter data for chapter ${chapterNumber}`);
    }

    return chapter;
  }

  /**
   * Utility methods
   */
  static async isChapterCached(chapterNumber: string): Promise<boolean> {
    try {
      const cached = await AsyncStorage.getItem(
        CACHE_KEYS.chapter(chapterNumber)
      );
      return !!cached;
    } catch {
      return false;
    }
  }

  static async getCacheStats(): Promise<{
    cachedChapters: number;
    totalChapters: number;
  }> {
    try {
      const cachedCount = await this.getCachedChaptersCount();
      return {
        cachedChapters: cachedCount,
        totalChapters: 114,
      };
    } catch {
      return { cachedChapters: 0, totalChapters: 114 };
    }
  }

  private static async getCachedChaptersCount(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter((key) => key.startsWith("quran_chapter_")).length;
    } catch {
      return 0;
    }
  }

  static async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const quranKeys = keys.filter((key) => key.startsWith("quran_chapter_"));
      await AsyncStorage.multiRemove(quranKeys);
      console.log(`Cleared ${quranKeys.length} cached chapters`);
    } catch (error) {
      console.error("Error clearing Quran cache:", error);
    }
  }
}

import { useQuery } from "@tanstack/react-query";
import { Chapter } from "../types/quran";

interface UseChapterProps {
  chapterNumber: string | undefined;
}

interface UseChapterReturn {
  chapter: Chapter | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useChapter = ({
  chapterNumber,
}: UseChapterProps): UseChapterReturn => {
  const cloudfrontUrl = process.env.EXPO_PUBLIC_QURAN_CLOUDFRONT_URL;
  const {
    data: chapter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapter", chapterNumber],
    queryFn: async () => {
      const url = `${cloudfrontUrl}/Quran/chapter-${chapterNumber}.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch chapter");
      }
      return response.json() as Promise<Chapter>;
    },
    enabled: !!chapterNumber,
    staleTime: 10 * 60 * 1000,
  });

  return {
    chapter,
    isLoading,
    error: error as Error | null,
  };
};

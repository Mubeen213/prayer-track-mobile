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
  const {
    data: chapter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapter", chapterNumber],
    queryFn: async () => {
      // Replace with your actual API endpoint
      const response = await fetch(
        `YOUR_QURAN_API_URL/chapters/${chapterNumber}.json`
      );
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

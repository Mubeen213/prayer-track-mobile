import { useQuery } from "@tanstack/react-query";
import { Chapter, QuranService } from "../services/quranService";

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
      if (!chapterNumber) {
        throw new Error("Chapter number is required");
      }
      return await QuranService.getChapter(chapterNumber);
    },
    enabled: !!chapterNumber,
    staleTime: 60, // 1 hour
    retry: 2,
  });

  return {
    chapter,
    isLoading,
    error: error as Error | null,
  };
};

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../config/axios";
import { MosquesResponse, Mosque } from "../types/mosque";
import { GET_MOSQUES } from "../utils/urls";

interface MosqueQueryParams {
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export const useMosques = (params: MosqueQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["mosques", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<MosquesResponse>(GET_MOSQUES, {
        params: {
          ...params,
          page: pageParam,
          limit: params.limit || 6,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: params.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMosque = (mosqueId: string) => {
  return useQuery({
    queryKey: ["mosque", mosqueId],
    queryFn: async () => {
      const { data } = await api.get<Mosque>(`/mosques/${mosqueId}`);
      return data;
    },
    enabled: !!mosqueId,
  });
};

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../config/axios";
import { MosquesResponse } from "../types/mosque";

interface NearbyMosquesParams {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}

export const useNearbyMosques = (params: NearbyMosquesParams | null) => {
  return useInfiniteQuery({
    queryKey: ["mosques", "nearby", params],
    queryFn: async ({ pageParam = 1 }) => {
      if (!params || (params.latitude === 0 && params.longitude === 0)) {
        throw new Error("Invalid coordinates");
      }

      const { data } = await api.get<MosquesResponse>("/mosques/nearby", {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 8, // 5km default radius
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
    enabled: !!params && !!params.latitude && !!params.longitude,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MosqueService } from "../services/mosqueService";
import { MosquesResponse, Mosque } from "../types/mosque";

interface MosqueQueryParams {
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export const useMosques = (params: MosqueQueryParams = {}) => {
  // console.log("Use all mosques with params:", params);
  return useInfiniteQuery({
    queryKey: ["mosques", params.search || "all"],
    queryFn: async ({ pageParam = 1 }) => {
      // Get mosques from cache (search or all)
      const mosques = params.search
        ? await MosqueService.searchMosques(params.search)
        : await MosqueService.getAllMosques();

      // Simulate pagination for infinite query structure
      const limit = params.limit || 20;
      const startIndex = (pageParam - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMosques = mosques.slice(startIndex, endIndex);

      return {
        mosques: paginatedMosques,
        pagination: {
          page: pageParam,
          limit: limit,
          total: mosques.length,
          pages: Math.ceil(mosques.length / limit),
        },
      } as MosquesResponse;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: params.enabled !== false,
    staleTime: 1000 * 60 * 15,
  });
};

export const useMosque = (mosqueId: string) => {
  return useQuery({
    queryKey: ["mosque", mosqueId],
    queryFn: () => MosqueService.getMosque(mosqueId),
    enabled: !!mosqueId,
    staleTime: 1000 * 60 * 15,
  });
};

// Hook for nearby mosques using cache
export const useNearbyMosques = (
  latitude: number | null,
  longitude: number | null,
  radius: number = 5
) => {
  // console.log("Use nearby mosques with params:", {
  //   latitude,
  //   longitude,
  //   radius,
  // });
  return useInfiniteQuery({
    queryKey: ["nearby-mosques", latitude, longitude, radius],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching nearby mosques for page:", pageParam);
      if (!latitude || !longitude) {
        return {
          mosques: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        };
      }

      const mosques = await MosqueService.getNearbyMosques(
        latitude,
        longitude,
        radius
      );

      // Simulate pagination
      const limit = 20;
      const startIndex = (pageParam - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMosques = mosques.slice(startIndex, endIndex);

      return {
        mosques: paginatedMosques,
        pagination: {
          page: pageParam,
          limit: limit,
          total: mosques.length,
          pages: Math.ceil(mosques.length / limit),
        },
      } as MosquesResponse;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!(latitude && longitude),
    staleTime: 1000 * 60 * 5, // 5 minutes for location-based data
  });
};

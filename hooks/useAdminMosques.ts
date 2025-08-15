import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/axios";
import { Mosque } from "../types/mosque";

export const useAdminMosques = () => {
  return useQuery({
    queryKey: ["admin-mosques"],
    queryFn: async (): Promise<Mosque[]> => {
      const response = await api.get("/admin/mosques");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
};

// Helper hook to force refresh admin mosques
export const useRefreshAdminMosques = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.refetchQueries({
      queryKey: ["admin-mosques"],
      type: "active",
    });
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "../config/axios";
import { Mosque } from "../types/mosque";

// Get admin's mosques
export const useAdminMosques = () => {
  return useQuery({
    queryKey: ["admin-mosques"],
    queryFn: async (): Promise<Mosque[]> => {
      const response = await api.get("/admin/mosques");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

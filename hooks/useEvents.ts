import { useQuery } from "@tanstack/react-query";
import { api } from "../config/axios";

export const useMosqueEvents = (mosqueId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["mosque-events", mosqueId],
    queryFn: async () => {
      const { data } = await api.get(`/mosques/${mosqueId}/events`);
      return data;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

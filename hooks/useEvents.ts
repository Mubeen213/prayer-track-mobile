import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/axios";

interface EventInput {
  title: string;
  description: string;
  scholar?: string;
  event_date: string;
  event_time: string;
  mosque_id: string;
}

interface UpdateEventInput extends EventInput {
  id: string;
}
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

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEventInput) => {
      const response = await api.patch(`/admin/events/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mosque-events"] });
      // toast.success('Event updated successfully')
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.delete(`/admin/events/${eventId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mosque-events"],
      });
      // toast.success('Event deleted successfully')
    },
    onError: () => {
      // toast.error('Failed to delete event')
    },
  });
};

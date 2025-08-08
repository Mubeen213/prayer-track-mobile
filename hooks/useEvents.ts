import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
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
      const { data } = await api.get(`/events/mosques/${mosqueId}`);
      return data;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  console.log("useCreateEvent called");
  return useMutation({
    mutationFn: async (data: EventInput) => {
      const response = await api.post("/admin/events", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mosque-events", variables.mosque_id],
      });
      Toast.show({
        type: "success",
        text1: "Event Created Successfully",
        text2: "Your event has been created successfully",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Failed to Create Event",
        text2: "There was an error creating your event",
      });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEventInput) => {
      const response = await api.patch(`/admin/events/${data.id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mosque-events", variables.mosque_id],
      });
      Toast.show({
        type: "success",
        text1: "Event Updated Successfully",
        text2: "Your event has been updated successfully",
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      mosqueId,
    }: {
      eventId: string;
      mosqueId: string;
    }) => {
      const response = await api.delete(`/admin/events/${eventId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mosque-events", variables.mosqueId],
      });
      Toast.show({
        type: "success",
        text1: "Event Deleted Successfully",
        text2: "Your event has been deleted successfully",
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Failed to Delete Event",
        text2: "There was an error deleting your event",
      });
    },
  });
};

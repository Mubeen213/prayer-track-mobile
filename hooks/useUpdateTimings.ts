import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "../config/axios";
import { MosqueService } from "../services/mosqueService";
import { PrayerTime } from "../types/mosque";

export const useUpdateTimings = (mosqueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timings: PrayerTime[]) =>
      api.patch(`/admin/mosques/${mosqueId}/prayer-times`, {
        prayerTimings: timings,
      }),
    onSuccess: async () => {
      console.log("Prayer times updated successfully");
      // Toast.show({
      //   type: "success",
      //   text1: "Prayer Times Updated",
      //   text2: "Prayer times updated successfully",
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });

      await MosqueService.syncMosques(true);

      // Invalidate both regular and admin queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["mosque", mosqueId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-mosque", mosqueId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-mosques"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["mosques"],
        }),
      ]);
    },
    onError: () => {
      // Toast.show({
      //   type: "error",
      //   text1: "Update Failed",
      //   text2: "Failed to update prayer times",
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });
    },
  });
};

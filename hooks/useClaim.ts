import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { api } from "../config/axios";
import {
  CreateClaimRequest,
  ClaimRequest,
  ClaimRequestsResponse,
} from "../types/claim";

export const useCreateClaimRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClaimRequest) => {
      const response = await api.post("/claim-requests", data);
      return response.data;
    },
    onSuccess: () => {
      // Toast.show({
      //   type: "success",
      //   text1: "Claim Request Submitted",
      //   text2: "Your claim request has been submitted successfully",
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Failed to submit claim request";
      // Toast.show({
      //   type: "error",
      //   text1: "Submission Failed",
      //   text2: message,
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });
    },
  });
};

export const useGetClaimRequests = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["claim-requests", params],
    queryFn: async (): Promise<ClaimRequestsResponse> => {
      const response = await api.get("/claim-requests", { params });
      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMyClaimRequests = () => {
  return useQuery({
    queryKey: ["my-claims"],
    queryFn: async (): Promise<ClaimRequest[]> => {
      const response = await api.get("/claim-requests/my-claims");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      review_comment,
    }: {
      id: string;
      status: "in_review" | "approved" | "rejected";
      review_comment?: string;
    }) => {
      const response = await api.patch(`/claim-requests/${id}/status`, {
        status,
        review_comment,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const statusMessages = {
        in_review: "Claim marked as in review",
        approved: "Claim approved successfully",
        rejected: "Claim rejected",
      };

      // Toast.show({
      //   type: variables.status === "approved" ? "success" : "info",
      //   text1: "Status Updated",
      //   text2: statusMessages[variables.status],
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });

      queryClient.invalidateQueries({ queryKey: ["claim-requests"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Failed to update claim status";
      // Toast.show({
      //   type: "error",
      //   text1: "Update Failed",
      //   text2: message,
      //   visibilityTime: 3000,
      //   autoHide: true,
      // });
    },
  });
};

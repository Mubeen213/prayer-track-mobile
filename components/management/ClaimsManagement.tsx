import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  MapPin,
  User,
  Phone,
  ArrowLeft,
} from "lucide-react-native";
import { router } from "expo-router";
import {
  useGetClaimRequests,
  useUpdateClaimStatus,
} from "../../hooks/useClaim";
import { ClaimRequest } from "../../types/claim";
import { Select } from "../ui/Select";

export const ClaimsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching } = useGetClaimRequests({
    page,
    limit: 10,
    search: searchQuery,
    status: selectedStatus,
  });

  const updateStatusMutation = useUpdateClaimStatus();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const handleStatusUpdate = (
    claim: ClaimRequest,
    status: "in_review" | "approved" | "rejected"
  ) => {
    const statusActions = {
      in_review: "mark as in review",
      approved: "approve",
      rejected: "reject",
    };

    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${statusActions[status]} this claim request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: status === "rejected" ? "destructive" : "default",
          onPress: () => {
            updateStatusMutation.mutate({
              id: claim.id,
              status,
              review_comment:
                status === "rejected" ? "Rejected by admin" : undefined,
            });
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderClaimItem = ({ item }: { item: ClaimRequest }) => (
    <View className="bg-white rounded-xl p-4 mx-4 my-2 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-lg mb-1">
            {item.mosque_name}
          </Text>
          <View className="flex-row items-center mb-2">
            <MapPin size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
              {item.mosque_address}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          <Text className="text-xs font-medium capitalize">
            {item.status.replace("_", " ")}
          </Text>
        </View>
      </View>

      {/* Claimant Info */}
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <Text className="font-semibold text-gray-800 mb-2">
          Claimant Details
        </Text>
        <View className="flex-row items-center mb-1">
          <User size={14} color="#6B7280" />
          <Text className="text-sm text-gray-700 ml-2">{item.name}</Text>
        </View>
        <View className="flex-row items-center">
          <Phone size={14} color="#6B7280" />
          <Text className="text-sm text-gray-700 ml-2">
            {item.phone_number}
          </Text>
        </View>
      </View>

      {/* Message */}
      {item.message && (
        <View className="mb-3">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Message:
          </Text>
          <Text className="text-sm text-gray-600 italic">"{item.message}"</Text>
        </View>
      )}

      {/* Timestamp */}
      <View className="flex-row items-center mb-3">
        <Clock size={14} color="#6B7280" />
        <Text className="text-xs text-gray-500 ml-1">
          Submitted on {formatDate(item.created_at)}
        </Text>
      </View>

      {/* Action Buttons */}
      {item.status === "pending" && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item, "in_review")}
            className="flex-1 bg-blue-500 rounded-lg py-2 flex-row items-center justify-center"
            disabled={updateStatusMutation.isPending}
          >
            <Eye size={16} color="white" />
            <Text className="text-white font-medium ml-1">Review</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item, "approved")}
            className="flex-1 bg-green-500 rounded-lg py-2 flex-row items-center justify-center"
            disabled={updateStatusMutation.isPending}
          >
            <CheckCircle size={16} color="white" />
            <Text className="text-white font-medium ml-1">Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item, "rejected")}
            className="flex-1 bg-red-500 rounded-lg py-2 flex-row items-center justify-center"
            disabled={updateStatusMutation.isPending}
          >
            <XCircle size={16} color="white" />
            <Text className="text-white font-medium ml-1">Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "in_review" && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item, "approved")}
            className="flex-1 bg-green-500 rounded-lg py-2 flex-row items-center justify-center"
            disabled={updateStatusMutation.isPending}
          >
            <CheckCircle size={16} color="white" />
            <Text className="text-white font-medium ml-1">Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(item, "rejected")}
            className="flex-1 bg-red-500 rounded-lg py-2 flex-row items-center justify-center"
            disabled={updateStatusMutation.isPending}
          >
            <XCircle size={16} color="white" />
            <Text className="text-white font-medium ml-1">Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show reviewer info if reviewed */}
      {(item.status === "approved" || item.status === "rejected") &&
        item.reviewer_name && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs text-gray-500">
              {item.status === "approved" ? "Approved" : "Rejected"} by{" "}
              {item.reviewer_name}
              {item.reviewed_at && ` on ${formatDate(item.reviewed_at)}`}
            </Text>
            {item.review_comment && (
              <Text className="text-xs text-gray-600 mt-1 italic">
                "{item.review_comment}"
              </Text>
            )}
          </View>
        )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading claims...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Back Button */}
      <View className="px-4 py-6 bg-white border-b border-gray-200">
        {/* Back Button and Title Row */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={handleGoBack}
            className="mr-4 p-2 rounded-lg bg-gray-100"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 flex-1">
            Mosque Claims
          </Text>
        </View>

        {/* Search and Filter */}
        <View className="space-y-3">
          <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
            <Search size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Search by mosque name or phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </View>
      </View>

      {/* Claims List */}
      <FlatList
        data={data?.claims || []}
        renderItem={renderClaimItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#10B981"]}
            tintColor="#10B981"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No claims found
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              {searchQuery
                ? "Try adjusting your search or filter"
                : "No claims submitted yet"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Stats */}
      {data && (
        <View className="bg-white px-4 py-3 border-t border-gray-200">
          <Text className="text-sm text-gray-600 text-center">
            Showing {data.claims.length} of {data.pagination.total} claims
          </Text>
        </View>
      )}
    </View>
  );
};

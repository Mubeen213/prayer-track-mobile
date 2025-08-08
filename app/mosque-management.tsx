import React from "react";
import { View, Text } from "react-native";
import { MosqueAdmin } from "../components/RoleGuard";
import { MosqueManagement } from "../components/admin/MosqueManagement";

export default function MosqueManagementScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <MosqueAdmin
        fallback={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Access denied</Text>
          </View>
        }
      >
        <MosqueManagement />
      </MosqueAdmin>
    </View>
  );
}

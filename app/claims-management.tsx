import React from "react";
import { ClaimsManagement } from "../components/management/ClaimsManagement";
import { RoleGuard } from "../components/RoleGuard";
import { View, Text } from "react-native";

export default function ClaimsManagementScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <RoleGuard
        roles={["admin_approver", "super_admin"]}
        fallback={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Access denied</Text>
          </View>
        }
      >
        <ClaimsManagement />
      </RoleGuard>
    </View>
  );
}

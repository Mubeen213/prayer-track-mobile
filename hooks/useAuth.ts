import { useContext } from "react";
import { AuthContext } from "../auth-context/AuthContext";
import { AuthContextType } from "../types/auth";
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useRoles = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  return {
    roles: user?.roles || [],
    hasRole,
    hasAnyRole,
    isAdmin: hasRole("admin"),
    isSuperAdmin: hasRole("super_admin"),
    isMosqueAdmin: hasRole("mosque_admin"),
    isApprover: hasRole("admin_approver"),
  };
};

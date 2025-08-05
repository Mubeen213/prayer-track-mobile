import React from "react";
import { useAuth } from "../hooks/useAuth";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { hasRole, hasAnyRole } = useAuth();

  const hasAccess = requireAll
    ? roles.every((role) => hasRole(role))
    : hasAnyRole(roles);

  if (!hasAccess) {
    return fallback as React.ReactElement;
  }

  return <>{children}</>;
};

// Convenience components for common roles
export const AdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["admin", "super_admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const SuperAdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <RoleGuard roles={["super_admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

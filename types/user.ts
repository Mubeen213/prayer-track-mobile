export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  ADMIN_APPROVER = "admin_approver",
  MOSQUE_ADMIN = "mosque_admin",
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  profile_url?: string;
  status: string;
  roles: string[];
  provider?: string;
  platform?: string;
}

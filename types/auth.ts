import { User } from "./user";

export type AuthContextType = {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

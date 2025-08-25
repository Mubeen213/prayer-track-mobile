import { api } from "../config/axios";
import { REGISTER_USER } from "../utils/urls"
import { User } from "../types/user";

export interface RegisterUserResponse {
  user: User;
}

export class AuthService {
  static async registerUser(platform: string): Promise<User> {
    try {

      const response = await api.post<RegisterUserResponse>(REGISTER_USER, {
        platform: platform,
      });

      if (response.status === 200 || response.status === 201) {
        return response.data.user;
      } else {
        throw new Error(`Registration failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("AuthService.registerUser error:", error);
      throw error;
    }
  }

  static async fetchUserData(): Promise<User> {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("AuthService.fetchUserData error:", error);
      throw error;
    }
  }

  static async checkUserExists(): Promise<boolean> {
    try {
      const response = await api.get("/auth/me");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { router } from "expo-router";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../config/axios";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  platform: string;
  deviceId?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private readonly TOKEN_STORAGE_KEY = "expoPushToken";
  private readonly PERMISSION_ASKED_KEY = "notificationPermissionAsked";
  private readonly PERMISSION_DENIED_KEY = "notificationPermissionDenied";

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async hasAskedPermissionBefore(): Promise<boolean> {
    try {
      const asked = await AsyncStorage.getItem(this.PERMISSION_ASKED_KEY);
      return asked === "true";
    } catch {
      return false;
    }
  }

  private async markPermissionAsked(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PERMISSION_ASKED_KEY, "true");
    } catch (error) {
      console.error("Error marking permission as asked:", error);
    }
  }

  private async wasPermissionDenied(): Promise<boolean> {
    try {
      const denied = await AsyncStorage.getItem(this.PERMISSION_DENIED_KEY);
      return denied === "true";
    } catch {
      return false;
    }
  }

  private async markPermissionDenied(denied: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PERMISSION_DENIED_KEY, denied.toString());
    } catch (error) {
      console.error("Error marking permission denial:", error);
    }
  }

  private async generateToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found. Please configure EAS project.");
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return tokenData.data;
    } catch (error) {
      console.error("Error generating push token:", error);
      return null;
    }
  }

  async requestPermissionsAndGetToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      // Check if we already asked and user denied
      const alreadyAsked = await this.hasAskedPermissionBefore();
      const wasDenied = await this.wasPermissionDenied();

      if (alreadyAsked && wasDenied) {
        console.log(
          "Notification permissions previously denied, not asking again"
        );
        return null;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        if (!alreadyAsked) {
          // Only ask if we haven't asked before
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          await this.markPermissionAsked();

          if (status !== "granted") {
            await this.markPermissionDenied(true);
          }
        } else {
          console.log("Permissions not granted and already asked before");
          return null;
        }
      } else {
        // Permission is granted, clear any previous denial
        await this.markPermissionDenied(false);
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions denied");
        return null;
      }

      return await this.generateToken();
    } catch (error) {
      console.error("Error requesting permissions and getting token:", error);
      return null;
    }
  }

  async silentTokenRegistration(userId: string): Promise<boolean> {
    try {
      let token = await this.getStoredToken();

      if (token) {
        console.log("Token already exists, skipping registration");
        return true;
      }
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== "granted") {
        console.log("Notifications not granted, skipping silent registration");
        return false;
      }
      token = await this.generateToken();

      if (!token) {
        console.log("Failed to generate token for silent registration");
        return false;
      }

      // Register with server
      const success = await this.registerTokenWithServerInternal(userId, token);

      if (success) {
        // Clear any previous denial since user has granted permissions
        await this.markPermissionDenied(false);
        console.log("Silent token registration successful");
      }

      return success;
    } catch (error) {
      console.error("Error in silent token registration:", error);
      return false;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      if (this.expoPushToken) {
        return this.expoPushToken;
      }

      const storedToken = await AsyncStorage.getItem(this.TOKEN_STORAGE_KEY);
      if (storedToken) {
        this.expoPushToken = storedToken;
        return storedToken;
      }

      return null;
    } catch (error) {
      console.error("Error retrieving stored token:", error);
      return null;
    }
  }

  async registerTokenWithServer(userId: string): Promise<boolean> {
    try {
      // Check stored token first
      let token = await this.getStoredToken();

      if (!token) {
        token = await this.requestPermissionsAndGetToken();
      }

      if (!token) {
        console.log("No push token available for registration");
        return false;
      }

      return await this.registerTokenWithServerInternal(userId, token);
    } catch (error) {
      console.error("Error registering push token with server:", error);
      return false;
    }
  }

  private async registerTokenWithServerInternal(
    userId: string,
    token: string
  ): Promise<boolean> {
    try {
      const tokenData: PushNotificationToken = {
        token,
        platform: Platform.OS,
        deviceId: Device.osInternalBuildId || undefined,
      };

      const response = await api.post("/notifications/register-token", {
        userId,
        ...tokenData,
      });

      if (response.status === 200 || response.status === 201) {
        await AsyncStorage.setItem(this.TOKEN_STORAGE_KEY, token);
        this.expoPushToken = token;
        console.log("Push token registered with server successfully");
        return true;
      } else {
        throw new Error(`Server returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in server token registration:", error);
      return false;
    }
  }

  async unregisterToken(userId: string): Promise<boolean> {
    try {
      const token = await this.getStoredToken();

      if (!token) {
        return true; // Nothing to unregister
      }

      await api.delete("/notifications/unregister-token", {
        data: { userId, token },
      });

      // Clear storage after successful unregistration
      await AsyncStorage.removeItem(this.TOKEN_STORAGE_KEY);
      this.expoPushToken = null;

      console.log("Push token unregistered successfully");
      return true;
    } catch (error) {
      console.error("Error unregistering push token:", error);
      return false;
    }
  }

  // Method to clear permission state (useful for testing or settings reset)
  async resetPermissionState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.PERMISSION_ASKED_KEY);
      await AsyncStorage.removeItem(this.PERMISSION_DENIED_KEY);
      console.log("Notification permission state reset");
    } catch (error) {
      console.error("Error resetting permission state:", error);
    }
  }

  setupNotificationListeners() {
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        this.handleNotificationResponse(response);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ) {
    const { data } = response.notification.request.content;

    if (!data?.mosqueId) {
      console.warn("No mosqueId found in notification data");
      return;
    }

    const mosqueId = typeof data.mosqueId === "string" ? data.mosqueId : "";
    const type = data.type;

    switch (type) {
      case "event_updated":
      case "event_deleted":
      case "new_event":
        this.navigateToMosqueEvents(mosqueId);
        break;

      case "prayer_times_updated":
        this.navigateToMosque(mosqueId);
        break;

      default:
        this.navigateToMosque(mosqueId);
        break;
    }
  }

  private navigateToMosque(mosqueId: string) {
    try {
      console.log(`Navigate to mosque`);
      router.push(`/mosque/${mosqueId}`);
    } catch (error) {
      console.error("Error navigating to mosque:", error);
    }
  }

  private navigateToMosqueEvents(mosqueId: string) {
    try {
      console.log(`Navigating to mosque events: ${mosqueId}`);
      router.push(`/mosque/${mosqueId}?tab=events`);
    } catch (error) {
      console.error("Error navigating to mosque events:", error);
    }
  }
}

export default NotificationService.getInstance();

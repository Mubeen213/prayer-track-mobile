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

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<string | null> {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        // console.warn("Push notifications only work on physical devices");
        return null;
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("Failed to get push token for push notification!");
        return null;
      }

      // Get project ID from different possible locations
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error("Project ID not found. Please configure EAS project.");
        console.log("Constants.expoConfig:", Constants.expoConfig);
        console.log("Constants.easConfig:", Constants.easConfig);
        return null;
      }

      console.log("Using project ID:", projectId);

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = tokenData.data;

      // Store token locally
      await AsyncStorage.setItem("expoPushToken", this.expoPushToken);

      // console.log("Expo push token:", this.expoPushToken);
      return this.expoPushToken;
    } catch (error) {
      console.error("Error getting push notification token:", error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      if (this.expoPushToken) {
        return this.expoPushToken;
      }

      const storedToken = await AsyncStorage.getItem("expoPushToken");
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
      const token = (await this.getStoredToken()) || (await this.initialize());

      if (!token) {
        // console.warn("No push token available to register");
        return false;
      }

      const tokenData: PushNotificationToken = {
        token,
        platform: Platform.OS,
        deviceId: Device.osInternalBuildId || undefined,
      };

      await api.post("/notifications/register-token", {
        userId,
        ...tokenData,
      });

      console.log("Push token registered with server successfully");
      return true;
    } catch (error) {
      console.error("Error registering push token with server:", error);
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

      // Clear local storage
      await AsyncStorage.removeItem("expoPushToken");
      this.expoPushToken = null;

      console.log("Push token unregistered successfully");
      return true;
    } catch (error) {
      console.error("Error unregistering push token:", error);
      return false;
    }
  }

  setupNotificationListeners() {
    // Handle notifications received while app is foregrounded
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
        // Handle foreground notification display
      });

    // Handle notification responses (when user taps notification)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        // Handle navigation based on notification data
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
        // Navigate to mosque page - could add query params for specific sections
        this.navigateToMosqueEvents(mosqueId);
        break;

      case "prayer_times_updated":
        // Navigate to mosque page
        this.navigateToMosque(mosqueId);
        break;

      default:
        // Fallback to general mosque page
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

  // async scheduleLocalNotification(title: string, body: string, data?: any) {
  //   try {
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title,
  //         body,
  //         data,
  //       },
  //       trigger: { type: Notifications.TriggerType.TIME_INTERVAL, seconds: 1 },
  //     });
  //   } catch (error) {
  //     console.error("Error scheduling local notification:", error);
  //   }
  // }
}

export default NotificationService.getInstance();

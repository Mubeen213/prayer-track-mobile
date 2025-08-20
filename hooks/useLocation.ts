import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<LocationData | null>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      console.log(`Location service is ${enabled}`);
      if (!enabled) {
        const errorMsg = "Location services disabled";
        setError(errorMsg);
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to find nearby mosques.",
          [{ text: "OK" }]
        );
        return null; // Return null instead of throwing
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log(`Location permission status: ${status}`);
        const errorMsg = "Location permission denied";
        setError(errorMsg);
        Alert.alert(
          "Permission Required",
          "Location permission is required to find nearby mosques. Please enable it in app settings.",
          [{ text: "OK" }]
        );
        return null; // Return null instead of throwing
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(locationData);
      return locationData;
    } catch (err) {
      console.error("Location error:", err);

      // Only show generic error alert for unexpected errors (GPS issues, etc.)
      if (
        err instanceof Error &&
        !err.message.includes("permission") &&
        !err.message.includes("services")
      ) {
        const errorMsg = "Failed to get location";
        setError(errorMsg);
        Alert.alert(
          "Location Error",
          "Unable to get your current location. Please check your GPS and try again.",
          [{ text: "OK" }]
        );
      }

      return null; // Return null instead of throwing
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    requestLocation,
  };
};

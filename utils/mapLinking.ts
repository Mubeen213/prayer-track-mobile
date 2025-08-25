import { Platform, Linking, Alert } from "react-native";

export const openMaps = async (lat: number, lng: number): Promise<void> => {
  // Correct Apple Maps deep link
  const appleMapsUrl = `maps://?ll=${lat},${lng}`;
  // Android geo URI
  const androidGeoUrl = `geo:${lat},${lng}?q=${lat},${lng}`;
  // Web fallback (Google Maps)
  const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const url = Platform.select({
    ios: appleMapsUrl,
    android: androidGeoUrl,
    default: googleMapsWebUrl,
  });

  try {
    if (url) {
      console.log("Opening maps with URL:", url);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(googleMapsWebUrl);
      } else {
        await Linking.openURL(googleMapsWebUrl); 
      }
    }
  } catch (err) {
    Alert.alert("Error", "Unable to open maps");
  }
};

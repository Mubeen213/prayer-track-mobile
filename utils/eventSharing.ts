import { Alert, Share, Platform } from "react-native";
import { Event } from "../types/event";
import { convert24to12 } from "./timeConversions";

export const handleShare = async (
  event: Event,
  mosqueId: string,
  mosqueName: string
) => {
  try {
    // Validate required data
    if (!event?.id || !event?.title) {
      Alert.alert("Error", "Event information is incomplete");
      return;
    }

    // Format the message
    const eventMessage = [
      `🕌 *${event.title}*`,
      `📍 ${mosqueName || "Location TBD"}`,
      "",
      `📅 Date: ${event.event_date}`,
      `⏰ Time: ${convert24to12(event.event_time)}`,
      event.scholar ? `👨‍🏫 Speaker: ${event.scholar}` : "",
      event.description ? `\n📝 ${event.description}` : "",
      "",
      "Join us for this special event! 🤲",
    ]
      .filter(Boolean)
      .join("\n");

    const shareOptions = {
      message: eventMessage,
      title: `${event.title} - ${mosqueName}`,
    };

    const result = await Share.share(shareOptions);

    // Optional: Track sharing analytics
    if (result.action === Share.sharedAction) {
      console.log("Event shared successfully");
      // Add analytics tracking here if needed
    }
  } catch (error) {
    console.error("Error sharing event:", error);

    // Provide user-friendly error messages
    let errorMessage = "Failed to share event";
    if (error instanceof Error) {
      if (error.message.includes("cancelled")) {
        return; // User cancelled, don't show error
      }
      errorMessage = "Unable to open share menu";
    }

    Alert.alert("Error", errorMessage);
  }
};

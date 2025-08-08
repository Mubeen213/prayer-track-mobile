import { Feature } from "../components/common/FeatureCard";

export const features: Feature[] = [
  {
    title: "Mosques",
    description: "Find and track local mosques",
    icon: "business",
    link: "/mosque",
    gradient: ["#d1fae5", "#6ee7b7"], // from-emerald-100 to-emerald-300
    iconGradient: ["#059669", "#047857"], // from-emerald-600 to-emerald-700
  },
  {
    title: "Quran",
    description: "Read the Holy Quran",
    icon: "book",
    link: "/quran",
    gradient: ["#dbeafe", "#93c5fd"], // from-blue-100 to-blue-300
    iconGradient: ["#2563eb", "#1d4ed8"], // from-blue-600 to-blue-700
  },
  {
    title: "Duas",
    description: "Learn & Memorize Quranic Duas",
    icon: "library",
    link: "/duas",
    gradient: ["#e9d5ff", "#c4b5fd"], // from-violet-200 to-violet-300
    iconGradient: ["#7c3aed", "#6d28d9"], // from-violet-600 to-violet-700
  },
  {
    title: "Favorites",
    description: "Your saved mosques",
    icon: "bookmark",
    link: "/favorite",
    gradient: ["#fce7f3", "#f9a8d4"], // from-pink-100 to-pink-300
    iconGradient: ["#db2777", "#be185d"], // from-pink-600 to-pink-700
  },
];

export const adminFeatures: Feature[] = [
  {
    title: "Mosque Claims",
    description: "Review and manage mosque ownership claims from users",
    icon: "documents",
    link: "/claims-management",
    gradient: ["#8B5CF6", "#7C3AED", "#6D28D9"],
    iconGradient: ["#EDE9FE", "#DDD6FE"],
  },
  {
    title: "Mosque Management",
    description: "Manage your mosque details and settings",
    icon: "business",
    link: "/mosque-management",
    gradient: ["#d1fae5", "#6ee7b7"], // from-emerald-100 to-emerald-300
    iconGradient: ["#059669", "#047857"], // from-emerald-600 to-emerald-700
  },
];

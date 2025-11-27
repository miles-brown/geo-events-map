/**
 * Comprehensive category and subcategory hierarchy for geo-located events
 */

export interface CategoryConfig {
  id: string;
  label: string;
  color: string;
  icon: string;
  subcategories: SubcategoryConfig[];
}

export interface SubcategoryConfig {
  id: string;
  label: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "crime",
    label: "Crime",
    color: "#ef4444", // red
    icon: "🚨",
    subcategories: [
      { id: "fights", label: "Fights" },
      { id: "robbery", label: "Robbery" },
      { id: "altercations", label: "Altercations" },
      { id: "brawls", label: "Brawls" },
      { id: "pickpockets", label: "Pickpockets" },
      { id: "shoplifting", label: "Shoplifting" },
      { id: "antisocial", label: "Antisocial Behavior" },
      { id: "arson", label: "Arson" },
    ],
  },
  {
    id: "transport",
    label: "Transport",
    color: "#f97316", // orange
    icon: "🚗",
    subcategories: [
      { id: "road_collision", label: "Road Collision" },
      { id: "bus_altercations", label: "Bus Altercations" },
      { id: "bus", label: "Bus" },
      { id: "railways", label: "Railways/Train" },
      { id: "tram", label: "Tram" },
      { id: "underground", label: "London Underground" },
      { id: "cyclist", label: "Cyclist" },
      { id: "bus_fire", label: "Bus Fire" },
      { id: "vehicle_fire", label: "Vehicle Fire" },
    ],
  },
  {
    id: "fire",
    label: "Fire",
    color: "#dc2626", // dark red
    icon: "🔥",
    subcategories: [
      { id: "building_fire", label: "Building Fire" },
      { id: "vehicle_fire", label: "Vehicle Fire" },
      { id: "wildfire", label: "Wildfire" },
      { id: "arson", label: "Arson" },
      { id: "explosion", label: "Explosion" },
    ],
  },
  {
    id: "emergency",
    label: "Emergency",
    color: "#dc2626", // red
    icon: "🚨",
    subcategories: [
      { id: "medical", label: "Medical Emergency" },
      { id: "evacuation", label: "Evacuation" },
      { id: "rescue", label: "Rescue Operation" },
      { id: "hazmat", label: "Hazmat Incident" },
    ],
  },
  {
    id: "weather",
    label: "Weather",
    color: "#0ea5e9", // sky blue
    icon: "⛈️",
    subcategories: [
      { id: "thunderstorms", label: "Thunderstorms" },
      { id: "flooding", label: "Flooding" },
      { id: "extreme_weather", label: "Extreme Weather" },
      { id: "ice_snow", label: "Ice/Snow" },
      { id: "fog", label: "Fog/Visibility Issues" },
      { id: "heatwave", label: "Heatwave" },
      { id: "wind", label: "High Winds" },
    ],
  },
  {
    id: "social_media",
    label: "Social Media",
    color: "#8b5cf6", // purple
    icon: "📱",
    subcategories: [
      { id: "influencer", label: "Influencer Content" },
      { id: "viral", label: "Viral Video" },
      { id: "prank", label: "Prank" },
      { id: "challenge", label: "Challenge" },
      { id: "attention_seeking", label: "Attention Seeking" },
    ],
  },
  {
    id: "public_event",
    label: "Public Event",
    color: "#eab308", // yellow
    icon: "📢",
    subcategories: [
      { id: "protest", label: "Protest" },
      { id: "demonstration", label: "Demonstration" },
      { id: "gathering", label: "Gathering" },
      { id: "concert", label: "Concert" },
      { id: "flashmob", label: "Flashmob" },
      { id: "parade", label: "Parade" },
      { id: "festival", label: "Festival" },
    ],
  },
  {
    id: "celebrity",
    label: "Celebrity",
    color: "#ec4899", // pink
    icon: "⭐",
    subcategories: [
      { id: "spotted", label: "Celebrity Spotted" },
      { id: "public_figure", label: "Public Figure" },
      { id: "viral_sighting", label: "Viral Sighting" },
      { id: "meet_greet", label: "Meet & Greet" },
    ],
  },
  {
    id: "strange",
    label: "Strange",
    color: "#06b6d4", // cyan
    icon: "❓",
    subcategories: [
      { id: "bizarre", label: "Bizarre" },
      { id: "weird", label: "Weird" },
      { id: "unexplained", label: "Unexplained" },
      { id: "myths_legends", label: "Myths & Legends" },
      { id: "unknown", label: "Unknown" },
      { id: "unusual", label: "Unusual" },
    ],
  },
  {
    id: "construction",
    label: "Construction",
    color: "#f59e0b", // amber
    icon: "🏗️",
    subcategories: [
      { id: "demolition", label: "Demolition" },
      { id: "building", label: "Building Work" },
      { id: "roadworks", label: "Roadworks" },
      { id: "accident", label: "Construction Accident" },
      { id: "crane", label: "Crane Operation" },
    ],
  },
  {
    id: "accident",
    label: "Accident",
    color: "#f97316", // orange
    icon: "⚠️",
    subcategories: [
      { id: "injury", label: "Injury" },
      { id: "property_damage", label: "Property Damage" },
      { id: "slip_fall", label: "Slip/Fall" },
      { id: "workplace", label: "Workplace Accident" },
      { id: "public_space", label: "Public Space" },
    ],
  },
];

export const TIME_PERIODS = [
  { id: "month", label: "Latest Month" },
  { id: "6months", label: "Latest 6 Months" },
  { id: "year", label: "Latest Year" },
  { id: "5years", label: "Latest 5 Years" },
  { id: "10years", label: "Latest 10 Years" },
  { id: "all", label: "All Time" },
] as const;

export type TimePeriod = typeof TIME_PERIODS[number]["id"];

// Helper function to get all category IDs
export function getAllCategoryIds(): string[] {
  return CATEGORIES.map(cat => cat.id);
}

// Helper function to get all subcategory IDs for a category
export function getSubcategoryIds(categoryId: string): string[] {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.subcategories.map(sub => sub.id) : [];
}

// Helper function to get category by ID
export function getCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get subcategory label
export function getSubcategoryLabel(categoryId: string, subcategoryId: string): string | undefined {
  const category = getCategoryById(categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === subcategoryId);
  return subcategory?.label;
}

import { LONDON_BOROUGHS } from "@shared/boroughs";

/**
 * Reverse geocode coordinates to get London Borough
 * Uses Nominatim OpenStreetMap API (free, no API key required)
 */
export async function detectBorough(
  latitude: number,
  longitude: number
): Promise<{ borough: string | null; confidence: "high" | "medium" | "low" }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "GeoEventsMap/1.0",
        },
      }
    );

    if (!response.ok) {
      return { borough: null, confidence: "low" };
    }

    const data = await response.json();
    const address = data.address || {};

    // Try to match borough from various address fields
    const possibleBoroughNames = [
      address.city_district,
      address.suburb,
      address.neighbourhood,
      address.municipality,
      address.county,
    ].filter(Boolean);

    // Try to find a match in our borough list
    for (const name of possibleBoroughNames) {
      const normalizedName = name.toLowerCase().trim();
      
      // Direct match
      const directMatch = LONDON_BOROUGHS.find(
        (b) => b.toLowerCase() === normalizedName
      );
      if (directMatch) {
        return { borough: directMatch, confidence: "high" };
      }

      // Partial match (e.g., "London Borough of Westminster" -> "Westminster")
      const partialMatch = LONDON_BOROUGHS.find((b) =>
        normalizedName.includes(b.toLowerCase())
      );
      if (partialMatch) {
        return { borough: partialMatch, confidence: "medium" };
      }
    }

    // Check if we're in Greater London at least
    if (
      address.county?.toLowerCase().includes("london") ||
      address.state?.toLowerCase().includes("london")
    ) {
      return { borough: null, confidence: "medium" };
    }

    return { borough: null, confidence: "low" };
  } catch (error) {
    console.error("Geocoding error:", error);
    return { borough: null, confidence: "low" };
  }
}

/**
 * Get coordinates from address string
 */
export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address + ", London, UK"
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "GeoEventsMap/1.0",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

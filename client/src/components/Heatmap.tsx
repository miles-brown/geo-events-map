import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { Event } from "../../../drizzle/schema";

interface HeatmapProps {
  map: L.Map | null;
  events: Event[];
  enabled: boolean;
  intensity: number;
}

export default function Heatmap({ map, events, enabled, intensity }: HeatmapProps) {
  useEffect(() => {
    if (!map || !enabled || events.length === 0) {
      return;
    }

    // Convert events to heatmap data points [lat, lon, intensity]
    const heatData: [number, number, number][] = events.map((event) => [
      typeof event.latitude === 'string' ? parseFloat(event.latitude) : event.latitude,
      typeof event.longitude === 'string' ? parseFloat(event.longitude) : event.longitude,
      1, // Base intensity for each event
    ]);

    // Create heatmap layer
    const heatLayer = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: intensity,
      gradient: {
        0.0: "blue",
        0.2: "cyan",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    // Add to map
    heatLayer.addTo(map);

    // Cleanup on unmount or when disabled
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, events, enabled, intensity]);

  return null; // This component doesn't render anything itself
}

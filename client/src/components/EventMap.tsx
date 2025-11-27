import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Event } from "../../../drizzle/schema";

interface EventMapProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedEventId?: number;
}

// Category color mapping
const categoryColors: Record<string, string> = {
  crime: "#ef4444", // red
  accident: "#f97316", // orange
  paranormal: "#8b5cf6", // purple
  protest: "#eab308", // yellow
  strange: "#06b6d4", // cyan
  default: "#3b82f6", // blue
};

// Category icon mapping (using emoji/symbols)
const categoryIcons: Record<string, string> = {
  crime: "🚨",
  accident: "⚠️",
  paranormal: "👻",
  protest: "📢",
  strange: "❓",
  default: "📍",
};

// Create custom colored marker icon
function createColoredIcon(category: string): DivIcon {
  const color = categoryColors[category] || categoryColors.default;
  const icon = categoryIcons[category] || categoryIcons.default;
  
  return new DivIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" 
                fill="${color}" 
                stroke="#ffffff" 
                stroke-width="2"/>
        </svg>
        <div style="
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          line-height: 1;
        ">${icon}</div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

export default function EventMap({ events, onEventClick, selectedEventId }: EventMapProps) {
  // Default center on London
  const defaultCenter: LatLngExpression = [51.5074, -0.1278];
  const defaultZoom = 11;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => {
        const lat = parseFloat(event.latitude);
        const lng = parseFloat(event.longitude);
        
        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }

        const customIcon = createColoredIcon(event.category);

        return (
          <Marker
            key={event.id}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onEventClick(event),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{categoryIcons[event.category] || categoryIcons.default}</span>
                  <h3 className="font-semibold text-sm">{event.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{event.locationName}</p>
                <p className="text-xs">{event.description.substring(0, 100)}...</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

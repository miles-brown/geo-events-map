import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Event } from "../../../drizzle/schema";

// Fix for default marker icon in Leaflet with webpack/vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface EventMapProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedEventId?: number;
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

        return (
          <Marker
            key={event.id}
            position={[lat, lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onEventClick(event),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
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

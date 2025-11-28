import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { Event } from "../../../drizzle/schema";
import { getCategoryById } from "@shared/categories";
import { soundEffects } from "@/lib/sounds";

interface EventMapProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

export default function EventMapNew({ events, selectedEvent, onEventSelect }: EventMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([51.5074, -0.1278], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Initialize marker cluster group
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      animateAddingMarkers: true,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = "small";
        let className = "marker-cluster-small";
        
        if (count > 10) {
          size = "medium";
          className = "marker-cluster-medium";
        }
        if (count > 20) {
          size = "large";
          className = "marker-cluster-large";
        }

        return L.divIcon({
          html: `<div class="cluster-inner"><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Create custom pin icon
  const createPinIcon = (event: Event, isSelected: boolean) => {
    const category = getCategoryById(event.category);
    const color = category?.color || "#06b6d4";
    const icon = category?.icon || "📍";
    
    const scale = isSelected ? 1.3 : 1;
    const zIndex = isSelected ? 1000 : 500;

    return L.divIcon({
      html: `
        <div class="custom-pin ${isSelected ? 'selected' : ''}" style="--pin-color: ${color};">
          <div class="pin-head">
            <span class="pin-icon">${icon}</span>
          </div>
          <div class="pin-point"></div>
          ${isSelected ? '<div class="pin-pulse"></div>' : ''}
        </div>
      `,
      className: "custom-pin-container",
      iconSize: [40 * scale, 50 * scale],
      iconAnchor: [20 * scale, 50 * scale],
      popupAnchor: [0, -50 * scale],
    });
  };

  // Update markers when events change
  useEffect(() => {
    if (!mapRef.current || !clusterGroupRef.current) return;

    const map = mapRef.current;
    const clusterGroup = clusterGroupRef.current;

    // Clear existing markers
    clusterGroup.clearLayers();
    markersRef.current.clear();

    // Add new markers
    events.forEach((event) => {
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedEvent?.id === event.id;
      const icon = createPinIcon(event, isSelected);

      const marker = L.marker([lat, lng], { icon });

      marker.on("click", () => {
        soundEffects.select();
        onEventSelect(event);
        
        // Smooth pan to marker with animation
        map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
          animate: true,
          duration: 0.8,
          easeLinearity: 0.25,
        });
      });

      // Add hover effect
      marker.on("mouseover", (e) => {
        soundEffects.hover();
        (e.target as L.Marker).getElement()?.classList.add("hovered");
      });

      marker.on("mouseout", (e) => {
        (e.target as L.Marker).getElement()?.classList.remove("hovered");
      });

      clusterGroup.addLayer(marker);
      markersRef.current.set(event.id, marker);
    });
  }, [events, selectedEvent, onEventSelect]);

  // Update selected marker appearance
  useEffect(() => {
    if (!selectedEvent || !mapRef.current) return;

    const map = mapRef.current;
    
    // Update all markers
    markersRef.current.forEach((marker, eventId) => {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const isSelected = eventId === selectedEvent.id;
      const icon = createPinIcon(event, isSelected);
      marker.setIcon(icon);
    });

    // Pan to selected event
    const lat = parseFloat(selectedEvent.latitude);
    const lng = parseFloat(selectedEvent.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [selectedEvent, events]);

  return (
    <>
      <div ref={mapContainerRef} className="w-full h-full" />
      <style>{`
        .custom-pin-container {
          background: transparent;
          border: none;
        }

        .custom-pin {
          position: relative;
          width: 40px;
          height: 50px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }

        .custom-pin.selected {
          transform: scale(1.3);
          filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
          z-index: 1000 !important;
        }

        .custom-pin:hover {
          transform: scale(1.15);
          filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
        }

        .pin-head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          background: var(--pin-color);
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          font-size: 16px;
          line-height: 1;
        }

        .pin-point {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 8px solid var(--pin-color);
        }

        .pin-pulse {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--pin-color);
          opacity: 0.6;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-50%) scale(1.8);
            opacity: 0;
          }
        }

        .marker-cluster {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(59, 130, 246, 0.5);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .marker-cluster:hover {
          transform: scale(1.1);
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.4);
        }

        .marker-cluster-small {
          width: 40px;
          height: 40px;
        }

        .marker-cluster-medium {
          width: 50px;
          height: 50px;
        }

        .marker-cluster-large {
          width: 60px;
          height: 60px;
        }

        .cluster-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cluster-inner span {
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .marker-cluster-medium .cluster-inner span {
          font-size: 16px;
        }

        .marker-cluster-large .cluster-inner span {
          font-size: 18px;
        }

        .leaflet-container {
          background: #0f172a;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </>
  );
}

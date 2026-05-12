import { useEffect, useRef } from "react";

interface MapProps {
  currentLocation: {
    lat: number;
    lng: number;
  };
  locationName: string;
  routeHistory: Array<{
    lat: number;
    lng: number;
    location: string;
    status: string;
  }>;
}

const TrackingMap = ({ currentLocation, locationName, routeHistory }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Check if map library is already loaded
    if (window.L === undefined) {
      // Load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup map instance
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || mapInstance.current) return;

    const L = window.L;

    // Create map
    mapInstance.current = L.map(mapContainer.current).setView(
      [currentLocation.lat, currentLocation.lng],
      6
    );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Add current location marker (green)
    L.circleMarker([currentLocation.lat, currentLocation.lng], {
      radius: 10,
      fillColor: "#00a8e8",
      color: "#001a4d",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.8,
    })
      .addTo(mapInstance.current)
      .bindPopup(
        `<div class="font-semibold text-primary">${locationName}</div><div class="text-sm text-gray-600">Current Location</div>`,
        { closeButton: false }
      )
      .openPopup();

    // Add route history points and polyline
    if (routeHistory.length > 1) {
      const routeCoordinates = routeHistory.map((point) => [
        point.lat,
        point.lng,
      ]);

      // Draw route polyline
      L.polyline(routeCoordinates, {
        color: "#001a4d",
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1,
        dashArray: "5, 5",
      }).addTo(mapInstance.current);

      // Add markers for each waypoint
      routeHistory.forEach((point, index) => {
        const isCurrentLocation = index === routeHistory.length - 1;
        const markerColor = isCurrentLocation ? "#00a8e8" : "#f39c12";
        const isStartingPoint = index === 0;

        const markerIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full font-semibold text-white" 
                 style="background-color: ${markerColor}; border: 2px solid #001a4d;">
              ${index + 1}
            </div>
          `,
          iconSize: [32, 32],
          className: "custom-marker",
        });

        L.marker([point.lat, point.lng], { icon: markerIcon })
          .addTo(mapInstance.current)
          .bindPopup(
            `
            <div class="p-2">
              <div class="font-semibold text-primary">${point.location}</div>
              <div class="text-xs text-gray-600">${point.status}</div>
              <div class="text-xs text-gray-500 mt-1">Stop ${index + 1}</div>
            </div>
          `,
            { closeButton: false }
          );
      });

      // Fit bounds to all markers
      const bounds = L.latLngBounds(routeCoordinates);
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg border-2 border-primary/20 overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
};

export default TrackingMap;

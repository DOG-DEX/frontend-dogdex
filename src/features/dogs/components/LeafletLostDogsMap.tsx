"use client";

import { useEffect, useRef } from "react";
import type { BackendDogDoc } from "../services/dogs.service";

type LostDogMapItem = BackendDogDoc & {
  isLost?: boolean;
  lastSeenLocation?: string;
  ownerPhone?: string;
  latitude?: number;
  longitude?: number;
};

type LeafletLostDogsMapProps = {
  dogs: LostDogMapItem[];
  userLocation: { lat: number; lng: number } | null;
  selectedDogId?: string | null;
  onSelectDog?: (id: string) => void;
};

// Helper: Convert Lat/Lng to Mercator Tile Coordinates at Zoom level Z
function latLngToTileXY(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

// Helper: Pre-fetch 3x3 tile grid for a target (lat, lng) at Zoom 13 (50% Radar) into RAM
function prefetchLocationTiles(lat: number, lng: number, zoom = 13) {
  if (typeof window === "undefined") return;
  const { x, y } = latLngToTileXY(lat, lng, zoom);
  const subdomains = ["a", "b", "c", "d"];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const tileX = x + dx;
      const tileY = y + dy;
      const sub = subdomains[Math.abs(tileX + tileY) % subdomains.length];
      const tileUrl = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tileX}/${tileY}.png`;

      const img = new Image();
      img.src = tileUrl;
    }
  }
}

export default function LeafletLostDogsMap({
  dogs,
  userLocation,
  selectedDogId,
  onSelectDog,
}: LeafletLostDogsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  const prefetchedDogsSetRef = useRef<Set<string>>(new Set());

  // 1. Initialize Map Instance with locked discrete zoom steps & regional bounding box
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    import("leaflet").then((L) => {
      if (!isMounted || mapInstanceRef.current || !mapContainerRef.current) return;

      const initialLat = userLocation?.lat || 21.028511;
      const initialLng = userLocation?.lng || 105.854444;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        minZoom: 5, // Allow zooming out to nationwide / regional map
        maxZoom: 18, // Allow zooming in to high precision street level
        zoomSnap: 1, // LOCK DISCRETE INTEGRAL ZOOM SNAP (% Discrete Steps)
        zoomDelta: 1,
        wheelPxPerZoomLevel: 120, // Prevents micro-scroll re-rendering churn
        zoomControl: false,
        preferCanvas: true, // Direct GPU canvas rendering
        fadeAnimation: false, // Instant tile display
        zoomAnimation: true,
        markerZoomAnimation: true,
        bounceAtZoomLimits: true,
      });

      // Fast CartoDB Voyager Tile layer with 16-tile RAM pre-buffering
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          minZoom: 5,
          maxZoom: 18,
          keepBuffer: 16, // Pre-cache 16 tile rings in RAM around user position
          updateWhenIdle: false,
          updateWhenZooming: false,
        }
      ).addTo(map);

      mapInstanceRef.current = map;

      // Force Leaflet to recalculate container size immediately
      const invalidate = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      requestAnimationFrame(invalidate);
      setTimeout(invalidate, 100);
      setTimeout(invalidate, 300);

      // Attach ResizeObserver to container
      if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          invalidate();
        });
        resizeObserver.observe(mapContainerRef.current);
      }
    });

    return () => {
      isMounted = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // 2. Pre-fetch 50% Zoom (Zoom 13) Map Tiles for Top 5 Nearest Dogs
  useEffect(() => {
    if (!dogs || dogs.length === 0) return;

    const baseLat = userLocation?.lat || 21.028511;
    const baseLng = userLocation?.lng || 105.854444;

    // Calculate distance from user/center position
    const sortedByDistance = [...dogs]
      .map((dog, idx) => {
        const fallbackCoords = [
          { lat: 21.028511 + idx * 0.012, lng: 105.854444 + idx * 0.01 },
          { lat: 10.776889 - idx * 0.01, lng: 106.700806 + idx * 0.012 },
          { lat: 16.054407 + idx * 0.008, lng: 108.202167 - idx * 0.008 },
        ];
        const lat = dog.latitude || fallbackCoords[idx % 3].lat;
        const lng = dog.longitude || fallbackCoords[idx % 3].lng;
        const dist = Math.hypot(lat - baseLat, lng - baseLng);
        return { dog, lat, lng, dist };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5); // Select top 5 nearest dogs

    // Pre-fetch tiles for top 5 nearest dogs into RAM cache
    sortedByDistance.forEach(({ dog, lat, lng }) => {
      if (!prefetchedDogsSetRef.current.has(dog.id)) {
        prefetchedDogsSetRef.current.add(dog.id);
        prefetchLocationTiles(lat, lng, 13); // Pre-fetch 50% Radar Zoom 13
        prefetchLocationTiles(lat, lng, 15); // Pre-fetch 100% Street Zoom 15
      }
    });
  }, [dogs, userLocation]);

  // 3. Real-Time Marker Synchronization
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Synchronize User GPS Location Pin
      if (userLocation) {
        if (!userMarkerRef.current) {
          const userIcon = L.divIcon({
            className: "custom-user-pin",
            html: `
              <div style="
                width: 26px;
                height: 26px;
                background-color: #00A170;
                border: 3px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 12px rgba(0, 161, 112, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
              ">📍</div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });
          userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon,
          }).addTo(map);
        } else {
          userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        }
      }

      // Synchronize Lost Dog Pins
      const currentKeys = new Set(Object.keys(markersRef.current));
      const newKeys = new Set(dogs.map((d) => d.id));

      currentKeys.forEach((key) => {
        if (!newKeys.has(key)) {
          markersRef.current[key].remove();
          delete markersRef.current[key];
        }
      });

      dogs.forEach((dog, idx) => {
        const fallbackCoords = [
          { lat: 21.028511 + idx * 0.012, lng: 105.854444 + idx * 0.01 },
          { lat: 10.776889 - idx * 0.01, lng: 106.700806 + idx * 0.012 },
          { lat: 16.054407 + idx * 0.008, lng: 108.202167 - idx * 0.008 },
        ];
        const lat = dog.latitude || fallbackCoords[idx % 3].lat;
        const lng = dog.longitude || fallbackCoords[idx % 3].lng;
        const isSelected = dog.id === selectedDogId;

        const dogIcon = L.divIcon({
          className: "custom-dog-pin",
          html: `
            <div style="
              background-color: ${isSelected ? "#FF3B30" : "#D97706"};
              border: 3px solid #232B26;
              border-radius: 16px;
              padding: 3px 8px;
              font-family: monospace;
              font-weight: 900;
              font-size: 11px;
              color: #ffffff;
              box-shadow: 3px 3px 0px #232B26;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
              transition: transform 0.15s ease;
            ">
              <span>🐕</span>
              <span>${dog.name}</span>
            </div>
          `,
          iconSize: [100, 32],
          iconAnchor: [50, 16],
        });

        if (markersRef.current[dog.id]) {
          markersRef.current[dog.id].setLatLng([lat, lng]);
          markersRef.current[dog.id].setIcon(dogIcon);
        } else {
          const marker = L.marker([lat, lng], { icon: dogIcon }).addTo(map);
          marker.on("click", () => {
            if (onSelectDog) onSelectDog(dog.id);
          });
          markersRef.current[dog.id] = marker;
        }

        if (isSelected && map) {
          map.panTo([lat, lng], { animate: true, duration: 0.3 });
        }
      });
    });
  }, [dogs, userLocation, selectedDogId, onSelectDog]);

  const handleSetZoomStep = (targetZoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(targetZoom, { animate: true });
    }
  };

  return (
    <div className="relative h-full w-full bg-[#1A221E] overflow-hidden">
      <div
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full z-10"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Discrete Zoom Scale Snap Controls (% Preset Buttons) */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-1.5 font-mono text-[11px] font-black">
        <button
          type="button"
          onClick={() => handleSetZoomStep(15)}
          className="rounded-xl border-2 border-[#232B26] bg-white px-3 py-1.5 text-[#232B26] shadow-[2px_2px_0px_#232B26] hover:bg-[#85E0C0]"
        >
          100% (Block)
        </button>
        <button
          type="button"
          onClick={() => handleSetZoomStep(13)}
          className="rounded-xl border-2 border-[#232B26] bg-white px-3 py-1.5 text-[#232B26] shadow-[2px_2px_0px_#232B26] hover:bg-[#85E0C0]"
        >
          50% (Radar)
        </button>
        <button
          type="button"
          onClick={() => handleSetZoomStep(11)}
          className="rounded-xl border-2 border-[#232B26] bg-white px-3 py-1.5 text-[#232B26] shadow-[2px_2px_0px_#232B26] hover:bg-[#85E0C0]"
        >
          25% (City)
        </button>
      </div>
    </div>
  );
}

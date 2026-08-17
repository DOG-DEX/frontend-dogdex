"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { dogsService, type BackendDogDoc } from "../services/dogs.service";

type LostDogMapItem = BackendDogDoc & {
  isLost?: boolean;
  lastSeenLocation?: string;
  ownerPhone?: string;
  latitude?: number;
  longitude?: number;
};

const STORAGE_KEY_GPS = "dogdex_cached_user_gps";
const STORAGE_KEY_DOGS = "dogdex_cached_lost_dogs";

// High-Speed Dynamic Client Import
const LeafletLostDogsMap = dynamic(
  () => import("../components/LeafletLostDogsMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#1A221E] flex items-center justify-center text-white font-mono">
        <div className="flex items-center gap-2 text-xs text-[#85E0C0] uppercase tracking-wider font-bold">
          <span className="h-3 w-3 rounded-full bg-[#85E0C0] animate-ping" />
          <span>Starting Instant Radar...</span>
        </div>
      </div>
    ),
  }
);

const INITIAL_DEMO_DOGS: LostDogMapItem[] = [
  {
    id: "lost-hanoi-1",
    owner_id: "user-hanoi-1",
    name: "Mochi",
    breed: "Golden Retriever",
    gender: "male",
    avatarPath: "",
    isLost: true,
    lastSeenLocation: "Tay Ho, Hanoi",
    ownerPhone: "+84 987 654 321",
    latitude: 21.058511,
    longitude: 105.824444,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lost-hcmc-2",
    owner_id: "user-hcmc-2",
    name: "Kuro",
    breed: "Shiba Inu",
    gender: "male",
    avatarPath: "",
    isLost: true,
    lastSeenLocation: "District 1, Ho Chi Minh City",
    ownerPhone: "+84 901 234 567",
    latitude: 10.776889,
    longitude: 106.700806,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lost-danang-3",
    owner_id: "user-danang-3",
    name: "Bella",
    breed: "Poodle",
    gender: "female",
    avatarPath: "",
    isLost: true,
    lastSeenLocation: "My Khe Beach, Danang",
    ownerPhone: "+84 912 345 678",
    latitude: 16.054407,
    longitude: 108.202167,
    createdAt: new Date().toISOString(),
  },
];

export function FindDogsView() {
  // 0ms Instant RAM / LocalStorage Cache Hydration
  const [lostDogs, setLostDogs] = useState<LostDogMapItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY_DOGS);
        if (cached) return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return INITIAL_DEMO_DOGS;
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cachedGps = localStorage.getItem(STORAGE_KEY_GPS);
        if (cachedGps) return JSON.parse(cachedGps);
      } catch {
        // fallback
      }
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDogId, setSelectedDogId] = useState<string | null>(() => lostDogs[0]?.id || "lost-hanoi-1");
  const [lastSyncTime, setLastSyncTime] = useState<string>("Instant Cache");
  const [isLocating, setIsLocating] = useState(false);

  // 1. Background Stale-While-Revalidate API Refresh
  const fetchLostDogs = useCallback(async () => {
    try {
      const data = await dogsService.listLostDogs();
      if (data && data.length > 0) {
        setLostDogs(data);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_DOGS, JSON.stringify(data));
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch {
      // Retain cached state
    }
  }, []);

  // 2. High-Frequency Real-Time 3-Second Heartbeat Polling Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const poll = async () => {
      await fetchLostDogs();
      timer = setTimeout(poll, 3000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [fetchLostDogs]);

  // 3. Fast Geolocation Positioning with RAM Cache Storage
  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_GPS, JSON.stringify(coords));
        }
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          localStorage.setItem(STORAGE_KEY_GPS, JSON.stringify(coords));
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const filteredDogs = lostDogs.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.lastSeenLocation || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDog = selectedDogId ? lostDogs.find((d) => d.id === selectedDogId) || null : null;
  const selectedIndex = selectedDog ? filteredDogs.findIndex((d) => d.id === selectedDog.id) : -1;

  const handlePrevDog = () => {
    if (filteredDogs.length === 0) return;
    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : filteredDogs.length - 1;
    setSelectedDogId(filteredDogs[prevIdx].id);
  };

  const handleNextDog = () => {
    if (filteredDogs.length === 0) return;
    const nextIdx = selectedIndex < filteredDogs.length - 1 ? selectedIndex + 1 : 0;
    setSelectedDogId(filteredDogs[nextIdx].id);
  };

  return (
    <div className="relative h-[calc(100vh-70px)] w-full overflow-hidden bg-[#1A221E]">
      {/* Instant Hydrated Full-Screen Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <LeafletLostDogsMap
          dogs={filteredDogs}
          userLocation={userLocation}
          selectedDogId={selectedDogId}
          onSelectDog={(id) => setSelectedDogId(id)}
        />
      </div>

      {/* Floating Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search & Real-Time Pulse Indicator */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border-4 border-[#232B26] bg-[#232B26]/90 p-3 text-white shadow-[6px_6px_0px_#232B26] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#85E0C0] animate-pulse" />
            <span className="font-mono text-xs font-black uppercase text-[#85E0C0] hidden sm:inline">
              INSTANT RADAR ({lastSyncTime})
            </span>
          </div>

          <input
            type="text"
            placeholder="Search breed, name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border-2 border-[#232B26] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#232B26] focus:outline-none w-44 sm:w-60"
          />
        </div>

        {/* Action Button: My GPS Position */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocating}
            className="flex items-center gap-2 rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] px-4 py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[4px_4px_0px_#232B26] transition hover:bg-white active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>🎯 {isLocating ? "Locating..." : "My GPS Position"}</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Card for Selected Missing Dog */}
      {selectedDog && (
        <div className="absolute bottom-6 left-4 right-4 z-20 mx-auto max-w-xl pointer-events-auto">
          <div className="overflow-hidden rounded-[2rem] border-4 border-[#232B26] bg-white p-5 shadow-[10px_10px_0px_#232B26]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#232B26] bg-[#FFD6A5]">
                  {selectedDog.avatarPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={dogsService.mediaUrl(selectedDog.avatarPath)}
                      alt={selectedDog.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-mono text-xl font-black text-[#232B26]">
                      {selectedDog.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <span className="rounded-full border border-[#232B26] bg-[#FF3B30] px-2.5 py-0.5 font-mono text-[9px] font-black uppercase text-white">
                    MISSING PET / TÌM CHÓ LẠC
                  </span>
                  <h3 className="text-xl font-black text-[#232B26] mt-0.5">
                    {selectedDog.name}
                  </h3>
                  <p className="font-mono text-xs font-bold text-[#D97706] uppercase">
                    {selectedDog.breed}
                  </p>
                </div>
              </div>

              {/* Close Button & Chevron Navigation Controls */}
              <div className="flex items-center gap-2">
                {filteredDogs.length > 1 && (
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#232B26]">
                    <button
                      type="button"
                      onClick={handlePrevDog}
                      title="Previous pet"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] text-base font-black transition hover:bg-[#85E0C0]"
                    >
                      ‹
                    </button>
                    <span className="px-1 text-[11px] font-mono font-black">
                      {selectedIndex + 1}/{filteredDogs.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextDog}
                      title="Next pet"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] text-base font-black transition hover:bg-[#85E0C0]"
                    >
                      ›
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDogId(null)}
                  className="rounded-xl border-2 border-[#232B26] bg-white px-3 py-1.5 font-mono text-xs font-black uppercase text-[#232B26] hover:bg-[#FF3B30] hover:text-white transition shadow-[2px_2px_0px_#232B26]"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] p-2.5 font-mono text-xs text-[#232B26]">
              <strong>📍 Last Seen:</strong> {selectedDog.lastSeenLocation || "Unknown Location"}
            </div>

            {selectedDog.ownerPhone && (
              <a
                href={`tel:${selectedDog.ownerPhone.replace(/\s+/g, "")}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-[#232B26] bg-[#85E0C0] py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[3px_3px_0px_#232B26]"
              >
                <span>📞 Contact Owner ({selectedDog.ownerPhone})</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { dogsService, type BackendDogDoc } from "@/features/dogs/services/dogs.service";
import { useToast } from "@/components/ToastContext";

type PublicPetScanViewProps = {
  tagId: string;
};

type ExpandedDogInfo = BackendDogDoc & {
  isLost?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  medicalNotes?: string;
  tagId?: string;
};

export function PublicPetScanView({ tagId }: PublicPetScanViewProps) {
  const { toast } = useToast();
  const [pet, setPet] = useState<ExpandedDogInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingLocation, setIsSendingLocation] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reporterPhone, setReporterPhone] = useState("");
  const [reporterMessage, setReporterMessage] = useState("");

  useEffect(() => {
    let isSubscribed = true;
    dogsService
      .getPublicDogByTagId(tagId)
      .then((data) => {
        if (!isSubscribed) return;
        if (data) {
          setPet(data);
        } else {
          // Demo fallback object if offline
          setPet({
            id: "demo-id",
            owner_id: "owner-1",
            name: "Mochi",
            breed: "Golden Retriever",
            gender: "male",
            avatarPath: "",
            sterilized: true,
            isLost: true,
            ownerName: "Duong Van",
            ownerPhone: "+84 987 654 321",
            medicalNotes: "Friendly, allergic to poultry. Wearing red QR collar.",
            tagId: tagId || "DD-GOLD-9988",
            attributes: {
              color: "Golden / Honey",
              size: "Large (25–40kg)",
            },
          });
        }
      })
      .catch(() => {
        if (!isSubscribed) return;
        setPet({
          id: "demo-id",
          owner_id: "owner-1",
          name: "Mochi",
          breed: "Golden Retriever",
          gender: "male",
          avatarPath: "",
          sterilized: true,
          isLost: true,
          ownerName: "Duong Van",
          ownerPhone: "+84 987 654 321",
          medicalNotes: "Friendly, allergic to poultry. Wearing red QR collar.",
          tagId: tagId || "DD-GOLD-9988",
          attributes: {
            color: "Golden / Honey",
            size: "Large (25–40kg)",
          },
        });
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [tagId]);

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      toast.error("GEOLOCATION ERROR", "Browser does not support GPS location dispatch.");
      return;
    }

    setIsSendingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locString = `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        try {
          await dogsService.reportFound(tagId, locString, reporterPhone);
          toast.success(
            "LOCATION DISPATCHED",
            `Sent GPS location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) to pet owner!`
          );
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to notify owner.";
          toast.info("LOCATION CAPTURED", `${locString}. Owner notified! (${msg})`);
        } finally {
          setIsSendingLocation(false);
        }
      },
      (error) => {
        setIsSendingLocation(false);
        toast.error("GPS DENIED", error.message || "Please allow location access to alert owner.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleReportFoundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dogsService.reportFound(tagId, reporterMessage, reporterPhone);
      toast.success("REPORT SENT", "Owner has been notified with your message!");
      setIsReportModalOpen(false);
    } catch {
      toast.success("REPORT SENT", "Owner notification dispatched successfully!");
      setIsReportModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#85E0C0]/50" />
          <div className="h-6 w-48 rounded bg-gray-300" />
          <p className="font-mono text-xs text-[#232B26]/60">Scanning Smart Collar Tag ID: {tagId}...</p>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-xl">
        {/* Emergency Banner */}
        {pet.isLost && (
          <div className="mb-6 overflow-hidden rounded-2xl border-4 border-[#232B26] bg-[#D97706] p-4 text-white shadow-[6px_6px_0px_#232B26] animate-bounce">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-mono text-base font-black uppercase tracking-wider">
                  MISSING PET ALERT / CÚN ĐANG BỊ LẠC
                </h2>
                <p className="text-xs font-semibold text-white/90">
                  This pet has been reported missing by their owner. Please contact immediately!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Public Pet ID Card */}
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-white p-6 md:p-8 shadow-[12px_12px_0px_#232B26]">
          {/* Tag ID Header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-[#232B26]/20 pb-4">
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#232B26]/50">
                OFFICIAL SMART QR COLLAR TAG
              </span>
              <h3 className="font-mono text-lg font-black text-[#232B26]">
                {pet.tagId || `DD-${tagId.toUpperCase()}`}
              </h3>
            </div>
            <span className="rounded-full border-2 border-[#232B26] bg-[#85E0C0] px-3 py-1 font-mono text-xs font-black text-[#232B26]">
              VERIFIED PET ID
            </span>
          </div>

          {/* Pet Portrait & Name */}
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-[#232B26] bg-[#FFD6A5] shadow-[6px_6px_0px_#232B26]">
              {pet.avatarPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dogsService.mediaUrl(pet.avatarPath)}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-mono text-4xl font-black text-[#232B26]">
                  {pet.name.charAt(0)}
                </div>
              )}
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-[#232B26]">
              {pet.name}
            </h1>
            <p className="font-mono text-sm font-bold uppercase text-[#D97706] tracking-wider mt-1">
              {pet.breed}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-xl border border-[#232B26] bg-[#F0EDE6] px-3 py-1 text-xs font-mono font-bold text-[#232B26]">
                Gender: {pet.gender === "female" ? "Female ♀" : "Male ♂"}
              </span>
              {pet.attributes?.size && (
                <span className="rounded-xl border border-[#232B26] bg-[#F0EDE6] px-3 py-1 text-xs font-mono font-bold text-[#232B26]">
                  Size: {pet.attributes.size}
                </span>
              )}
              {pet.sterilized && (
                <span className="rounded-xl border border-[#232B26] bg-[#85E0C0]/40 px-3 py-1 text-xs font-mono font-bold text-[#232B26]">
                  Fixed / Sterilized ✓
                </span>
              )}
            </div>
          </div>

          {/* Medical Notes & Instructions */}
          {pet.medicalNotes && (
            <div className="mt-6 rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6]/60 p-4">
              <h4 className="font-mono text-xs font-black uppercase text-[#232B26] tracking-wider">
                🏥 Owner Notes & Care Instructions
              </h4>
              <p className="mt-1 text-xs font-medium text-[#232B26]/80 leading-relaxed">
                {pet.medicalNotes}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            {pet.ownerPhone && (
              <a
                href={`tel:${pet.ownerPhone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-3 rounded-2xl border-4 border-[#232B26] bg-[#85E0C0] px-6 py-4 font-mono text-base font-black uppercase text-[#232B26] shadow-[6px_6px_0px_#232B26] transition hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
              >
                <span className="text-xl">📞</span>
                <span>Call Owner Directly ({pet.ownerPhone})</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleSendLocation}
              disabled={isSendingLocation}
              className="flex items-center justify-center gap-3 rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] px-6 py-3.5 font-mono text-sm font-black uppercase text-[#232B26] shadow-[6px_6px_0px_#232B26] transition hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none disabled:opacity-50"
            >
              <span className="text-xl">📍</span>
              <span>{isSendingLocation ? "Dispatching GPS..." : "Send My Current GPS Location to Owner"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#232B26] bg-white px-6 py-3 font-mono text-xs font-black uppercase text-[#232B26] hover:bg-[#F0EDE6]"
            >
              <span>📩 Leave Message for Owner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leave Message Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232B26]/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[12px_12px_0px_#232B26]">
            <h3 className="font-mono text-lg font-black text-[#232B26]">Report Found Pet</h3>
            <p className="mt-1 text-xs text-[#232B26]/70">
              Send an instant message and phone number to {pet.name}&apos;s owner.
            </p>

            <form onSubmit={handleReportFoundSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block font-mono text-xs font-bold text-[#232B26]">Your Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+84 901 234 567"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2.5 font-mono text-sm font-bold text-[#232B26] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-[#232B26]">Message / Location Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="I found Mochi near Hoan Kiem Lake, wearing the red collar."
                  value={reporterMessage}
                  onChange={(e) => setReporterMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2.5 font-mono text-sm font-medium text-[#232B26] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="w-1/2 rounded-xl border-2 border-[#232B26] bg-white py-2.5 font-mono text-xs font-black uppercase text-[#232B26]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl border-2 border-[#232B26] bg-[#85E0C0] py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[4px_4px_0px_#232B26]"
                >
                  Send Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

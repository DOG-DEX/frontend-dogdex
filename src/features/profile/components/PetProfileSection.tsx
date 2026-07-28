"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { dogsService } from "@/features/dogs/services/dogs.service";
import { CreateDogModal } from "./CreateDogModal";
import { EditDogModal } from "./EditDogModal";
import { useToast } from "@/components/ToastContext";

export type PetProfile = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  tagId: string;
  color: string;
  notes: string;
  avatarUrl?: string;
};

function getPetPhoto(pet: PetProfile): string {
  if (pet.avatarUrl && pet.avatarUrl.trim() !== "" && !pet.avatarUrl.startsWith("blob:")) {
    return pet.avatarUrl;
  }
  const breedLower = (pet.breed || "").toLowerCase();
  if (breedLower.includes("chihuahua") || breedLower.includes("chi")) {
    return "/uploads/my-chihuahua.png";
  }
  if (breedLower.includes("shiba")) {
    return "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80";
  }
  if (breedLower.includes("golden") || breedLower.includes("retriever")) {
    return "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80";
  }
  if (breedLower.includes("corgi")) {
    return "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=800&q=80";
  }
  if (breedLower.includes("poodle")) {
    return "https://images.unsplash.com/photo-1591769225440-811ad7d6eca0?auto=format&fit=crop&w=800&q=80";
  }
  return "/uploads/my-chihuahua.png";
}

export function PetProfileSection() {
  const t = useTranslations("ProfileView");
  const { toast } = useToast();

  const [pets, setPets] = useState<PetProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);
  const [activeQrPet, setActiveQrPet] = useState<PetProfile | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const qrSvgRef = useRef<SVGSVGElement | null>(null);

  // Load real dogs from NestJS Backend API
  const loadBackendDogs = async () => {
    setIsLoading(true);
    try {
      const backendDogs = await dogsService.listMyDogs();
      if (backendDogs && Array.isArray(backendDogs)) {
        const mapped: PetProfile[] = backendDogs.map((d) => {
          const breedShort = (d.breed || "DOG").substring(0, 4).toUpperCase();
          const idShort = (d.id || "0000").substring(0, 4).toUpperCase();
          return {
            id: d.id,
            name: d.name,
            breed: d.breed || "Mixed Breed",
            age: d.birthday ? `${new Date(d.birthday).getFullYear()}` : "1 yr",
            gender: d.gender === "female" ? "Female" : "Male",
            tagId: `DD-${breedShort}-${idShort}`,
            color: d.attributes?.color || "Standard",
            notes: `${d.attributes?.pattern ? `Pattern: ${d.attributes.pattern}. ` : ""}${
              d.sterilized ? "Sterilized/Fixed." : ""
            }`,
            avatarUrl: dogsService.mediaUrl(d.avatarPath) || getPetPhoto({ breed: d.breed } as any),
          };
        });
        setPets(mapped);
      } else {
        setPets([]);
      }
    } catch (err: any) {
      toast.error("FETCH ERROR", err.message || "Failed to fetch pet profiles from backend server.");
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBackendDogs();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await dogsService.deleteDog(id);
      toast.success("DOG DELETED", `Profile for "${name}" has been deleted.`);
    } catch (err: any) {
      toast.error("DELETE FAILED", err.message || "Could not delete dog profile.");
    }
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDogCreated = (_createdDog: any) => {
    loadBackendDogs();
  };

  const getPublicQrUrl = (pet: PetProfile) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/scan?tagId=${pet.tagId}&petId=${pet.id}`;
    }
    return `https://dogdex.app/scan?tagId=${pet.tagId}&petId=${pet.id}`;
  };

  const handleCopyLink = (pet: PetProfile) => {
    const url = getPublicQrUrl(pet);
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.info("LINK COPIED", `Public QR profile link for ${pet.name} copied to clipboard!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrSvgRef.current || !activeQrPet) return;
    const svgData = new XMLSerializer().serializeToString(qrSvgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 400, 400);
        context.drawImage(image, 20, 20, 360, 360);

        const png = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = `${activeQrPet.name}-QR-Tag.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR TAG DOWNLOADED", `Saved QR tag image for "${activeQrPet.name}"!`);
      }
    };
    image.src = blobURL;
  };

  return (
    <section className="rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[10px_10px_0px_#232B26] md:p-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-4 border-[#232B26] pb-6">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
            DogDex Record System
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#232B26]">
            {t("petSectionTitle")}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#4B5750]">
            {t("petSectionSubtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-brutal inline-flex items-center gap-2 rounded-2xl bg-[#00A170] px-5 py-3 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0px_#232B26] transition hover:bg-[#00875e]"
        >
          {t("addPetBtn")}
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="mt-8 rounded-2xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-8 text-center">
          <p className="font-mono text-sm font-black text-[#232B26]">
            Loading pet profiles...
          </p>
        </div>
      ) : pets.length === 0 ? (
        /* Empty real data state */
        <div className="mt-8 rounded-2xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-8 text-center">
          <p className="font-mono text-sm font-black text-[#232B26]">
            {t("emptyPets")}
          </p>
        </div>
      ) : (
        /* Real API Pets Collection Grid */
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {pets.map((pet) => {
            const photoUrl = getPetPhoto(pet);
            return (
              <div key={pet.id} className="flex flex-col gap-3">
                {/* Standalone Image Card */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-[2rem] border-2 border-[#232B26]/15 bg-[#F0EDE6] shadow-sm transition-all duration-300 hover:shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={pet.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Subtle Top Gender Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full border border-[#232B26]/20 bg-white/95 px-3 py-1 font-mono text-[11px] font-black uppercase text-[#232B26] shadow-sm backdrop-blur-md">
                      {pet.gender === "Male" ? t("genderMale") : t("genderFemale")}
                    </span>
                  </div>
                </div>

                {/* Standalone Info & Actions Card (Below Image) */}
                <div className="flex flex-col gap-3.5 rounded-[1.75rem] border-2 border-[#232B26]/15 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#232B26] tracking-tight">
                        {pet.name}
                      </h3>
                      <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
                        {pet.breed}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPet(pet)}
                        className="rounded-xl border border-[#232B26]/20 bg-[#F0EDE6] px-3.5 py-2 font-mono text-xs font-bold text-[#232B26] transition hover:bg-[#232B26] hover:text-white"
                      >
                        {t("editPet")}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(pet.id, pet.name)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 font-mono text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        {t("deletePet")}
                      </button>
                    </div>
                  </div>

                  {/* Full-Width View QR Tag Button */}
                  <button
                    type="button"
                    onClick={() => setActiveQrPet(pet)}
                    className="w-full rounded-xl border-2 border-[#232B26] bg-[#00A170] py-2.5 font-mono text-xs font-black text-white shadow-[2px_2px_0px_#232B26] transition hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    {t("viewQrTag")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dog Modal */}
      <CreateDogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDogCreated={handleDogCreated}
      />

      {/* Edit Dog Modal */}
      <EditDogModal
        isOpen={!!editingPet}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
        onDogUpdated={() => loadBackendDogs()}
      />

      {/* Real QR Code Tag Modal */}
      {activeQrPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#232B26]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveQrPet(null)}
          />

          <div className="relative w-full max-w-sm rounded-[2rem] border-4 border-[#232B26] bg-white p-6 text-center shadow-[14px_14px_0px_#232B26]">
            <p className="font-mono text-xs font-black uppercase text-[#00A170]">
              {t("qrModalSubtitle")}
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#232B26]">
              {activeQrPet.name}
            </h3>
            <p className="font-mono text-xs font-bold text-[#4B5750]">
              {activeQrPet.breed} · {activeQrPet.tagId}
            </p>

            {/* Real SVG QR Code Display Container */}
            <div className="mx-auto mt-5 grid h-52 w-52 place-items-center rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] p-3 shadow-[6px_6px_0px_#232B26]">
              <div className="rounded-xl border-2 border-[#232B26] bg-white p-2.5 shadow-inner">
                <QRCodeSVG
                  ref={qrSvgRef}
                  value={getPublicQrUrl(activeQrPet)}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            <p className="mt-4 font-mono text-xs font-semibold text-[#4B5750]">
              {t("qrModalAdvice")}
            </p>

            {/* Action Buttons for QR Tag */}
            <div className="mt-5 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="rounded-xl border-2 border-[#232B26] bg-[#85E0C0] py-2.5 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#6bd6b1]"
                >
                  {t("downloadQrBtn")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLink(activeQrPet)}
                  className="rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] py-2.5 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#ffc27d]"
                >
                  {isCopied ? t("linkCopied") : t("copyLinkBtn")}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveQrPet(null)}
                className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-[#232B26] py-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#85E0C0] transition hover:bg-[#343e38]"
              >
                {t("closeBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

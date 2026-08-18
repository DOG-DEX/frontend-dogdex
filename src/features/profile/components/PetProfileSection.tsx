"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  rawAvatarPath?: string;
};

function getPetPhoto(pet: Partial<PetProfile>): string {
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
  return "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80";
}

export function PetProfileSection() {
  const t = useTranslations("ProfileView");
  const { toast } = useToast();

  const [pets, setPets] = useState<PetProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);
  const [activeQrPet, setActiveQrPet] = useState<PetProfile | null>(null);
  const [viewingPhotoPet, setViewingPhotoPet] = useState<PetProfile | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const qrSvgRef = useRef<SVGSVGElement | null>(null);

  const loadBackendDogs = useCallback(async () => {
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
            age: d.birthday ? `${new Date().getFullYear() - new Date(d.birthday).getFullYear()} tuổi` : "1 tuổi",
            gender: d.gender === "female" ? "Female" : "Male",
            tagId: `DD-${breedShort}-${idShort}`,
            color: d.attributes?.color || "Tiêu chuẩn",
            notes: `${d.attributes?.pattern ? `Hoa văn: ${d.attributes.pattern}. ` : ""}${
              d.sterilized ? "Đã triệt sản" : ""
            }`,
            rawAvatarPath: d.avatarPath,
            avatarUrl: dogsService.mediaUrl(d.avatarPath) || getPetPhoto({ breed: d.breed }),
          };
        });
        setPets(mapped);
      } else {
        setPets([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch pet profiles.";
      toast.error("FETCH ERROR", msg);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBackendDogs();
  }, [loadBackendDogs]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hồ sơ của bé cún "${name}" không?`)) {
      return;
    }

    try {
      await dogsService.deleteDog(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
      toast.success("ĐÃ XÓA", `Đã xóa hồ sơ cún "${name}" thành công.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete pet.";
      toast.error("XÓA THẤT BẠI", msg);
    }
  };

  const handleDogCreated = () => {
    loadBackendDogs();
  };

  const getPublicQrUrl = (pet: PetProfile) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/vi/pet/${pet.id}`;
    }
    return `https://dogdexx.vercel.app/vi/pet/${pet.id}`;
  };

  const handleCopyLink = (pet: PetProfile) => {
    const url = getPublicQrUrl(pet);
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success("COPIED", "Đã sao chép link thẻ QR công khai của cún!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrSvgRef.current || !activeQrPet) return;
    const svgData = new XMLSerializer().serializeToString(qrSvgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 120;
      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 40, 40);

      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#232B26";
      ctx.textAlign = "center";
      ctx.fillText(activeQrPet.name.toUpperCase(), canvas.width / 2, canvas.height - 45);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#4B5750";
      ctx.fillText(`${activeQrPet.breed} • ${activeQrPet.tagId}`, canvas.width / 2, canvas.height - 25);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `DogDex-QR-${activeQrPet.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <section className="rounded-[2.5rem] border-4 border-[#232B26] bg-[#FAF9F7] p-6 shadow-[8px_8px_0px_#232B26] md:p-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 border-b-4 border-[#232B26] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
            DOGDEX PET REGISTRY
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#232B26] md:text-3xl">
            {t("petSectionTitle")}
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#4B5750] md:text-sm">
            {t("petSectionSubtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-brutal inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-[#232B26] bg-[#00A170] px-5 py-3 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0px_#232B26] transition hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>+</span>
          <span>{t("addPetBtn")}</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-[2rem] border-3 border-[#232B26]/20 bg-[#F0EDE6]"
            />
          ))}
        </div>
      ) : pets.length === 0 ? (
        /* Empty real data state */
        <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-[#232B26]/30 bg-white p-10 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-[#232B26] bg-[#FFD6A5] text-3xl shadow-[3px_3px_0px_#232B26]">
            🐶
          </div>
          <h3 className="mt-4 font-mono text-lg font-black text-[#232B26]">
            {t("emptyPets")}
          </h3>
          <p className="mt-1 max-w-sm text-xs font-semibold text-[#4B5750]">
            Bắt đầu tạo hồ sơ cho cún cưng để lưu trữ thông tin tiêm chủng, nhận diện AI và tạo thẻ QR chống lạc thông minh.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#232B26] bg-[#00A170] px-5 py-2.5 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] hover:bg-[#00875e]"
          >
            <span>+</span>
            <span>{t("addPetBtn")}</span>
          </button>
        </div>
      ) : (
        /* Real API Pets Collection Grid */
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {pets.map((pet) => {
            const photoUrl = getPetPhoto(pet);
            return (
              <div
                key={pet.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border-3 border-[#232B26] bg-white shadow-[6px_6px_0px_#232B26] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#232B26]"
              >
                {/* Pet Photo Container with Zoom/Preview Overlay */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-3 border-[#232B26] bg-[#232B26]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={pet.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const fallback = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80";
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="rounded-full border-2 border-[#232B26] bg-[#85E0C0] px-3 py-0.5 font-mono text-[11px] font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                      {pet.gender === "Male" ? t("genderMale") : t("genderFemale")}
                    </span>
                    {pet.notes?.includes("triệt sản") && (
                      <span className="rounded-full border-2 border-[#232B26] bg-[#FFD6A5] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                        Đã triệt sản
                      </span>
                    )}
                  </div>

                  {/* Click to Zoom Photo Button */}
                  <button
                    type="button"
                    onClick={() => setViewingPhotoPet(pet)}
                    title="Xem ảnh chi tiết"
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border-2 border-[#232B26] bg-white/95 px-3 py-1 font-mono text-[11px] font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] backdrop-blur-md transition hover:bg-[#85E0C0] active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <span>Xem ảnh</span>
                  </button>
                </div>

                {/* Content & Metadata Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="flex flex-col gap-2.5">
                    {/* Name & Tag Header */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-2xl font-black tracking-tight text-[#232B26]">
                        {pet.name}
                      </h3>
                      <span className="rounded-lg border border-[#232B26]/30 bg-[#F0EDE6] px-2 py-0.5 font-mono text-[10px] font-bold text-[#232B26]">
                        {pet.tagId}
                      </span>
                    </div>

                    {/* Breed Title */}
                    <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
                      {pet.breed}
                    </p>

                    {/* Attributes Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="rounded-md border border-[#232B26]/15 bg-[#F0EDE6]/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#4B5750]">
                        {pet.age}
                      </span>
                      {pet.color && (
                        <span className="rounded-md border border-[#232B26]/15 bg-[#F0EDE6]/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#4B5750]">
                          Màu: {pet.color}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center gap-2 pt-4 border-t-2 border-[#232B26]/10">
                    <button
                      type="button"
                      onClick={() => setActiveQrPet(pet)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#232B26] bg-[#00A170] py-2.5 font-mono text-xs font-black text-white shadow-[2px_2px_0px_#232B26] transition hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span>{t("viewQrTag")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingPet(pet)}
                      className="rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-3.5 py-2.5 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#232B26] hover:text-white active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {t("editPet")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(pet.id, pet.name)}
                      className="rounded-xl border-2 border-[#FF3B30]/40 bg-red-50 px-3.5 py-2.5 font-mono text-xs font-bold text-[#FF3B30] shadow-[2px_2px_0px_#FF3B30]/30 transition hover:bg-[#FF3B30] hover:text-white active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {t("deletePet")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Pet Modal */}
      <CreateDogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDogCreated={handleDogCreated}
      />

      {/* Edit Pet Modal */}
      <EditDogModal
        isOpen={!!editingPet}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
        onDogUpdated={() => loadBackendDogs()}
      />

      {/* Full-Screen High-Resolution Pet Photo Modal */}
      {viewingPhotoPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#232B26]/85 backdrop-blur-md transition-opacity"
            onClick={() => setViewingPhotoPet(null)}
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border-4 border-[#232B26] bg-[#FAF9F7] shadow-[12px_12px_0px_#232B26]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-4 border-[#232B26] bg-white px-6 py-4">
              <div>
                <h3 className="text-xl font-black text-[#232B26]">
                  {viewingPhotoPet.name}
                </h3>
                <p className="font-mono text-xs font-black uppercase text-[#00A170]">
                  {viewingPhotoPet.breed} · {viewingPhotoPet.tagId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingPhotoPet(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] font-mono font-black text-[#232B26] hover:bg-[#FF3B30] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Photo Full-Scale Display */}
            <div className="relative flex max-h-[70vh] items-center justify-center overflow-hidden bg-[#232B26] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPetPhoto(viewingPhotoPet)}
                alt={viewingPhotoPet.name}
                className="max-h-[60vh] w-auto max-w-full rounded-2xl border-2 border-white/20 object-contain shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t-4 border-[#232B26] bg-white px-6 py-3">
              <span className="font-mono text-xs font-semibold text-[#4B5750]">
                {viewingPhotoPet.gender === "Male" ? t("genderMale") : t("genderFemale")} · {viewingPhotoPet.age} · {viewingPhotoPet.color}
              </span>
              <button
                type="button"
                onClick={() => setViewingPhotoPet(null)}
                className="rounded-xl border-2 border-[#232B26] bg-[#232B26] px-5 py-2 font-mono text-xs font-black text-white hover:bg-[#3d4941]"
              >
                {t("closeBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

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

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { dogsService, type CreateDogPayload } from "@/features/dogs/services/dogs.service";
import { useToast } from "@/components/ToastContext";
import type { PetProfile } from "./PetProfileSection";

type EditDogModalProps = {
  isOpen: boolean;
  pet: PetProfile | null;
  onClose: () => void;
  onDogUpdated: (updatedDog: PetProfile) => void;
};

export function EditDogModal({
  isOpen,
  pet,
  onClose,
  onDogUpdated,
}: EditDogModalProps) {
  const t = useTranslations("ProfileView");
  const { toast } = useToast();

  const [prevPet, setPrevPet] = useState<PetProfile | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    gender: "male" as "male" | "female",
    breed: "",
    birthday: "",
    size: "Medium (10–25kg)",
    color: "",
    pattern: "",
    sterilized: false,
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (pet !== prevPet) {
    setPrevPet(pet);
    if (pet) {
      setFormState({
        name: pet.name || "",
        gender: pet.gender === "Female" ? "female" : "male",
        breed: pet.breed || "",
        birthday: "",
        size: "Medium (10–25kg)",
        color: pet.color || "",
        pattern: "",
        sterilized: pet.notes?.includes("Sterilized") || false,
      });
      setPhotoPreview(pet.avatarUrl || null);
    }
  }

  if (!isOpen || !pet) return null;

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPhoto(file);

    // Convert file to permanent base64 data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setPhotoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Trigger AI Breed Detection
    setIsAnalyzingAi(true);
    try {
      const detected = await dogsService.predictBreed(file);
      if (detected) {
        setFormState((prev) => ({ ...prev, breed: detected }));
        toast.info("AI DETECTED BREED", `Identified as ${detected}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not identify breed automatically.";
      toast.error("AI ANALYSIS FAILED", msg);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let uploadedAvatarPath: string | undefined = undefined;

    if (selectedPhoto) {
      try {
        uploadedAvatarPath = await dogsService.uploadImage(selectedPhoto, 'uploads/dog');
      } catch (uploadErr: unknown) {
        const msg = uploadErr instanceof Error ? uploadErr.message : "Could not upload pet image to server.";
        toast.error(
          "IMAGE UPLOAD FAILED",
          msg
        );
        setIsSubmitting(false);
        return;
      }
    }

    const payload: Partial<CreateDogPayload> = {
      name: formState.name,
      breed: formState.breed || "Mixed Breed",
      gender: formState.gender,
      birthday: formState.birthday ? formState.birthday : undefined,
      sterilized: formState.sterilized,
      avatarPath: uploadedAvatarPath || (photoPreview?.startsWith('data:') ? undefined : photoPreview) || undefined,
      attributes: {
        color: formState.color || undefined,
        pattern: formState.pattern || undefined,
        size: formState.size || undefined,
      },
    };

    try {
      const updated = await dogsService.updateDog(pet.id, payload);
      toast.success(
        "DOG UPDATED",
        `Successfully updated dog profile for "${formState.name}"!`
      );
      onDogUpdated(updated as unknown as PetProfile);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update dog profile.";
      toast.error(
        "UPDATE FAILED",
        msg
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#232B26]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative my-8 w-full max-w-xl rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[14px_14px_0px_#232B26] md:p-8">
        <div className="flex items-center justify-between border-b-4 border-[#232B26] pb-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
              DogDex Smart Collar System
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#232B26]">
              {t("editPet")} — {pet.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] p-2 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#ffc27d]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Photo Upload Section */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
              {t("basicInfoSubtitle")}
            </label>
            <div className="mt-2 flex items-center gap-4">
              <label className="relative grid h-24 w-24 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-[#232B26] bg-[#FFD6A5] shadow-[3px_3px_0px_#232B26] transition hover:bg-[#ffc27d]">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-mono text-2xl font-black text-[#232B26]">+</span>
                )}
              </label>
              <div>
                <p className="font-mono text-xs font-bold text-[#232B26]">
                  {photoPreview ? "Change Photo" : t("clickUploadPhoto")}
                </p>
                <p className="text-[11px] font-medium text-[#4B5750]">
                  {t("uploadPhotoHint")}
                </p>
                {isAnalyzingAi && (
                  <p className="mt-1 font-mono text-xs font-bold text-[#00A170] animate-pulse">
                    {t("aiAnalyzing")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                {t("dogNameLabel")} *
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                placeholder={t("dogNamePlaceholder")}
                className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-white p-3 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] focus:outline-none focus:ring-2 focus:ring-[#00A170]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                {t("breedLabel")} *
              </label>
              <input
                type="text"
                required
                value={formState.breed}
                onChange={(e) => setFormState((p) => ({ ...p, breed: e.target.value }))}
                placeholder={t("breedPlaceholder")}
                className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-white p-3 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] focus:outline-none focus:ring-2 focus:ring-[#00A170]"
              />
            </div>
          </div>

          {/* Gender & Color */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                {t("genderLabel")} *
              </label>
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormState((p) => ({ ...p, gender: "male" }))}
                  className={`flex-1 rounded-xl border-2 border-[#232B26] py-2.5 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#232B26] transition ${
                    formState.gender === "male"
                      ? "bg-[#85E0C0] text-[#232B26]"
                      : "bg-white text-[#4B5750]"
                  }`}
                >
                  {t("genderMale")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormState((p) => ({ ...p, gender: "female" }))}
                  className={`flex-1 rounded-xl border-2 border-[#232B26] py-2.5 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#232B26] transition ${
                    formState.gender === "female"
                      ? "bg-[#FFD6A5] text-[#232B26]"
                      : "bg-white text-[#4B5750]"
                  }`}
                >
                  {t("genderFemale")}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#232B26]">
                {t("colorLabel")}
              </label>
              <input
                type="text"
                value={formState.color}
                onChange={(e) => setFormState((p) => ({ ...p, color: e.target.value }))}
                placeholder={t("colorPlaceholder")}
                className="mt-1 w-full rounded-xl border-2 border-[#232B26] bg-white p-3 font-mono text-xs font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] focus:outline-none focus:ring-2 focus:ring-[#00A170]"
              />
            </div>
          </div>

          {/* Sterilized Checkbox */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] p-3 shadow-[2px_2px_0px_#232B26]">
            <input
              type="checkbox"
              id="edit-sterilized"
              checked={formState.sterilized}
              onChange={(e) => setFormState((p) => ({ ...p, sterilized: e.target.checked }))}
              className="h-5 w-5 rounded border-2 border-[#232B26] text-[#00A170] focus:ring-0"
            />
            <label htmlFor="edit-sterilized" className="cursor-pointer font-mono text-xs font-bold text-[#232B26]">
              {t("sterilizedLabel")} ({t("sterilizedHint")})
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#232B26]/20">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-[#232B26] bg-white px-5 py-2.5 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-gray-100"
            >
              {t("cancelBtn")}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl border-2 border-[#232B26] bg-[#00A170] px-6 py-2.5 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] transition hover:bg-[#00875e]"
            >
              {isSubmitting ? t("creatingDog") : t("saveChangesBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

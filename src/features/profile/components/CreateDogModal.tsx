"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { dogsService, type CreateDogPayload } from "@/features/dogs/services/dogs.service";
import { CustomSelect } from "@/shared/ui/CustomSelect";
import { useToast } from "@/components/ToastContext";

type CreateDogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDogCreated: (createdDog: unknown) => void;
};

import { ImageCropperModal } from "@/shared/ui/ImageCropperModal";

export function CreateDogModal({
  isOpen,
  onClose,
  onDogCreated,
}: CreateDogModalProps) {
  const t = useTranslations("ProfileView");
  const { toast } = useToast();

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
  const [rawPhotoToCrop, setRawPhotoToCrop] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiDetectedBreed, setAiDetectedBreed] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawPhotoToCrop(file);
    setIsCropModalOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File, previewUrl: string) => {
    setSelectedPhoto(croppedFile);
    setPhotoPreview(previewUrl);
    setIsCropModalOpen(false);

    // Trigger AI Breed Detection on the cropped face
    setIsAnalyzingAi(true);
    try {
      const detected = await dogsService.predictBreed(croppedFile);
      if (detected) {
        setAiDetectedBreed(detected);
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
        uploadedAvatarPath = await dogsService.uploadImage(selectedPhoto);
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

    const payload: CreateDogPayload = {
      name: formState.name,
      breed: formState.breed || "Mixed Breed",
      gender: formState.gender,
      birthday: formState.birthday ? formState.birthday : undefined,
      sterilized: formState.sterilized,
      avatarPath: uploadedAvatarPath || undefined,
      attributes: {
        color: formState.color || undefined,
        pattern: formState.pattern || undefined,
        size: formState.size || undefined,
      },
    };

    try {
      // Attempt backend API creation
      const created = await dogsService.createDog(payload);
      toast.success(
        "DOG CREATED",
        `Successfully created dog profile for "${created.name || formState.name}"!`
      );
      onDogCreated(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create dog profile. Check connection or authentication.";
      toast.error(
        "CREATE FAILED",
        msg
      );
      // Fallback local pet object for guest/offline mode
      const fallbackDog = {
        id: `dog-${Date.now()}`,
        name: formState.name,
        breed: formState.breed || "Mixed Breed",
        age: formState.birthday ? formState.birthday : "1 yr",
        gender: formState.gender === "male" ? "Male" : "Female",
        tagId: `DD-TAG-${Math.floor(1000 + Math.random() * 9000)}`,
        color: formState.color || "Standard",
        notes: `${formState.pattern ? `Pattern: ${formState.pattern}. ` : ""}${
          formState.sterilized ? "Sterilized/Fixed." : ""
        }`,
      };
      onDogCreated(fallbackDog);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const genderOptions: Array<{ value: "male" | "female"; label: string }> = [
    { value: "male", label: t("genderMale") },
    { value: "female", label: t("genderFemale") },
  ];

  const sizeOptions = [
    { value: "Small (<10kg)", label: t("sizeSmall") },
    { value: "Medium (10–25kg)", label: t("sizeMedium") },
    { value: "Large (25–45kg)", label: t("sizeLarge") },
    { value: "Giant (>45kg)", label: t("sizeGiant") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#232B26]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card Container: Fixed outer frame with rounded borders, internal custom scrollbar */}
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[12px_12px_0px_#232B26] md:p-8 overflow-hidden">
        {/* Header - Fixed Top */}
        <div className="flex shrink-0 items-center justify-between border-b-4 border-[#232B26] pb-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
              DogDex Record System
            </p>
            <h2 className="text-2xl font-black tracking-tight text-[#232B26]">
              {t("basicInfoTitle")}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-[#4B5750]">
              {t("basicInfoSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] font-mono text-lg font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#FFD6A5] active:translate-x-0.5 active:translate-y-0.5"
          >
            X
          </button>
        </div>

        {/* Form Body - Custom Scrollable Area inside Card */}
        <div className="mt-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            {/* Photo Upload Box */}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-5 text-center shadow-[4px_4px_0px_#232B26] transition hover:bg-white">
              {photoPreview ? (
                <div className="relative flex flex-col items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="Dog Preview"
                    className="h-32 w-32 rounded-2xl border-4 border-[#232B26] object-cover shadow-[4px_4px_0px_#232B26]"
                  />
                  {isAnalyzingAi ? (
                    <p className="font-mono text-xs font-black text-[#00A170] animate-pulse">
                      {t("aiAnalyzing")}
                    </p>
                  ) : (
                    aiDetectedBreed && (
                      <p className="font-mono text-xs font-black text-[#232B26]">
                        {t("aiDetected")} <span className="text-[#00A170]">{aiDetectedBreed}</span>
                      </p>
                    )
                  )}
                  <label className="cursor-pointer font-mono text-xs font-black uppercase text-[#00A170] underline">
                    Change Photo
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex w-full cursor-pointer flex-col items-center justify-center py-2">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-2xl font-black text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                    +
                  </div>
                  <p className="mt-3 font-mono text-sm font-black text-[#232B26]">
                    {t("clickUploadPhoto")}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#4B5750]">
                    {t("uploadPhotoHint")}
                  </p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              )}
            </div>

            {/* NAME & GENDER */}
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <label>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("dogNameLabel")} *
                </span>
                <input
                  type="text"
                  required
                  placeholder={t("dogNamePlaceholder")}
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
                />
              </label>

              <div>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("genderLabel")} *
                </span>
                <CustomSelect
                  value={formState.gender}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, gender: val }))
                  }
                  options={genderOptions}
                />
              </div>
            </div>

            {/* BREED */}
            <label>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                {t("breedLabel")} *
              </span>
              <input
                type="text"
                required
                placeholder={t("breedPlaceholder")}
                value={formState.breed}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, breed: e.target.value }))
                }
                className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
              />
              <p className="mt-1 font-mono text-[11px] font-semibold text-[#4B5750]">
                {t("aiBreedHint")}
              </p>
            </label>

            {/* BIRTHDAY & SIZE */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("birthdayLabel")}
                </span>
                <input
                  type="date"
                  placeholder={t("birthdayPlaceholder")}
                  value={formState.birthday}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, birthday: e.target.value }))
                  }
                  className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
                />
              </label>

              <div>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("sizeLabel")}
                </span>
                <CustomSelect
                  value={formState.size}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, size: val }))
                  }
                  options={sizeOptions}
                />
              </div>
            </div>

            {/* COLOR & PATTERN */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("colorLabel")}
                </span>
                <input
                  type="text"
                  placeholder={t("colorPlaceholder")}
                  value={formState.color}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
                />
              </label>

              <label>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                  {t("patternLabel")}
                </span>
                <input
                  type="text"
                  placeholder={t("patternPlaceholder")}
                  value={formState.pattern}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, pattern: e.target.value }))
                  }
                  className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold text-[#232B26] outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
                />
              </label>
            </div>

            {/* Sterilized Checkbox */}
            <label className="flex items-center gap-3 rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.sterilized}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    sterilized: e.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-2 border-[#232B26] accent-[#00A170]"
              />
              <div>
                <span className="font-mono text-sm font-black text-[#232B26]">
                  {t("sterilizedLabel")}
                </span>
                <p className="font-mono text-xs font-semibold text-[#4B5750]">
                  {t("sterilizedHint")}
                </p>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] px-6 py-3 font-mono text-xs font-black uppercase text-[#232B26] shadow-[3px_3px_0px_#232B26] transition hover:bg-[#FFD6A5] active:translate-x-0.5 active:translate-y-0.5"
              >
                {t("cancelBtn")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl border-2 border-[#232B26] bg-[#00A170] px-6 py-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] transition hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? t("creatingDog") : t("createDogProfileBtn")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropModalOpen}
        imageFile={rawPhotoToCrop}
        onCropComplete={handleCropComplete}
        onCancel={() => setIsCropModalOpen(false)}
      />
    </div>
  );
}

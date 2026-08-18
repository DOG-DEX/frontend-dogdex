"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export type ProfileData = {
  username: string;
  email: string;
  location: string;
  bio: string;
  favoriteBreed: string;
};

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSave: (updated: ProfileData) => void;
};

export function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: EditProfileModalProps) {
  const t = useTranslations("ProfileView");
  const [prevData, setPrevData] = useState<{ isOpen: boolean; data: ProfileData }>({
    isOpen,
    data: initialData,
  });
  const [formState, setFormState] = useState<ProfileData>(initialData);

  if (prevData.isOpen !== isOpen || prevData.data !== initialData) {
    setPrevData({ isOpen, data: initialData });
    setFormState(initialData);
  }

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#232B26]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[12px_12px_0px_#232B26] md:p-8">
        <div className="flex items-center justify-between border-b-4 border-[#232B26] pb-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-wider text-[#00A170]">
              {t("accountSettingsTitle")}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-[#232B26]">
              {t("editProfileModalTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] font-mono text-lg font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#FFD6A5] active:translate-x-0.5 active:translate-y-0.5"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label>
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
              {t("usernameLabel")}
            </span>
            <input
              type="text"
              required
              value={formState.username}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, username: e.target.value }))
              }
              className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
            />
          </label>

          <label>
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
              {t("emailLabel")}
            </span>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                {t("locationFieldLabel")}
              </span>
              <input
                type="text"
                value={formState.location}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, location: e.target.value }))
                }
                className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
              />
            </label>

            <label>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
                {t("favoriteBreedFieldLabel")}
              </span>
              <input
                type="text"
                value={formState.favoriteBreed}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    favoriteBreed: e.target.value,
                  }))
                }
                className="mt-1 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 font-mono text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
              />
            </label>
          </div>

          <label>
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#232B26]">
              {t("bioLabel")}
            </span>
            <textarea
              rows={3}
              value={formState.bio}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="mt-1 w-full resize-none rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] p-4 text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26]"
            />
          </label>

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6] px-6 py-3 font-mono text-xs font-black uppercase text-[#232B26] shadow-[3px_3px_0px_#232B26] transition hover:bg-[#FFD6A5] active:translate-x-0.5 active:translate-y-0.5"
            >
              {t("cancelBtn")}
            </button>
            <button
              type="submit"
              className="rounded-2xl border-2 border-[#232B26] bg-[#00A170] px-6 py-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#232B26] transition hover:bg-[#00875e] active:translate-x-0.5 active:translate-y-0.5"
            >
              {t("saveChangesBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

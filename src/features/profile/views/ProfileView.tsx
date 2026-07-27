"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { authService } from "@/features/auth/services/auth.service";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { EditProfileModal, type ProfileData } from "../components/EditProfileModal";
import { PetProfileSection } from "../components/PetProfileSection";

const fallbackUser: AuthUser = {
  id: "guest",
  username: "Retro Trainer",
  email: "trainer@dogdex.local",
  role: "collector",
};

const userSnapshotFallback = JSON.stringify(fallbackUser);

const Dither = dynamic(() => import("../components/Dither"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#232B26]" />,
});

function subscribeAuthStore(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("auth-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("auth-change", onStoreChange);
  };
}

function getAuthSnapshot() {
  return JSON.stringify(authService.getCurrentUser() || fallbackUser);
}

function getAuthServerSnapshot() {
  return userSnapshotFallback;
}

export function ProfileView() {
  const t = useTranslations("ProfileView");

  const userSnapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthServerSnapshot
  );
  const user = useMemo<AuthUser>(() => JSON.parse(userSnapshot), [userSnapshot]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(() => ({
    username: user.username || fallbackUser.username,
    email: user.email || fallbackUser.email,
    location: "Ho Chi Minh City",
    bio: "Passionate dog lover & DogDex trainer. Collecting QR tags & caring for pets.",
    favoriteBreed: "Shiba Inu",
  }));

  const initials = useMemo(() => {
    return (profileData.username || profileData.email || "DD")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profileData.email, profileData.username]);

  const handleSaveProfile = (updated: ProfileData) => {
    setProfileData(updated);
  };

  return (
    <section className="bg-[#F0EDE6] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {/* Cover Header Card */}
        <header className="relative min-h-[340px] overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] shadow-[12px_12px_0px_#232B26]">
          {/* Canvas Background */}
          <div className="absolute inset-0 z-0 bg-[#232B26]">
            <Dither
              waveColor={[1.0, 1.0, 1.0]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.3}
              colorNum={4}
              pixelSize={2}
              waveAmplitude={0.4}
              waveFrequency={2.5}
              waveSpeed={0.05}
            />
          </div>

          {/* Gradients */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(35,43,38,0.2),rgba(35,43,38,0.7)_85%)]" />

          {/* Content Overlay */}
          <div className="relative z-20 flex min-h-[340px] flex-col justify-between p-6 text-white md:p-8">
            {/* Top Bar Action */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="rounded-2xl border-2 border-white bg-white px-5 py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[4px_4px_0px_#232B26] transition hover:bg-[#85E0C0] active:translate-x-0.5 active:translate-y-0.5"
              >
                {t("editProfileBtn")}
              </button>
            </div>

            {/* Bottom Header Layout: Circular Avatar on Bottom-Left, Centered Details */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Circular Avatar at Bottom Left */}
              <div className="relative flex items-center gap-4">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border-4 border-white bg-[#FFD6A5] font-mono text-3xl font-black text-[#232B26] shadow-[6px_6px_0px_#00A170] md:h-32 md:w-32 md:text-4xl">
                  <span suppressHydrationWarning>{initials}</span>
                </div>

                <div className="hidden sm:block">
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-[#85E0C0]">
                    {t("trainerRole")}
                  </p>
                  <h1
                    suppressHydrationWarning
                    className="text-3xl font-black tracking-tight text-white md:text-5xl"
                  >
                    {profileData.username}
                  </h1>
                  <p
                    suppressHydrationWarning
                    className="mt-1 font-mono text-xs font-bold text-white/80 md:text-sm"
                  >
                    {profileData.email}
                  </p>
                </div>
              </div>

              {/* Centered / Mobile Title View */}
              <div className="text-center sm:hidden">
                <p className="font-mono text-xs font-black uppercase tracking-widest text-[#85E0C0]">
                  {t("trainerRole")}
                </p>
                <h1
                  suppressHydrationWarning
                  className="mt-1 text-3xl font-black tracking-tight text-white"
                >
                  {profileData.username}
                </h1>
                <p
                  suppressHydrationWarning
                  className="mt-1 font-mono text-xs font-bold text-white/80"
                >
                  {profileData.email}
                </p>
              </div>

              {/* Quick Profile Summary Badge */}
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-black">
                {profileData.location && (
                  <div className="rounded-xl border-2 border-white/80 bg-[#232B26]/80 px-3 py-1.5 backdrop-blur-sm shadow-[2px_2px_0px_#FFFFFF]">
                    <span className="text-[#85E0C0]">{t("locationLabel")}</span> {profileData.location}
                  </div>
                )}
                {profileData.favoriteBreed && (
                  <div className="rounded-xl border-2 border-white/80 bg-[#232B26]/80 px-3 py-1.5 backdrop-blur-sm shadow-[2px_2px_0px_#FFFFFF]">
                    <span className="text-[#FFD6A5]">{t("favoriteBreedLabel")}</span> {profileData.favoriteBreed}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Pet Profiles Creation & Management Section */}
        <PetProfileSection />

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={profileData}
          onSave={handleSaveProfile}
        />
      </div>
    </section>
  );
}

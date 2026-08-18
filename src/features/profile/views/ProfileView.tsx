"use client";

import { useMemo, useState, useEffect, useSyncExternalStore, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { authService } from "@/features/auth/services/auth.service";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { UserProfile } from "@/shared/types/auth";
import { profileService } from "../services/profile.service";
import { EditProfileDropdownPanel } from "../components/EditProfileDropdownPanel";
import { PetProfileSection } from "../components/PetProfileSection";
import { dogsService } from "@/features/dogs/services/dogs.service";
import { useToast } from "@/components/ToastContext";

const fallbackUser: AuthUser = {
  id: "",
  username: "",
  email: "",
  role: "user",
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
  const authUser = useMemo<AuthUser>(() => JSON.parse(userSnapshot), [userSnapshot]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(() => ({
    id: authUser.id,
    username: authUser.username,
    email: authUser.email,
    firstName: authUser.firstName || "",
    lastName: authUser.lastName || "",
    country: authUser.country || "Vietnam",
    city: authUser.city || "Ho Chi Minh City",
    phoneNumber: authUser.phoneNumber || "",
    avatarPath: authUser.avatarPath || authUser.avatarUrl || "",
  }));

  // Fetch full user profile from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const fetched = await profileService.getProfile();
        if (isMounted && fetched) {
          setProfileData(fetched);
          try {
            const stored = localStorage.getItem('user');
            const currentUser = stored ? JSON.parse(stored) : {};
            const mergedUser = { ...currentUser, ...fetched };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            window.dispatchEvent(new Event('auth-change'));
          } catch {
            // Ignore parse errors
          }
        }
      } catch {
        // Fall back to authUser
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    const nameStr =
      profileData.firstName || profileData.lastName
        ? `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim()
        : profileData.username || profileData.email || "DD";
    return nameStr
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profileData]);

  const handleUsernameDisplay = useMemo(() => {
    const raw = profileData.username || "username";
    return raw.startsWith("@") ? raw : `@${raw}`;
  }, [profileData]);

  const { toast } = useToast();

  const handleSaveSuccess = (updated: UserProfile) => {
    setProfileData(updated);
    setIsEditOpen(false);
    toast.success(
      "Profile Updated",
      "Your profile details have been saved successfully."
    );
  };

  // Direct Avatar Upload from clicking profile image
  const handleDirectAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Upload Error", "Avatar image size must be smaller than 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const uploadedMediaPath = await dogsService.uploadImage(file, 'uploads/profile');

      const updated = await profileService.updateProfile({
        avatarPath: uploadedMediaPath,
      });

      setProfileData(updated);
      toast.success(
        "Avatar Updated",
        "Your profile picture has been updated successfully."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not update avatar. Please try again.";
      toast.error(
        "Upload Failed",
        msg
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const hasAvatar = Boolean(profileData.avatarPath || profileData.avatarUrl);

  return (
    <section className="bg-[#F0EDE6] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Main Cover Header Card */}
        <header className="relative min-h-[340px] overflow-hidden rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] shadow-[12px_12px_0px_#232B26] [transform:translateZ(0)] isolate">
          {/* Canvas Background */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.25rem] [clip-path:inset(0_round_2.25rem)] [transform:translateZ(0)] bg-[#232B26]">
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
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(35,43,38,0.1),rgba(35,43,38,0.75)_85%)]" />

          {/* Top Right Action: Original Edit Profile Toggle Button */}
          <div className="absolute top-6 right-6 z-30 md:top-8 md:right-8">
            <button
              type="button"
              onClick={() => setIsEditOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl border-2 border-[#232B26] bg-white px-5 py-2.5 font-mono text-xs font-black uppercase text-[#232B26] shadow-[4px_4px_0px_#232B26] transition hover:bg-[#85E0C0] active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>{isEditOpen ? "Close Edit" : t("editProfileBtn")}</span>
              <span
                className={`transform transition-transform duration-300 ${
                  isEditOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>
          </div>

          {/* Center Content: @username in middle of cover canvas */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
            <h1
              suppressHydrationWarning
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none text-center"
            >
              {handleUsernameDisplay}
            </h1>
          </div>

          {/* Bottom Left Content: Profile Image */}
          <div className="absolute bottom-6 left-6 z-30 md:bottom-8 md:left-8">
            <label className="relative block h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-[#FFD6A5] shadow-lg md:h-36 md:w-36">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleDirectAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />

              {hasAvatar && !avatarError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dogsService.mediaUrl(profileData.avatarPath || profileData.avatarUrl)}
                  alt={handleUsernameDisplay}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-mono text-3xl font-black text-[#232B26] md:text-4xl">
                  <span suppressHydrationWarning>{initials}</span>
                </div>
              )}
            </label>
          </div>
        </header>

        {/* Expandable Inline Edit Profile Panel */}
        <EditProfileDropdownPanel
          isOpen={isEditOpen}
          initialData={profileData}
          onSaveSuccess={handleSaveSuccess}
          onCancel={() => setIsEditOpen(false)}
        />

        {/* Pet Profiles Creation & Management Section */}
        <PetProfileSection />
      </div>
    </section>
  );
}

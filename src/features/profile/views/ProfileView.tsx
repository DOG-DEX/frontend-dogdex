"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { authService } from "@/features/auth/services/auth.service";
import type { AuthUser } from "@/features/auth/types/auth.types";

type ProfileFormState = {
  username: string;
  email: string;
  bio: string;
  location: string;
  favoriteBreed: string;
};

const fallbackUser: AuthUser = {
  id: "guest",
  username: "Retro Trainer",
  email: "trainer@dogdex.local",
  role: "collector",
};

const userSnapshotFallback = JSON.stringify(fallbackUser);

const mockMoments = [
  {
    title: "Morning scan",
    detail: "3 breeds discovered near the park route",
    tone: "bg-[#85E0C0]",
  },
  {
    title: "Lost tag ready",
    detail: "Emergency profile and public QR are almost wired",
    tone: "bg-white",
  },
  {
    title: "Dex mood",
    detail: "Soft collector energy with retro field notes",
    tone: "bg-[#FFD6A5]",
  },
];

const mockBadges = ["SHIBA", "QR READY", "CITY WALKER", "42 BREEDS"];

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
  const userSnapshot = useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getAuthServerSnapshot
  );
  const user = useMemo<AuthUser>(() => JSON.parse(userSnapshot), [userSnapshot]);
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [formState, setFormState] = useState<ProfileFormState>(() => ({
    username: fallbackUser.username,
    email: fallbackUser.email,
    bio: "Collecting breed notes, QR tags, and tiny stories from every walk.",
    location: "Ho Chi Minh City",
    favoriteBreed: "Shiba Inu",
  }));

  const initials = useMemo(() => {
    return (formState.username || formState.email || "DD")
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [formState.email, formState.username]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2400);
  };

  const hydrateFromAccount = () => {
    setFormState((current) => ({
      ...current,
      username: user.username || current.username,
      email: user.email || current.email,
    }));
  };

  return (
    <section className="bg-[#F0EDE6] px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="relative min-h-[360px] overflow-hidden rounded-[2rem] border-4 border-[#232B26] bg-[#232B26] shadow-[10px_10px_0px_#232B26]">
          <div className="absolute inset-0 z-0 bg-[#232B26]">
            <Dither
              waveColor={[0.5, 0.5, 0.5]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.3}
              colorNum={4}
              pixelSize={2}
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.18}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(35,43,38,0.34),rgba(35,43,38,0.04)_52%,rgba(35,43,38,0.3))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#232B26] to-transparent" />

          <div className="pointer-events-none relative z-20 flex min-h-[360px] flex-col justify-between p-5 text-white md:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full border-2 border-white bg-[#232B26]/70 px-4 py-2 font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#FFFFFF]">
                Personal cover
              </span>
              <button
                type="button"
                onClick={hydrateFromAccount}
                className="pointer-events-auto rounded-full border-2 border-white bg-white px-4 py-2 font-mono text-xs font-black uppercase text-[#232B26] shadow-[3px_3px_0px_#232B26] transition active:translate-x-0.5 active:translate-y-0.5"
              >
                Sync account
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-end">
              <div className="relative h-32 w-32 rounded-[1.75rem] border-4 border-white bg-[#FFD6A5] text-[#232B26] shadow-[7px_7px_0px_#85E0C0]">
                <div className="absolute inset-3 rounded-[1.05rem] border-2 border-[#232B26] bg-white/80" />
                <div
                  suppressHydrationWarning
                  className="absolute inset-0 grid place-items-center font-mono text-4xl font-black"
                >
                  {initials}
                </div>
              </div>

              <div className="max-w-3xl">
                <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#85E0C0]">
                  DogDex identity
                </p>
                <h1
                  suppressHydrationWarning
                  className="mt-2 text-5xl font-black leading-none tracking-tight md:text-7xl"
                >
                  {formState.username}
                </h1>
                <p
                  suppressHydrationWarning
                  className="mt-3 max-w-full truncate font-mono text-sm font-black text-white/85 md:text-base"
                >
                  {formState.email || user.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.5rem] border-4 border-[#232B26] bg-white p-5 shadow-[8px_8px_0px_#232B26] md:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-wider text-[#FF6B00]">
                  Edit layer
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Make the card feel personal
                </h2>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#4B5750]">
                  Backend profile API is not wired yet, so this edits the visual
                  state only. The fields are shaped so an API payload can plug in
                  later.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing((current) => !current)}
                className="btn-brutal rounded-2xl bg-[#85E0C0] px-5 py-3 text-xs text-[#232B26]"
              >
                {isEditing ? "Preview" : "Edit"}
              </button>
            </div>

            {savedNotice && (
              <div className="mt-5 rounded-2xl border-2 border-[#232B26] bg-[#85E0C0] px-4 py-3 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#232B26]">
                Local profile preview saved
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProfileField
                disabled={!isEditing}
                label="Username"
                value={formState.username}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, username: value }))
                }
              />
              <ProfileField
                disabled={!isEditing}
                label="Email"
                type="email"
                value={formState.email}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, email: value }))
                }
              />
              <ProfileField
                disabled={!isEditing}
                label="Location"
                value={formState.location}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, location: value }))
                }
              />
              <ProfileField
                disabled={!isEditing}
                label="Favorite breed"
                value={formState.favoriteBreed}
                onChange={(value) =>
                  setFormState((current) => ({
                    ...current,
                    favoriteBreed: value,
                  }))
                }
              />
              <label className="md:col-span-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider">
                  Bio
                </span>
                <textarea
                  disabled={!isEditing}
                  value={formState.bio}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 py-3 text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26] disabled:cursor-not-allowed disabled:opacity-70"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!isEditing}
                className="btn-brutal rounded-2xl bg-[#00A170] px-6 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save preview
              </button>
              <button
                type="button"
                disabled={!isEditing}
                onClick={() =>
                  setFormState({
                    username: user.username || fallbackUser.username,
                    email: user.email || fallbackUser.email,
                    bio: "Collecting breed notes, QR tags, and tiny stories from every walk.",
                    location: "Ho Chi Minh City",
                    favoriteBreed: "Shiba Inu",
                  })
                }
                className="btn-brutal rounded-2xl bg-white px-6 py-3 text-sm text-[#232B26] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>

          <aside className="grid gap-5">
            <section className="rounded-[1.5rem] border-4 border-[#232B26] bg-[#FFD6A5] p-5 shadow-[8px_8px_0px_#232B26]">
              <p className="font-mono text-xs font-black uppercase tracking-wider">
                Field notes
              </p>
              <div className="mt-4 grid gap-3">
                {mockMoments.map((moment) => (
                  <article
                    key={moment.title}
                    className={`${moment.tone} rounded-2xl border-2 border-[#232B26] p-4 shadow-[3px_3px_0px_#232B26]`}
                  >
                    <h3 className="text-lg font-black">{moment.title}</h3>
                    <p className="mt-1 text-sm font-bold text-[#4B5750]">
                      {moment.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.5rem] border-4 border-[#232B26] bg-[#232B26] p-5 text-white shadow-[8px_8px_0px_#00A170]">
              <p className="font-mono text-xs font-black uppercase tracking-wider text-[#85E0C0]">
                Badge collage
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {mockBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border-2 border-white bg-white px-3 py-2 font-mono text-[11px] font-black uppercase text-[#232B26] shadow-[3px_3px_0px_#85E0C0]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ProfileField({
  disabled,
  label,
  onChange,
  type = "text",
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label>
      <span className="font-mono text-xs font-black uppercase tracking-wider">
        {label}
      </span>
      <input
        disabled={disabled}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 text-sm font-bold outline-none transition focus:bg-white focus:shadow-[4px_4px_0px_#232B26] disabled:cursor-not-allowed disabled:opacity-70"
      />
    </label>
  );
}

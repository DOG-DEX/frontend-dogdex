"use client";

import { useState } from "react";
import type { UserProfile } from "@/shared/types/auth";
import { profileService } from "../services/profile.service";
import { CountryStatePicker } from "./CountryStatePicker";
import { Country, ICountry } from "country-state-city";

import { useToast } from "@/components/ToastContext";

interface EditProfileDropdownPanelProps {
  isOpen: boolean;
  initialData: Partial<UserProfile>;
  onSaveSuccess: (updated: UserProfile) => void;
  onCancel: () => void;
}

interface FormErrors {
  username?: string;
  phoneNumber?: string;
  avatar?: string;
  general?: string;
}

const allCountries = Country.getAllCountries();

export function EditProfileDropdownPanel({
  isOpen,
  initialData,
  onSaveSuccess,
  onCancel,
}: EditProfileDropdownPanelProps) {
  const { toast } = useToast();
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<Partial<UserProfile> | null>(null);

  const [username, setUsername] = useState(initialData.username || "");
  const [email] = useState(initialData.email || "");
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [selectedCountryCode, setSelectedCountryCode] = useState("VN");
  const [selectedCountryName, setSelectedCountryName] = useState(initialData.country || "Vietnam");
  const [city, setCity] = useState(initialData.city || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      setUsername(initialData.username || "");
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setCity(initialData.city || "");
      setPhoneNumber(initialData.phoneNumber || "");
      setErrors({});

      if (initialData.country) {
        const found = allCountries.find(
          (c: ICountry) =>
            c.name.toLowerCase() === initialData.country?.toLowerCase() ||
            c.isoCode.toLowerCase() === initialData.country?.toLowerCase()
        );
        if (found) {
          setSelectedCountryCode(found.isoCode);
          setSelectedCountryName(found.name);
        } else {
          setSelectedCountryName(initialData.country);
        }
      }
    }
  }

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(username.trim())) {
      newErrors.username = "Username can only contain letters, numbers, dots, underscores, hyphens";
    }

    if (phoneNumber.trim() && !/^\+?[0-9\s-]{8,15}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const updated = await profileService.updateProfile({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        country: selectedCountryName,
        city: city.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      onSaveSuccess(updated);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setErrors((prev) => ({
        ...prev,
        general: errorMsg,
      }));
      toast.error("UPDATE FAILED", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative z-30 transition-all duration-500 ease-in-out ${
        isOpen
          ? "max-h-[2000px] opacity-100 py-4 overflow-visible"
          : "max-h-0 opacity-0 py-0 overflow-hidden"
      }`}
    >
      <div className="rounded-3xl border border-[#232B26]/15 bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#232B26]/10 pb-4">
          <div>
            <h2 className="text-xl font-black text-[#232B26]">Edit Profile Details</h2>
            <p className="mt-1 text-xs text-[#232B26]/60">
              Update your personal details, location, and account avatar.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#232B26]/15 bg-[#F0EDE6]/60 text-sm font-bold text-[#232B26] transition hover:bg-[#232B26] hover:text-white active:scale-95"
          >
            ✕
          </button>
        </div>

        {errors.general && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Email Field (Read-Only) */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#232B26]">
                <span>Email Address</span>
                <span className="rounded bg-[#232B26]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#232B26]/60">
                  Read-Only
                </span>
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-2xl border border-[#232B26]/20 bg-[#232B26]/5 px-4 py-2.5 text-sm font-medium text-[#232B26]/60 cursor-not-allowed opacity-75 focus:outline-none"
              />
              <span className="text-[11px] text-[#232B26]/50">
                Email address cannot be modified once registered.
              </span>
            </div>

            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. trainer_dex"
                className={`w-full rounded-2xl border px-4 py-2.5 text-sm font-medium text-[#232B26] transition focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#232B26]/20 focus:border-[#232B26] focus:ring-[#85E0C0]/50"
                }`}
              />
              {errors.username && (
                <p className="text-[11px] font-bold text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +84 901 234 567"
                className={`w-full rounded-2xl border px-4 py-2.5 text-sm font-medium text-[#232B26] transition focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-400 focus:ring-red-300"
                    : "border-[#232B26]/20 focus:border-[#232B26] focus:ring-[#85E0C0]/50"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-[11px] font-bold text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* First Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-2xl border border-[#232B26]/20 px-4 py-2.5 text-sm font-medium text-[#232B26] transition focus:border-[#232B26] focus:outline-none focus:ring-2 focus:ring-[#85E0C0]/50"
              />
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-2xl border border-[#232B26]/20 px-4 py-2.5 text-sm font-medium text-[#232B26] transition focus:border-[#232B26] focus:outline-none focus:ring-2 focus:ring-[#85E0C0]/50"
              />
            </div>

            {/* Country & State / City Selection using country-state-city */}
            <div className="md:col-span-2">
              <CountryStatePicker
                selectedCountryCode={selectedCountryCode}
                onCountryChange={(code, name) => {
                  setSelectedCountryCode(code);
                  setSelectedCountryName(name);
                  setCity("");
                }}
                selectedCityName={city}
                onCityChange={(cityName) => setCity(cityName)}
                showCity={true}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-[#232B26]/10 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-2xl border border-[#232B26]/20 bg-white px-5 py-2.5 text-xs font-black uppercase text-[#232B26] transition hover:bg-[#232B26]/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl border-2 border-[#232B26] bg-[#232B26] px-6 py-2.5 text-xs font-black uppercase text-white shadow-[4px_4px_0px_#85E0C0] transition hover:bg-[#85E0C0] hover:text-[#232B26] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

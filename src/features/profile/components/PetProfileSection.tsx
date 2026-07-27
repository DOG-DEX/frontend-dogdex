"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { dogsService } from "@/features/dogs/services/dogs.service";
import { CreateDogModal } from "./CreateDogModal";

export type PetProfile = {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  tagId: string;
  color: string;
  notes: string;
};

const DEFAULT_PETS: PetProfile[] = [
  {
    id: "pet-1",
    name: "Kuro",
    breed: "Shiba Inu",
    age: "2 yrs",
    gender: "Male",
    tagId: "DD-SHIBA-8821",
    color: "Black & Tan",
    notes: "Friendly, loves morning walks at Central Park. Microchipped.",
  },
  {
    id: "pet-2",
    name: "Mochi",
    breed: "Golden Retriever",
    age: "1 yr",
    gender: "Female",
    tagId: "DD-GOLD-4410",
    color: "Cream Golden",
    notes: "Playful, trained for basic commands. Smart collar attached.",
  },
];

const STORAGE_KEY = "dogdex_pet_profiles_v1";

export function PetProfileSection() {
  const t = useTranslations("ProfileView");

  const [pets, setPets] = useState<PetProfile[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PETS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PETS;
    } catch {
      return DEFAULT_PETS;
    }
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeQrPet, setActiveQrPet] = useState<PetProfile | null>(null);

  // Fetch backend dogs on mount
  useEffect(() => {
    async function loadBackendDogs() {
      try {
        const backendDogs = await dogsService.listMyDogs();
        if (backendDogs && backendDogs.length > 0) {
          const mapped: PetProfile[] = backendDogs.map((d) => ({
            id: d.id,
            name: d.name,
            breed: d.breed,
            age: d.birthday ? `${new Date(d.birthday).getFullYear()}` : "1 yr",
            gender: d.gender === "female" ? "Female" : "Male",
            tagId: `DD-${d.breed.substring(0, 4).toUpperCase()}-${d.id.substring(
              0,
              4
            )}`,
            color: d.attributes?.color || "Standard",
            notes: `${d.attributes?.pattern ? `Pattern: ${d.attributes.pattern}. ` : ""}${
              d.sterilized ? "Sterilized/Fixed." : ""
            }`,
          }));
          setPets(mapped);
        }
      } catch {
        // Fallback to local state
      }
    }
    loadBackendDogs();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } catch {
      // Ignore storage errors
    }
  }, [pets]);

  const handleDelete = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDogCreated = (createdDog: any) => {
    const formattedPet: PetProfile = {
      id: createdDog.id || `pet-${Date.now()}`,
      name: createdDog.name,
      breed: createdDog.breed,
      age: createdDog.birthday ? `${createdDog.birthday}` : "1 yr",
      gender: createdDog.gender === "female" ? "Female" : "Male",
      tagId: createdDog.tagId || `DD-TAG-${Math.floor(1000 + Math.random() * 9000)}`,
      color: createdDog.attributes?.color || createdDog.color || "Standard",
      notes: createdDog.notes || (createdDog.sterilized ? "Sterilized/Fixed." : ""),
    };

    setPets((prev) => [formattedPet, ...prev]);
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

      {/* Pet Profiles Grid */}
      {pets.length === 0 ? (
        <div className="mt-8 rounded-2xl border-4 border-dashed border-[#232B26] bg-[#F0EDE6] p-8 text-center">
          <p className="font-mono text-sm font-black text-[#232B26]">
            {t("emptyPets")}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="relative flex flex-col justify-between rounded-[1.5rem] border-4 border-[#232B26] bg-[#F0EDE6] p-5 shadow-[6px_6px_0px_#232B26] transition hover:bg-white"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#232B26] bg-[#FFD6A5] font-mono text-xl font-black text-[#232B26] shadow-[3px_3px_0px_#232B26]">
                      {pet.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#232B26]">
                        {pet.name}
                      </h3>
                      <p className="font-mono text-xs font-black uppercase text-[#00A170]">
                        {pet.breed}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border-2 border-[#232B26] bg-[#85E0C0] px-3 py-1 font-mono text-[11px] font-black uppercase text-[#232B26] shadow-[2px_2px_0px_#232B26]">
                    {pet.gender === "Male" ? t("genderMale") : t("genderFemale")}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="rounded-xl border border-[#232B26] bg-white p-2">
                    <span className="font-bold text-[#4B5750]">{t("ageLabel")}:</span>{" "}
                    <span className="font-black">{pet.age}</span>
                  </div>
                  <div className="rounded-xl border border-[#232B26] bg-white p-2">
                    <span className="font-bold text-[#4B5750]">{t("coatLabel")}:</span>{" "}
                    <span className="font-black">{pet.color || "Standard"}</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#232B26] bg-white p-3 font-mono text-xs">
                  <span className="font-bold text-[#00A170]">{t("qrTagLabel")}:</span>{" "}
                  <span className="font-black">{pet.tagId}</span>
                </div>

                {pet.notes && (
                  <p className="mt-3 text-xs font-semibold text-[#4B5750]">
                    {pet.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t-2 border-[#232B26]/20 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveQrPet(pet)}
                  className="rounded-xl border-2 border-[#232B26] bg-[#FFD6A5] px-3 py-1.5 font-mono text-xs font-black text-[#232B26] shadow-[2px_2px_0px_#232B26] transition hover:bg-[#ffc27d]"
                >
                  {t("viewQrTag")}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(pet.id)}
                    className="rounded-xl border-2 border-[#232B26] bg-[#FF6B00] px-3 py-1.5 font-mono text-xs font-black text-white shadow-[2px_2px_0px_#232B26] transition hover:bg-[#e05e00]"
                  >
                    {t("deletePet")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create Dog Modal */}
      <CreateDogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDogCreated={handleDogCreated}
      />

      {/* QR Code Modal Preview */}
      {activeQrPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#232B26]/60 backdrop-blur-sm"
            onClick={() => setActiveQrPet(null)}
          />

          <div className="relative w-full max-w-sm rounded-[2rem] border-4 border-[#232B26] bg-white p-6 text-center shadow-[12px_12px_0px_#232B26]">
            <p className="font-mono text-xs font-black uppercase text-[#00A170]">
              {t("qrModalSubtitle")}
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#232B26]">
              {activeQrPet.name}
            </h3>
            <p className="font-mono text-xs font-bold text-[#4B5750]">
              {activeQrPet.breed} · {activeQrPet.tagId}
            </p>

            {/* QR Mock graphic */}
            <div className="mx-auto mt-5 grid h-48 w-48 place-items-center rounded-2xl border-4 border-[#232B26] bg-[#FFD6A5] p-4 shadow-[4px_4px_0px_#232B26]">
              <div className="grid h-36 w-36 grid-cols-4 grid-rows-4 gap-1.5 rounded-xl border-2 border-[#232B26] bg-white p-2">
                <div className="bg-[#232B26]" />
                <div className="bg-[#232B26]" />
                <div className="bg-transparent" />
                <div className="bg-[#232B26]" />
                <div className="bg-[#232B26]" />
                <div className="bg-[#00A170]" />
                <div className="bg-[#232B26]" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-[#232B26]" />
                <div className="bg-[#232B26]" />
                <div className="bg-[#232B26]" />
                <div className="bg-[#232B26]" />
                <div className="bg-transparent" />
                <div className="bg-[#00A170]" />
                <div className="bg-[#232B26]" />
              </div>
            </div>

            <p className="mt-4 font-mono text-xs font-semibold text-[#4B5750]">
              {t("qrModalAdvice")}
            </p>

            <button
              type="button"
              onClick={() => setActiveQrPet(null)}
              className="mt-5 w-full rounded-2xl border-2 border-[#232B26] bg-[#232B26] py-3 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#85E0C0]"
            >
              {t("closeBtn")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, memo } from "react";
import { Country, State, ICountry, IState } from "country-state-city";
import { CustomSelect } from "@/shared/ui/CustomSelect";

interface CountryStatePickerProps {
  selectedCountryCode: string;
  onCountryChange: (countryCode: string, countryName: string) => void;
  selectedCityName: string;
  onCityChange: (cityName: string) => void;
  showCity?: boolean;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  placement?: "top" | "bottom" | "auto";
}

const allCountries = Country.getAllCountries();

export const CountryStatePicker = memo(function CountryStatePicker({
  selectedCountryCode,
  onCountryChange,
  selectedCityName,
  onCityChange,
  showCity = true,
  disabled = false,
  className,
  selectClassName,
  placement = "auto",
}: CountryStatePickerProps) {
  const countryOptions = useMemo(() => {
    return allCountries.map((c: ICountry) => ({
      value: c.isoCode,
      label: `${c.name} (${c.isoCode})`,
    }));
  }, []);

  const citiesOfCountry = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode) || [];
  }, [selectedCountryCode]);

  const cityOptions = useMemo(() => {
    return citiesOfCountry.map((state: IState) => ({
      value: state.name,
      label: state.name,
    }));
  }, [citiesOfCountry]);

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className || ""}`}>
      {/* Country Selection using CustomSelect */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
          Country <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          value={selectedCountryCode}
          onChange={(code) => {
            const countryObj = allCountries.find((c: ICountry) => c.isoCode === code);
            onCountryChange(code, countryObj?.name || "");
          }}
          options={countryOptions}
          placeholder="Select Country..."
          disabled={disabled}
          enableSearch={true}
          buttonClassName={selectClassName}
          placement={placement}
        />
      </div>

      {/* City Selection using CustomSelect / Fallback Input */}
      {showCity && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#232B26]">
            City / State
          </label>
          {cityOptions.length > 0 ? (
            <CustomSelect
              value={selectedCityName}
              onChange={(cityName) => onCityChange(cityName)}
              options={cityOptions}
              placeholder="Select City / State..."
              disabled={disabled}
              enableSearch={true}
              buttonClassName={selectClassName}
              placement={placement}
            />
          ) : (
            <input
              type="text"
              value={selectedCityName}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter city or state"
              className={`w-full rounded-2xl border-4 border-[#232B26] bg-[#F0EDE6] px-4 py-2.5 font-mono text-sm font-bold text-[#232B26] shadow-[2px_2px_0px_#232B26] transition focus:bg-white focus:outline-none disabled:opacity-50 ${
                selectClassName || ""
              }`}
            />
          )}
        </div>
      )}
    </div>
  );
});

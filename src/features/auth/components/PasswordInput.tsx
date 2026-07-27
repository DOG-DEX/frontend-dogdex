"use client";

import { useRef, useState } from "react";

/**
 * PawIcon — single dog paw SVG used as password character mask.
 * Extracted for clarity and reuse within this component.
 */
function PawIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="#232B26"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none"
      aria-hidden="true"
    >
      {/* Main central pad */}
      <ellipse cx="12" cy="15.5" rx="4.5" ry="3.8" />
      {/* Four toe pads */}
      <ellipse cx="7.2" cy="10.5" rx="2" ry="2.4" />
      <ellipse cx="11" cy="8.8" rx="2" ry="2.4" />
      <ellipse cx="14.9" cy="8.8" rx="2" ry="2.4" />
      <ellipse cx="18.7" cy="10.5" rx="2" ry="2.4" />
    </svg>
  );
}

interface PasswordInputProps {
  /** DOM id for the <input> — used by <label htmlFor> */
  id: string;
  /** Current password value */
  value: string;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** HTML required attribute */
  required?: boolean;
  /** HTML minLength attribute */
  minLength?: number;
  /** autoComplete hint — "current-password" for login, "new-password" for register */
  autoComplete?: string;
  /** Controls whether the password is shown as plain text */
  showPassword: boolean;
  /** Toggles showPassword state in parent */
  onToggleShow: () => void;
  /** Accessible label for the show button */
  showLabel?: string;
  /** Accessible label for the hide button */
  hideLabel?: string;
  /**
   * Extra Tailwind classes appended to the input/display border
   * (e.g., red border for confirm password mismatch).
   */
  extraBorderClass?: string;
}

/**
 * PasswordInput — "paw mask" password field.
 *
 * Architecture (HIDE mode):
 *   ┌──────────────────────────────────────────────────┐
 *   │  <input type="password"> — opacity-0, z-10       │  ← captures ALL keyboard + form events
 *   │  <div> (visual layer) — shows paw icons / placeholder │  ← what the user sees
 *   │  <button> (eye toggle) — z-20                    │
 *   └──────────────────────────────────────────────────┘
 *
 * Why this works where CSS tricks fail:
 *   - The real input is INVISIBLE (opacity-0) so browser never renders bullet dots
 *     or autofill orange highlight in a visible way.
 *   - The visual div is a plain <div> — browser has zero chance to inject password
 *     rendering or autofill overlays into it.
 *   - No color:transparent / fontSize:0 / -webkit-text-fill-color hacks needed.
 *
 * SHOW mode: switches to a normal visible <input type="text">.
 */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete = "current-password",
  showPassword,
  onToggleShow,
  showLabel = "Show password",
  hideLabel = "Hide password",
  extraBorderClass = "",
}: PasswordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * isFocused tracks whether the hidden <input> has focus so we can apply
   * the focus ring to the VISUAL display div (which cannot receive focus itself).
   */
  const [isFocused, setIsFocused] = useState(false);

  /** Shared Tailwind base — applied to both the visible text input and the visual div */
  const sharedBase =
    "w-full rounded-xl border-2 border-[#232B26] bg-white px-3 py-2 pr-10 text-sm font-medium shadow-[2px_2px_0px_#232B26] outline-none transition-all";

  /** Focus ring classes — mirrors the focus:border + focus:ring on a real input */
  const focusClasses = isFocused
    ? "border-[#00A170] ring-2 ring-[#00A170]"
    : "border-[#232B26]";

  return (
    <div className="relative flex items-center">
      {showPassword ? (
        /*
         * ── SHOW MODE ────────────────────────────────────────────────────────
         * Plain text input — password is fully visible, standard browser behavior.
         */
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`${sharedBase} text-[#232B26] placeholder:font-normal placeholder:text-zinc-400 focus:border-[#00A170] focus:ring-2 focus:ring-[#00A170] ${extraBorderClass}`}
          style={{ caretColor: "#232B26" }}
        />
      ) : (
        /*
         * ── HIDE MODE ────────────────────────────────────────────────────────
         * Two-layer approach: invisible real input + visible paw display div.
         */
        <>
          {/*
           * THE REAL INPUT — opacity-0 so it is completely invisible.
           * - z-10: sits on top of the visual div so it receives pointer events
           * - Captures: keystrokes, focus, blur, clipboard paste, form submit value
           * - Browser renders its bullet dots / autofill into this input, but since
           *   it is opacity-0, NOTHING is visible to the user. Zero CSS hacks needed.
           */}
          <input
            ref={inputRef}
            id={id}
            type="password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="" // no placeholder — visual div handles it
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 h-full w-full cursor-text rounded-xl opacity-0 outline-none z-10"
            aria-label={placeholder} // keep accessible even though visually invisible
          />

          {/*
           * VISUAL DISPLAY DIV — what the user actually sees.
           * - pointer-events-none so all clicks fall through to the hidden input
           * - Renders: placeholder text (when empty) or one paw icon per character
           * - Focus ring is driven by isFocused state from the real input above
           */}
          <div
            aria-hidden="true"
            className={`${sharedBase} ${focusClasses} ${extraBorderClass} pointer-events-none flex min-h-[38px] items-center overflow-hidden`}
          >
            {value.length === 0 ? (
              /* Placeholder mimic */
              <span className="font-normal text-zinc-400">{placeholder}</span>
            ) : (
              /* One paw icon per typed character */
              <span className="flex items-center gap-[3px]">
                {Array.from({ length: value.length }).map((_, i) => (
                  <PawIcon key={i} />
                ))}
              </span>
            )}
          </div>
        </>
      )}

      {/* ── Eye toggle button ── z-20 so it sits above the hidden input (z-10) */}
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-2.5 z-20 p-1 text-[#232B26] transition-colors hover:text-[#00A170]"
        aria-label={showPassword ? hideLabel : showLabel}
        title={showPassword ? hideLabel : showLabel}
      >
        {showPassword ? (
          /* Open eye — password is visible */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          /* Closed eye — password masked with paw icons */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
    </div>
  );
}

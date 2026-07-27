"use client";

import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
    const media = window.matchMedia(query);
    const listener = () => onStoreChange();

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

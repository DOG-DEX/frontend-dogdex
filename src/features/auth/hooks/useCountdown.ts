'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/** A reusable second-by-second cooldown for auth actions such as OTP resend. */
export function useCountdown(): [number, Dispatch<SetStateAction<number>>] {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => value - 1), 1_000);
    return () => window.clearInterval(timer);
  }, [remaining]);

  return [remaining, setRemaining];
}

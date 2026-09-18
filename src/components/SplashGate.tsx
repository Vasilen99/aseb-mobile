import React, { useEffect, useState } from 'react';
import PulseLoader from './PulseLoader';

interface SplashGateProps {
  children: React.ReactNode;
  /**
   * Optional async work to await before showing the app
   * (e.g. font loading, cache hydration, auth restore).
   */
  prepare?: () => Promise<void>;
  /** Minimum time (ms) the loader stays visible so the pulse is noticeable. */
  minDuration?: number;
}

export default function SplashGate({ children, prepare, minDuration = 1200 }: SplashGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();

    (async () => {
      try {
        await prepare?.();
      } catch (e) {
        console.warn('SplashGate prepare failed', e);
      } finally {
        const remaining = Math.max(0, minDuration - (Date.now() - start));
        setTimeout(() => {
          if (!cancelled) setReady(true);
        }, remaining);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [prepare, minDuration]);

  if (!ready) return <PulseLoader />;
  return <>{children}</>;
}

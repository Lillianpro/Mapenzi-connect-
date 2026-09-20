import { useState, useEffect } from 'react';

/**
 * Custom React hook that automatically tracks and syncs with browser navigator.onLine state.
 * Emits updates instantly when device connects or disconnects from network.
 */
let simulatedOverride: boolean | null = null;
const listeners = new Set<(online: boolean) => void>();

export function toggleSimulatedNetworkStatus(): boolean {
  const currentActual = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
  const currentEffective = simulatedOverride !== null ? simulatedOverride : currentActual;
  const next = !currentEffective;
  simulatedOverride = next;
  listeners.forEach((cb) => cb(next));
  return next;
}

export function resetToNavigatorStatus(): void {
  simulatedOverride = null;
  const actual = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
  listeners.forEach((cb) => cb(actual));
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (simulatedOverride !== null) return simulatedOverride;
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      simulatedOverride = null;
      setIsOnline(true);
      listeners.forEach((cb) => cb(true));
    };

    const handleOffline = () => {
      simulatedOverride = null;
      setIsOnline(false);
      listeners.forEach((cb) => cb(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const listener = (status: boolean) => {
      setIsOnline(status);
    };
    listeners.add(listener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      listeners.delete(listener);
    };
  }, []);

  return isOnline;
}

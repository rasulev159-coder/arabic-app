import { useEffect } from 'react';

/**
 * Warns user before leaving page during active game session.
 * @param active - whether the game session is in progress
 */
export function useLeaveWarning(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [active]);
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../lib/api';
import { Button } from './Button';

// Placeholder VAPID public key — replace with actual generated key
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BPlaceHolderKeyReplaceMeWithActualVAPIDPublicKeyGeneratedByWebPush00000000000000000000';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToPush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
  });
  await api.post('/notifications/subscribe', { subscription: sub.toJSON() });
}

export function NotificationPrompt() {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only show if: browser supports notifications, permission not yet decided, user hasn't dismissed
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      !('serviceWorker' in navigator) ||
      Notification.permission !== 'default' ||
      localStorage.getItem('notification-prompt-dismissed') === 'true'
    ) {
      return;
    }
    setVisible(true);
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeToPush();
        setEnabled(true);
        setTimeout(() => setVisible(false), 2000);
      } else {
        // User denied — hide prompt
        localStorage.setItem('notification-prompt-dismissed', 'true');
        setVisible(false);
      }
    } catch (e) {
      console.error('Failed to subscribe to push:', e);
      localStorage.setItem('notification-prompt-dismissed', 'true');
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-prompt-dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-[#1a1508] to-[#201a08] border border-[rgba(201,168,76,0.2)]
                    rounded-2xl p-4 mb-4 flex items-center gap-3">
      <span className="text-2xl shrink-0">🔔</span>
      <div className="flex-1 min-w-0">
        {enabled ? (
          <p className="font-cinzel text-xs tracking-widest text-[#4caf78] uppercase">
            {t('notifications.enabled')}
          </p>
        ) : (
          <>
            <p className="font-cinzel text-xs tracking-wide text-[#f0e6cc]">
              {t('notifications.enable')}
            </p>
            <p className="font-raleway text-[0.65rem] text-[#9a8a6a] mt-0.5">
              {t('notifications.enable_desc')}
            </p>
          </>
        )}
      </div>
      {!enabled && (
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={handleEnable}>
            {t('notifications.enable')}
          </Button>
          <button
            onClick={handleDismiss}
            className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a]
                       hover:text-gold-light uppercase transition-colors px-2"
          >
            {t('notifications.dismiss')}
          </button>
        </div>
      )}
    </div>
  );
}

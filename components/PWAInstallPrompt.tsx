'use client';
import { useState, useEffect } from "react"

function PWAInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  const handleInstallClick = async () => {
    console.log('Install button clicked', deferredPrompt);

    if (deferredPrompt && 'prompt' in deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  return isStandalone ? null : (
    <button
      className="w-full px-3 py-2 rounded bg-gray-900 text-white hover:bg-gray-700 border border-gray-300 text-sm mt-2 transition-colors"
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
    >
      Install App
    </button>
  );
}

export default PWAInstallPrompt
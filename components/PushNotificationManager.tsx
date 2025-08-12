'use client';
import React, { useState, useEffect } from "react"

import { subscribeUser, unsubscribeUser, sendNotification } from '@/actions/pwa'
import { useAuthUserContext } from '@/context/AuthContext';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const { user } = useAuthUserContext();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/script/sw.js', {
      scope: '/script/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    if (!user) return;
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = { ...JSON.parse(JSON.stringify(sub)), uid: user.uid };
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    if (!user) return;
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(user.uid);
  }

  async function sendTestNotification() {
    if (subscription && user) {
      await sendNotification(user.uid, message);
      setMessage('');
    }
  }

  if (!isSupported) return null;
  return subscription ? (
    <button
      className="w-full px-3 py-2 rounded bg-gray-800 text-white hover:bg-black text-sm"
      onClick={unsubscribeFromPush}
    >
      Unsubscribe Push
    </button>
  ) : (
    <button
      className="w-full px-3 py-2 rounded bg-gray-200 text-black hover:bg-gray-400 text-sm"
      onClick={subscribeToPush}
    >
      Enable Push
    </button>
  );
}

export default PushNotificationManager
'use server'
 
import webpush from 'web-push'
import { saveUserPushSubscription, removeUserPushSubscription, getUserPushSubscription } from '@/lib/database';

webpush.setVapidDetails(
  'mailto:fakea1551@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)


// Save the subscription object in the user's Firestore document
export async function subscribeUser(sub: PushSubscription & { uid: string }) {
  return await saveUserPushSubscription(sub.uid, sub);
}
 

export async function unsubscribeUser(uid: string) {
  return await removeUserPushSubscription(uid);
}
 

// Send notification to the user's saved subscription
export async function sendNotification(uid: string, message: string) {
  const subscription = await getUserPushSubscription(uid);
  if (!subscription) {
    throw new Error('No subscription available for this user');
  }
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
import { convertBase64ToUint8Array } from './utils/index.js';

const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Export notification state
export let isNotificationEnabled = localStorage.getItem('notificationEnabled') === 'true';

export function setNotificationEnabled(enabled) {
  isNotificationEnabled = enabled;
  localStorage.setItem('notificationEnabled', enabled.toString());
}

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi ditolak.');
    throw new Error('Notifikasi ditolak user.');
  }

  // Jika granted, lanjutkan subscribe ke push
  await subscribeUserToPush();
}

export async function subscribeUserToPush() {
  await navigator.serviceWorker.register('/service-worker.js');
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(vapidPublicKey),
  });

  const subscriptionJSON = subscription.toJSON();
  const subscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscriptionJSON.keys.p256dh,
      auth: subscriptionJSON.keys.auth,
    }
  };



  // Kirim ke API Dicoding
  await sendSubscriptionToServer(subscriptionData);
}

async function sendSubscriptionToServer(subscription) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('⚠️ Token tidak ditemukan di localStorage');
    return;
  }

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    const result = await response.json();
    console.log('✅ Subscription berhasil dikirim:', result.message);
  } catch (error) {
    console.error('❌ Gagal mengirim subscription:', error);
  }
}

export async function unsubscribeUserFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('⚠️ Token tidak ditemukan di localStorage');
    return;
  }

  try {
    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      }),
    });

    await subscription.unsubscribe();
    console.log('❎ Berhasil unsubscribe dan hapus subscription');
  } catch (error) {
    console.error('❌ Gagal unsubscribe:', error);
  }
}

// Function to send manual notification
export function sendStoryNotification(description) {
  if ('serviceWorker' in navigator && 
      Notification.permission === 'granted' && 
      isNotificationEnabled) {
    
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        registration.active.postMessage({
          title: 'Story berhasil dibuat',
          body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
        });
      }
    });
  }
}


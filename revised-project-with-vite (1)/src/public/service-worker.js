const CACHE_NAME = 'story-app-v1';
const STATIC_CACHE = 'static-resources-v1';
const API_CACHE = 'api-cache-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle API requests
  if (request.url.includes('story-api.dicoding.dev')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/') || caches.match('/index.html') || new Response(
            `<!DOCTYPE html>
            <html>
            <head><title>Offline</title></head>
            <body><h1>You are offline</h1><p>Please check your connection</p></body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return fetchResponse;
          });
      })
      .catch(() => {
        // Return fallback for failed requests
        if (request.destination === 'image') {
          return new Response('', { status: 404 });
        }
        return new Response('Network error', { status: 503 });
      })
  );
});

// Push notification handler
self.addEventListener('push', function (event) {
    let data = {};
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            console.error('Error parsing push data:', e);
        }
    }
    
    const title = data.title || 'Notifikasi Baru!';
    const options = {
        body: data.options?.body || 'Kamu mendapat pesan baru.',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: 'story-notification',
        requireInteraction: true,
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Message handler for manual notifications
self.addEventListener('message', (event) => {
    const { title, body } = event.data;

    console.log('✅ Menerima pesan dari halaman:', event.data);

    const options = {
        body: body || 'Tidak ada deskripsi',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: 'manual-notification',
        requireInteraction: true,
        data: event.data
    };

    self.registration.showNotification(title || 'Notifikasi', options);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll().then((clientList) => {
            // Try to focus existing window first
            for (const client of clientList) {
                if (client.url === self.location.origin && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no existing window, open new one
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});





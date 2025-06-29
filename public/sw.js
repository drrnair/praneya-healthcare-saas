// Praneya Healthcare PWA Service Worker
// Version: 1.0.0

const CACHE_NAME = 'praneya-healthcare-v1';
const RUNTIME_CACHE = 'praneya-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/images/hero/diverse-families-cooking.jpg'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/health-check',
  '/api/ai/analyze-nutrition',
  '/api/users/',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different request types with appropriate strategies
  event.respondWith(handleRequest(request, url));
});

// Main request handler
async function handleRequest(request, url) {
  // Static assets - Cache First
  if (isStaticAsset(url)) {
    return cacheFirst(request);
  }

  // API requests - Network First with offline fallback
  if (isApiRequest(url)) {
    return networkFirstWithFallback(request);
  }

  // HTML pages - Network First with offline fallback
  if (isHTMLRequest(request)) {
    return networkFirstWithOffline(request);
  }

  // Images - Cache First with network fallback
  if (isImageRequest(request)) {
    return cacheFirst(request);
  }

  // External resources - Stale While Revalidate
  if (isExternalResource(url)) {
    return staleWhileRevalidate(request);
  }

  // Default - Network with cache fallback
  return networkWithCacheFallback(request);
}

// Cache strategies implementation

async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for API requests
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      offline: true,
      timestamp: Date.now()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return caches.match('/offline');
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match(request) || new Response('Content not available offline', { status: 503 });
  }
}

// Helper functions

function isStaticAsset(url) {
  return url.pathname.includes('/static/') ||
         url.pathname.includes('/images/') ||
         url.pathname.includes('/icons/') ||
         url.pathname.includes('/_next/static/');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') ||
         API_CACHE_PATTERNS.some(pattern => url.pathname.includes(pattern));
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

function isImageRequest(request) {
  return request.headers.get('accept')?.includes('image/') ||
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
}

function isExternalResource(url) {
  return url.origin !== self.location.origin;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  try {
    // Sync cached health data when online
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedRequests = await cache.keys();
    
    for (const request of cachedRequests) {
      if (request.url.includes('/api/health/') && request.method === 'POST') {
        try {
          await fetch(request);
          await cache.delete(request);
          console.log('[SW] Synced health data:', request.url);
        } catch (error) {
          console.error('[SW] Failed to sync health data:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Stay on track with your health goals!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/images/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/images/icons/dismiss-icon.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('Praneya Healthcare', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/health/dashboard')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'health-reminder') {
    event.waitUntil(sendHealthReminder());
  }
});

async function sendHealthReminder() {
  try {
    // Send periodic health reminders
    await self.registration.showNotification('Health Check Reminder', {
      body: 'Time for your daily health check-in!',
      icon: '/images/icons/icon-192x192.png',
      data: { type: 'health-reminder' }
    });
  } catch (error) {
    console.error('[SW] Failed to send health reminder:', error);
  }
}

// Clean up old cache entries periodically
setInterval(async () => {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const keys = await cache.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge) {
            await cache.delete(request);
            console.log('[SW] Cleaned up old cache entry:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily 
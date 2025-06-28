// Praneya Healthcare PWA Service Worker
// Optimized for healthcare data with offline support and background sync

const CACHE_NAME = 'praneya-healthcare-v1';
const STATIC_CACHE = 'praneya-static-v1';
const DYNAMIC_CACHE = 'praneya-dynamic-v1';
const API_CACHE = 'praneya-api-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/health',
  '/medications',
  '/family',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints that can be cached
const CACHEABLE_API_ROUTES = [
  '/api/health-goals',
  '/api/streaks',
  '/api/achievements',
  '/api/health-score',
  '/api/user/profile'
];

// Critical healthcare data that should never be cached
const NEVER_CACHE_ROUTES = [
  '/api/medications/emergency',
  '/api/emergency',
  '/api/auth',
  '/api/payments'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Cache cleanup complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Never cache critical healthcare endpoints
  if (NEVER_CACHE_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleAPIRequest(request));
    } else {
      event.respondWith(handlePageRequest(request));
    }
  } else if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIPost(request));
  }
});

// Handle page requests with cache-first strategy for static assets
async function handlePageRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try cache first for static assets
    if (STATIC_ASSETS.includes(url.pathname) || 
        url.pathname.includes('.js') || 
        url.pathname.includes('.css') ||
        url.pathname.includes('/icons/')) {
      
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your connection', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    }
    
    throw error;
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses for cacheable routes
      if (CACHEABLE_API_ROUTES.some(route => url.pathname.includes(route))) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: API network failed, trying cache:', error);
    
    // Fallback to cached API response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator header
      const response = cachedResponse.clone();
      response.headers.set('X-From-Cache', 'true');
      return response;
    }
    
    // Return error response for failed API calls
    return new Response(JSON.stringify({
      error: 'Offline - Data unavailable',
      offline: true
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle POST requests with background sync
async function handleAPIPost(request) {
  try {
    // Try to send immediately
    const response = await fetch(request);
    return response;
    
  } catch (error) {
    console.log('Service Worker: POST failed, queuing for background sync:', error);
    
    // Store request for background sync
    const requestData = {
      url: request.url,
      method: request.method,
      headers: [...request.headers.entries()],
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for background sync
    await storeFailedRequest(requestData);
    
    // Register background sync
    if (self.registration.sync) {
      await self.registration.sync.register('healthcare-data-sync');
    }
    
    return new Response(JSON.stringify({
      queued: true,
      message: 'Request queued for when connection is restored'
    }), {
      status: 202,
      statusText: 'Accepted',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Background sync for healthcare data
self.addEventListener('sync', (event) => {
  if (event.tag === 'healthcare-data-sync') {
    event.waitUntil(syncHealthcareData());
  }
});

// Sync queued healthcare data when online
async function syncHealthcareData() {
  console.log('Service Worker: Syncing healthcare data...');
  
  try {
    const failedRequests = await getFailedRequests();
    
    for (const requestData of failedRequests) {
      try {
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        const response = await fetch(request);
        
        if (response.ok) {
          await removeFailedRequest(requestData.timestamp);
          console.log('Service Worker: Synced request:', requestData.url);
          
          // Notify client of successful sync
          notifyClients('sync-success', {
            url: requestData.url,
            timestamp: requestData.timestamp
          });
        }
        
      } catch (error) {
        console.log('Service Worker: Sync failed for:', requestData.url, error);
      }
    }
    
  } catch (error) {
    console.log('Service Worker: Background sync failed:', error);
  }
}

// IndexedDB operations for failed requests
async function storeFailedRequest(requestData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('praneya-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      
      store.add(requestData);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('requests', { keyPath: 'timestamp' });
    };
  });
}

async function getFailedRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('praneya-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

async function removeFailedRequest(timestamp) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('praneya-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      
      store.delete(timestamp);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

// Notify clients of important events
function notifyClients(type, data) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type,
        data
      });
    });
  });
}

// Push notifications for medication reminders
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'healthcare-notification',
    requireInteraction: data.urgent || false,
    actions: data.actions || [],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  
  let url = '/dashboard';
  
  if (action === 'log-medication') {
    url = '/medications/log';
  } else if (action === 'view-appointment') {
    url = '/appointments';
  } else if (data?.url) {
    url = data.url;
  }
  
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      // Check if app is already open
      const existingClient = clients.find(client => 
        client.url.includes(url) && 'focus' in client
      );
      
      if (existingClient) {
        return existingClient.focus();
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
}); 
const CACHE_NAME = 'rapidapi-generator-v1.0.0';
const urlsToCache = [
  '/Rapid_API-Generator/',
  '/Rapid_API-Generator/index.html',
  '/Rapid_API-Generator/manifest.json',
  // Add any other static assets you want to cache
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external API requests (let them go through normally)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // You could return a custom offline page here
        if (event.request.destination === 'document') {
          return caches.match('/Rapid_API-Generator/index.html');
        }
      })
  );
});

// Handle background sync for offline functionality
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // You can add offline functionality here
    console.log('Performing background sync...');
    
    // Example: Sync offline generated code
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      console.log('Syncing offline data:', offlineData);
      // Process offline data when back online
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline data from IndexedDB or localStorage
async function getOfflineData() {
  // This is a placeholder - you can implement actual offline storage
  return [];
}

// Handle push notifications (if you want to add them later)
self.addEventListener('push', event => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New RapidAPI features available!',
    icon: '/Rapid_API-Generator/icon-192x192.png',
    badge: '/Rapid_API-Generator/icon-64x64.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Features',
        icon: '/Rapid_API-Generator/icon-64x64.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/Rapid_API-Generator/icon-64x64.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('RapidAPI Generator', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/Rapid_API-Generator/')
    );
  }
});
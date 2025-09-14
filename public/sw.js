const CACHE_NAME = 'weekendly-v1';
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { mode: 'no-cors' })));
      })
      .catch(error => {
        console.log('Service Worker: Error caching assets', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then(fetchResponse => {
            // Don't cache if not ok
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Weekendly - Offline</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }
                .offline-container { max-width: 400px; margin: 2rem auto; }
                .emoji { font-size: 3rem; margin-bottom: 1rem; }
                h1 { color: #374151; margin-bottom: 0.5rem; }
                p { color: #6b7280; margin-bottom: 2rem; }
                .button { 
                  background: #8b5cf6; color: white; padding: 0.75rem 1.5rem; 
                  border: none; border-radius: 0.5rem; cursor: pointer; 
                  text-decoration: none; display: inline-block;
                }
              </style>
            </head>
            <body>
              <div class="offline-container">
                <div class="emoji">📱</div>
                <h1>You're Offline</h1>
                <p>Weekendly works offline! Your saved weekend plans are still available.</p>
                <button class="button" onclick="window.location.reload()">Try Again</button>
              </div>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        return new Response('Offline', { status: 503 });
      })
  );
});

// Background sync for schedule saves
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-schedule') {
    console.log('Service Worker: Background sync for schedule');
    event.waitUntil(syncScheduleData());
  }
});

// Push notification support (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      actions: [
        {
          action: 'view',
          title: 'View Weekend Plan'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.matchAll().then(clients => {
        if (clients.length > 0) {
          return clients[0].focus();
        } else {
          return clients.openWindow('/');
        }
      })
    );
  }
});

async function syncScheduleData() {
  try {
    // Get pending schedule data from IndexedDB
    const scheduleData = await getStoredScheduleData();
    
    if (scheduleData) {
      // Attempt to sync with server (if we had a backend)
      console.log('Service Worker: Syncing schedule data', scheduleData);
      
      // For now, just resolve successfully since we use localStorage
      return Promise.resolve();
    }
  } catch (error) {
    console.error('Service Worker: Error syncing schedule data', error);
    throw error;
  }
}

async function getStoredScheduleData() {
  // This would integrate with IndexedDB or localStorage
  // For now, return null as we handle persistence in the app
  return null;
}
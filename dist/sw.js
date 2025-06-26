const CACHE_NAME = 'incles-charity-v1.0.0'
const STATIC_CACHE_NAME = 'incles-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'incles-dynamic-v1.0.0'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/main.css',
  '/static/js/main.js',
  '/src/assets/logo.png',
  '/offline.html'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/causes/,
  /\/api\/testimonials/,
  /\/api\/stats/
]

// Image cache patterns
const IMAGE_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\/images\//,
  /\/assets\//
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML documents - Network first, then cache
    event.respondWith(handleDocumentRequest(request))
  } else if (IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // Images - Cache first, then network
    event.respondWith(handleImageRequest(request))
  } else if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request))
  } else if (request.destination === 'style' || request.destination === 'script') {
    // CSS/JS - Cache first, then network
    event.respondWith(handleStaticAssetRequest(request))
  } else {
    // Other requests - Network first
    event.respondWith(handleOtherRequest(request))
  }
})

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page if available
    const offlineResponse = await caches.match('/offline.html')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Last resort - basic offline response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Incles</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-message { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 64px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return placeholder image if available
    const placeholderResponse = await caches.match('/images/placeholder.png')
    if (placeholderResponse) {
      return placeholderResponse
    }
    
    // Return empty response
    return new Response('', { status: 404 })
  }
}

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses for a limited time
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      const responseToCache = networkResponse.clone()
      
      // Add timestamp for cache expiration
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-timestamp', Date.now().toString())
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, modifiedResponse)
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Check if cache is still valid (1 hour)
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp')
      if (cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp)
        if (cacheAge < 3600000) { // 1 hour
          return cachedResponse
        }
      }
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static asset requests (CSS, JS)
async function handleStaticAssetRequest(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('', { status: 404 })
  }
}

// Handle other requests
async function handleOtherRequest(request) {
  try {
    return await fetch(request)
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('', { status: 404 })
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'donation-sync') {
    event.waitUntil(syncDonations())
  } else if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletterSignups())
  }
})

// Sync offline donations when back online
async function syncDonations() {
  try {
    const donations = await getStoredDonations()
    
    for (const donation of donations) {
      try {
        const response = await fetch('/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(donation)
        })
        
        if (response.ok) {
          await removeStoredDonation(donation.id)
          console.log('Donation synced successfully:', donation.id)
        }
      } catch (error) {
        console.error('Failed to sync donation:', donation.id, error)
      }
    }
  } catch (error) {
    console.error('Error syncing donations:', error)
  }
}

// Sync newsletter signups
async function syncNewsletterSignups() {
  try {
    const signups = await getStoredNewsletterSignups()
    
    for (const signup of signups) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signup)
        })
        
        if (response.ok) {
          await removeStoredNewsletterSignup(signup.id)
          console.log('Newsletter signup synced successfully:', signup.id)
        }
      } catch (error) {
        console.error('Failed to sync newsletter signup:', signup.id, error)
      }
    }
  } catch (error) {
    console.error('Error syncing newsletter signups:', error)
  }
}

// IndexedDB helpers for offline storage
async function getStoredDonations() {
  // Implementation would use IndexedDB to retrieve stored donations
  return []
}

async function removeStoredDonation(id) {
  // Implementation would remove donation from IndexedDB
}

async function getStoredNewsletterSignups() {
  // Implementation would use IndexedDB to retrieve stored signups
  return []
}

async function removeStoredNewsletterSignup(id) {
  // Implementation would remove signup from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: 'Thank you for supporting our mission!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Causes',
        icon: '/icons/causes-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  }
  
  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.title = data.title || 'Incles Update'
  }
  
  event.waitUntil(
    self.registration.showNotification('Incles Charity Platform', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/causes')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag)
  
  if (event.tag === 'update-causes') {
    event.waitUntil(updateCausesCache())
  }
})

// Update causes cache in background
async function updateCausesCache() {
  try {
    const response = await fetch('/api/causes')
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put('/api/causes', response.clone())
      console.log('Causes cache updated')
    }
  } catch (error) {
    console.error('Failed to update causes cache:', error)
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})


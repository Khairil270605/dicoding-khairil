// service-worker.js

const CACHE_NAME = 'story-app-v1';
const STATIC_CACHE_NAME = 'story-app-static-v1';
const DYNAMIC_CACHE_NAME = 'story-app-dynamic-v1';

const urlsToCache = [
  '/', '/index.html', '/app.js', '/router.js', '/style.css', '/manifest.json', '/favicon.ico',
  // File CSS
  '/styles/main.css',
  // Modul JS
  '/services/apiService.js',
  '/services/notificationService.js',
  '/db.js',
  '/presenter/loginPresenter.js',
  '/presenter/registerPresenter.js',
  '/presenter/storyListPresenter.js',
  '/presenter/addStoryPresenter.js',
  '/presenter/mapPresenter.js',
  '/presenter/favoritePresenter.js',
  '/views/login.js',
  '/views/register.js',
  '/views/storyList.js',
  '/views/addStory.js',
  '/views/map.js',
  '/views/favorites.js',
  '/views/createMapTemplate.js',
  // Sumber eksternal
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  // Aset app shell
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/badge-72x72.png',
  // Halaman fallback
  '/pages/offline.html',
  '/images/offline.svg',
];

// Event install - Menyimpan cache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Cache dibuka');
      return cache.addAll(urlsToCache);
    })
  );
});

// Event activate - Menghapus cache lama
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker siap mengontrol semua klien');
      return self.clients.claim();
    })
  );
});

// Fungsi untuk memeriksa apakah request adalah API request
const isApiRequest = (request) => {
  return request.url.includes('dicoding.dev/v1');
};

// Strategi Cache kemudian Network untuk aset statis
const cacheFirstStrategy = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Jika gagal fetching dan tidak ada di cache, kembalikan halaman offline untuk navigasi
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      return cache.match('/pages/offline.html');
    }
    
    // Untuk gambar atau aset lain yang gagal diambil
    if (request.destination === 'image') {
      return caches.match('/images/offline.svg');
    }
    
    return new Response('Tidak dapat menghubungi server. Periksa koneksi internet Anda.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Strategi Network kemudian Cache untuk API requests
const networkFirstStrategy = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    // Jika response adalah untuk API stories, simpan ke dynamic cache
    if (networkResponse.ok && request.url.includes('/stories')) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Gagal mengambil dari jaringan, mencoba cache', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Jika tidak ada cache, kembalikan respons error
    return new Response(JSON.stringify({ 
      error: true, 
      message: 'Tidak dapat menghubungi server. Periksa koneksi internet Anda.' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Event fetch - Strategi caching yang lebih baik
self.addEventListener('fetch', (event) => {
  // Skip untuk chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Untuk permintaan API
  if (isApiRequest(event.request)) {
    // Untuk GET request ke stories endpoint
    if (event.request.method === 'GET') {
      event.respondWith(networkFirstStrategy(event.request));
    } else {
      // Untuk POST, PUT, DELETE, langsung ke jaringan
      event.respondWith(fetch(event.request));
    }
  } else {
    // Untuk aset statis
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// Event push - Menampilkan notifikasi push
self.addEventListener('push', (event) => {
  console.log('Push event diterima', event);

  let notificationData = {
    title: 'Story App',
    body: 'Ada update baru!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    url: '/#/stories'
  };

  try {
    if (event.data) {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'Story App',
        body: data.body || 'Ada update baru!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/#/stories'
        }
      };
    }
  } catch (error) {
    console.error('Gagal mem-parsing data notifikasi push:', error);
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: notificationData.vibrate,
      data: notificationData.data
    })
  );
});

// Event klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let url = '/#/stories';
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Jika ada jendela klien yang sudah terbuka, fokuskan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Jika tidak ada jendela yang terbuka, buka jendela baru
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Sync events untuk mengirim data saat aplikasi online kembali
self.addEventListener('sync', (event) => {
  console.log('Sync event diterima', event.tag);

  if (event.tag === 'sync-new-stories') {
    event.waitUntil(syncNewStories());
  }
});

// Fungsi untuk mengirim cerita yang disimpan di IndexedDB saat offline
async function syncNewStories() {
  try {
    // Implementasi sinkronisasi draf cerita yang tersimpan saat offline
    // Code ini dapat diimplementasikan sesuai dengan kebutuhan aplikasi
    console.log('Mensinkronkan cerita baru yang disimpan saat offline');
    
    // Contoh:
    // 1. Ambil token dari localStorage
    // 2. Ambil draf cerita dari IndexedDB atau localStorage
    // 3. Kirim ke server menggunakan fetch
    
    return true;
  } catch (error) {
    console.error('Gagal mensinkronkan cerita:', error);
    throw error;
  }
}
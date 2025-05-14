// services/notificationService.js
import { ApiService } from './apiService.js';

export const NotificationService = {
  // Inisialisasi layanan notifikasi push
  async init() {
    try {
      // Periksa apakah service worker didukung
      if (!('serviceWorker' in navigator)) {
        console.error('Service Worker tidak didukung di browser ini');
        return false;
      }

      // Periksa apakah push notification didukung
      if (!('PushManager' in window)) {
        console.error('Push notification tidak didukung di browser ini');
        return false;
      }

      // Ambil kunci publik VAPID dari API
      const vapidPublicKey = await this.getVapidKey();
      if (!vapidPublicKey) {
        console.error('Gagal mendapatkan kunci publik VAPID');
        return false;
      }

      // Daftarkan service worker jika belum terdaftar
      let registration;
      try {
        registration = await navigator.serviceWorker.ready;
      } catch (error) {
        registration = await navigator.serviceWorker.register('/service-worker.js');
      }
      console.log('Service Worker berhasil didaftarkan:', registration);

      return registration;
    } catch (error) {
      console.error('Terjadi kesalahan saat inisialisasi layanan notifikasi:', error);
      return false;
    }
  },

  // Ambil kunci publik VAPID dari API
  async getVapidKey() {
    try {
      // Menggunakan ApiService yang sudah dibuat untuk mengambil kunci VAPID
      const publicKey = await ApiService.getVapidPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil kunci VAPID:', error);
      return null;
    }
  },

  // Meminta izin notifikasi dari pengguna
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Izin notifikasi ditolak');
      }
      return true;
    } catch (error) {
      console.error('Terjadi kesalahan saat meminta izin notifikasi:', error);
      return false;
    }
  },

  // Konversi kunci VAPID ke Array Buffer
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  // Berlangganan notifikasi push
  async subscribe() {
    try {
      // Minta izin terlebih dahulu
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        return false;
      }

      // Inisialisasi service worker
      const registration = await this.init();
      if (!registration) {
        return false;
      }

      // Periksa apakah sudah ada langganan
      let subscription = await registration.pushManager.getSubscription();

      // Jika belum berlangganan, buat langganan baru
      if (!subscription) {
        const vapidPublicKey = await this.getVapidKey();
        const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
        
        console.log('Pengguna berhasil berlangganan notifikasi:', subscription);

        // Kirim langganan ke server
        await this.sendSubscriptionToServer(subscription);
      }

      return subscription;
    } catch (error) {
      console.error('Terjadi kesalahan saat berlangganan notifikasi:', error);
      return false;
    }
  },

  // Berhenti berlangganan notifikasi push
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Kirim permintaan berhenti langganan ke server
        await this.sendUnsubscribeToServer(subscription);

        // Berhenti berlangganan dari PushManager
        await subscription.unsubscribe();
        console.log('Pengguna berhasil berhenti berlangganan notifikasi');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Terjadi kesalahan saat berhenti berlangganan notifikasi:', error);
      return false;
    }
  },

  // Kirim data langganan ke server
  async sendSubscriptionToServer(subscription) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Pengguna belum login');
      }

      // Menggunakan BASE_URL dari API Dicoding yang sudah digunakan
      const response = await fetch('https://story-api.dicoding.dev/v1/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim langganan ke server');
      }

      console.log('Langganan berhasil dikirim ke server');
      return true;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim langganan ke server:', error);
      return false;
    }
  },

  // Kirim permintaan berhenti berlangganan ke server
  async sendUnsubscribeToServer(subscription) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Pengguna belum login');
      }

      // Menggunakan BASE_URL dari API Dicoding yang sudah digunakan
      const response = await fetch('https://story-api.dicoding.dev/v1/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim permintaan berhenti langganan ke server');
      }

      console.log('Permintaan berhenti langganan berhasil dikirim ke server');
      return true;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim permintaan berhenti langganan:', error);
      return false;
    }
  },

  // Kirim notifikasi uji coba
  async sendTestNotification() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification('Notifikasi Uji Coba', {
        body: 'Ini adalah notifikasi uji coba dari Story App',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          url: '/#/stories'
        }
      });

      return true;
    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim notifikasi uji coba:', error);
      return false;
    }
  },

  // Cek status langganan notifikasi push
  async getSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      return !!subscription;
    } catch (error) {
      console.error('Terjadi kesalahan saat memeriksa status langganan:', error);
      return false;
    }
  }
};
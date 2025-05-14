// services/apiService.js
import { initDB, saveStories, getStoriesFromDB } from '../db.js';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

export const ApiService = {
  // API untuk Autentikasi
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  },

  async register(email, name, password) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  },

  // API untuk Cerita dengan dukungan offline
  async getAllStories(token, useCache = true) {
    try {
      // Inisialisasi IndexedDB
      await initDB();

      const isOnline = navigator.onLine;

      if (isOnline) {
        // Jika online, ambil dari API
        const response = await fetch(`${BASE_URL}/stories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJson = await response.json();

        if (responseJson.error) {
          throw new Error(responseJson.message);
        }

        // Simpan cerita ke IndexedDB untuk penggunaan offline
        if (responseJson.listStory && responseJson.listStory.length > 0) {
          await saveStories(responseJson.listStory);
        }

        return responseJson;
      } else if (useCache) {
        // Jika offline, ambil cerita dari IndexedDB
        console.log('Offline: Mengambil cerita dari IndexedDB');
        const stories = await getStoriesFromDB();

        return {
          error: false,
          message: 'Cerita diambil dari cache (mode offline)',
          listStory: stories,
        };
      } else {
        throw new Error('Tidak ada koneksi internet');
      }
    } catch (error) {
      console.error('Kesalahan API:', error);

      if (useCache) {
        try {
          console.log('Gagal mengambil cerita: Menggunakan cache');
          const stories = await getStoriesFromDB();

          if (stories.length > 0) {
            return {
              error: false,
              message: 'Cerita diambil dari cache karena kesalahan jaringan',
              listStory: stories,
            };
          } else {
            throw new Error('Tidak ada cerita yang tersimpan di cache');
          }
        } catch (cacheError) {
          console.error('Kesalahan Cache:', cacheError);
          throw error;
        }
      } else {
        throw error;
      }
    }
  },

  async getStoryDetail(id, token) {
    try {
      const isOnline = navigator.onLine;
      
      if (isOnline) {
        const response = await fetch(`${BASE_URL}/stories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJson = await response.json();

        if (responseJson.error) {
          throw new Error(responseJson.message);
        }

        return responseJson;
      } else {
        // Jika offline, cari di IndexedDB
        const stories = await getStoriesFromDB();
        const story = stories.find(item => item.id === id);
        
        if (story) {
          return {
            error: false,
            message: 'Cerita detail diambil dari cache (mode offline)',
            story
          };
        } else {
          throw new Error('Cerita tidak ditemukan di cache');
        }
      }
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  },

  async addStory(formData, token) {
    try {
      if (!navigator.onLine) {
        throw new Error('Tidak ada koneksi internet. Cerita akan disimpan sebagai draf.');
      }

      const response = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  },

  async getStoriesWithLocation(token) {
    try {
      const isOnline = navigator.onLine;
      
      if (isOnline) {
        const response = await fetch(`${BASE_URL}/stories?location=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJson = await response.json();

        if (responseJson.error) {
          throw new Error(responseJson.message);
        }

        // Simpan data cerita dengan lokasi ke localStorage untuk penggunaan offline
        localStorage.setItem('stories-with-location', JSON.stringify(responseJson.listStory));

        return responseJson;
      } else {
        // Jika offline, coba ambil dari localStorage
        const storiesWithLocation = localStorage.getItem('stories-with-location');
        if (storiesWithLocation) {
          return {
            error: false,
            message: 'Cerita dengan lokasi diambil dari cache (mode offline)',
            listStory: JSON.parse(storiesWithLocation)
          };
        } else {
          throw new Error('Data cerita dengan lokasi tidak tersedia di cache');
        }
      }
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  },

  // Mendapatkan public key VAPID untuk notifikasi
  async getVapidPublicKey() {
    try {
      // Dalam produksi, key ini harus diambil dari server
      // Untuk keperluan submission, kita akan menggunakan key dummy
      // yang bisa diganti dengan key yang sesuai
      return 'BLo0Lq60oQELF9s3ZkW8Ev4t6ZzOtliYhKwkBCgBBGJOyhUk9Iyng79JIBbxwxwkNn9lQeHsx3Nf6yFUvCQOZYk';
      
      // Implementasi sebenarnya:
      // const response = await fetch(`${BASE_URL}/get-vapid-key`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      // const responseJson = await response.json();
      // return responseJson.publicKey;
    } catch (error) {
      console.error('Kesalahan API:', error);
      throw error;
    }
  }
};
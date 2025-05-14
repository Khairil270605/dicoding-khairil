// db.js
const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORIES_STORE = 'stories';
const DRAFTS_STORE = 'drafts';
const FAVORITES_STORE = 'favorites';

// Inisialisasi IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // Buka atau buat database
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Menangani upgrade database (saat versi berubah atau database baru dibuat)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Buat object store untuk menyimpan cerita
      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
        console.log(`Object store ${STORIES_STORE} berhasil dibuat`);
      }

      // Buat object store untuk menyimpan draf cerita
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        const draftsStore = db.createObjectStore(DRAFTS_STORE, { keyPath: 'id', autoIncrement: true });
        draftsStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log(`Object store ${DRAFTS_STORE} berhasil dibuat`);
      }

      // Buat object store untuk menyimpan cerita favorit
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
        console.log(`Object store ${FAVORITES_STORE} berhasil dibuat`);
      }
    };

    // Menangani error
    request.onerror = (event) => {
      console.error('Error saat membuka database:', event.target.error);
      reject(event.target.error);
    };

    // Menangani sukses
    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log('Database berhasil dibuka:', db);
      resolve(db);
    };
  });
};

// Simpan daftar cerita ke IndexedDB
export const saveStories = async (stories) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORIES_STORE, 'readwrite');
    const store = transaction.objectStore(STORIES_STORE);

    // Simpan setiap cerita ke object store
    for (const story of stories) {
      store.put(story);
    }

    // Tunggu transaksi selesai
    await transactionComplete(transaction);
    console.log(`${stories.length} cerita berhasil disimpan ke IndexedDB`);
    return true;
  } catch (error) {
    console.error('Gagal menyimpan cerita ke IndexedDB:', error);
    throw error;
  }
};

// Ambil semua cerita dari IndexedDB
export const getStoriesFromDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORIES_STORE, 'readonly');
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const stories = request.result;
        console.log(`${stories.length} cerita berhasil diambil dari IndexedDB`);
        resolve(stories);
      };

      request.onerror = (event) => {
        console.error('Gagal mengambil cerita dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal mengambil cerita dari IndexedDB:', error);
    throw error;
  }
};

// Ambil satu cerita berdasarkan ID dari IndexedDB
export const getStoryByIdFromDB = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORIES_STORE, 'readonly');
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const story = request.result;
        console.log('Cerita berhasil diambil dari IndexedDB:', story);
        resolve(story);
      };

      request.onerror = (event) => {
        console.error('Gagal mengambil cerita dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal mengambil cerita dari IndexedDB:', error);
    throw error;
  }
};

// Hapus cerita dari IndexedDB
export const deleteStoryFromDB = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORIES_STORE, 'readwrite');
    const store = transaction.objectStore(STORIES_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Cerita dengan ID ${id} berhasil dihapus dari IndexedDB`);
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Gagal menghapus cerita dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal menghapus cerita dari IndexedDB:', error);
    throw error;
  }
};

// Simpan draf cerita ke IndexedDB
export const saveDraft = async (draft) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);

    // Tambahkan timestamp
    const draftWithTimestamp = {
      ...draft,
      timestamp: new Date().getTime()
    };

    const request = store.add(draftWithTimestamp);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const draftId = event.target.result;
        console.log(`Draf berhasil disimpan dengan ID: ${draftId}`);
        resolve(draftId);
      };

      request.onerror = (event) => {
        console.error('Gagal menyimpan draf:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal menyimpan draf:', error);
    throw error;
  }
};

// Ambil semua draf cerita dari IndexedDB
export const getAllDrafts = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(DRAFTS_STORE, 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    const index = store.index('timestamp');
    const request = index.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const drafts = request.result;
        console.log(`${drafts.length} draf berhasil diambil dari IndexedDB`);
        resolve(drafts.reverse()); // Urutkan dari yang terbaru
      };

      request.onerror = (event) => {
        console.error('Gagal mengambil draf dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal mengambil draf dari IndexedDB:', error);
    throw error;
  }
};

// Hapus draf cerita dari IndexedDB
export const deleteDraft = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(DRAFTS_STORE, 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Draf dengan ID ${id} berhasil dihapus dari IndexedDB`);
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Gagal menghapus draf dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal menghapus draf dari IndexedDB:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan cerita ke favorit
export const addToFavorites = async (story) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);
    
    // Tambahkan timestamp favorit
    const storyWithFavTimestamp = {
      ...story,
      favoritedAt: new Date().getTime()
    };
    
    const request = store.put(storyWithFavTimestamp);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Cerita dengan ID ${story.id} berhasil ditambahkan ke favorit`);
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Gagal menambahkan cerita ke favorit:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal menambahkan cerita ke favorit:', error);
    throw error;
  }
};

// Fungsi untuk menghapus cerita dari favorit
export const removeFromFavorites = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Cerita dengan ID ${id} berhasil dihapus dari favorit`);
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Gagal menghapus cerita dari favorit:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal menghapus cerita dari favorit:', error);
    throw error;
  }
};

// Fungsi untuk mengambil semua cerita favorit
export const getAllFavorites = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const favorites = request.result;
        console.log(`${favorites.length} cerita favorit berhasil diambil dari IndexedDB`);
        // Urutkan berdasarkan waktu difavoritkan (terbaru dulu)
        resolve(favorites.sort((a, b) => b.favoritedAt - a.favoritedAt));
      };

      request.onerror = (event) => {
        console.error('Gagal mengambil cerita favorit dari IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal mengambil cerita favorit dari IndexedDB:', error);
    throw error;
  }
};

// Fungsi untuk mengecek apakah cerita ada di favorit
export const isStoryFavorited = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const isExist = !!request.result;
        resolve(isExist);
      };

      request.onerror = (event) => {
        console.error('Gagal memeriksa status favorit cerita:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Gagal memeriksa status favorit cerita:', error);
    throw error;
  }
};

// Fungsi utilitas

// Buka koneksi database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error saat membuka database:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Buat object stores jika belum ada
      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        const draftsStore = db.createObjectStore(DRAFTS_STORE, { keyPath: 'id', autoIncrement: true });
        draftsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Promise untuk menunggu transaksi selesai
const transactionComplete = (transaction) => {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
// presenter/storyListPresenter.js
import { ApiService } from '../services/apiService.js';

export function storyListPresenter(view) {
  async function getAllStories() {
    try {
      // Tampilkan loading
      view.showLoading(true);
      
      // Dapatkan token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      // Panggil API getAllStories
      const response = await ApiService.getAllStories(token);
      
      // Cek apakah ada stories
      if (response.listStory && response.listStory.length > 0) {
        // Tampilkan stories
        view.showStories(response.listStory);
      } else {
        // Tampilkan pesan jika tidak ada cerita
        view.showEmpty('Belum ada cerita. Yuk tambahkan cerita!');
      }
    } catch (error) {
      // Tampilkan pesan error
      view.showError(`Gagal memuat cerita: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      // Matikan loading state
      view.showLoading(false);
    }
  }

  // Load stories saat presenter diinisialisasi
  getAllStories();

  return {
    getAllStories
  };
}
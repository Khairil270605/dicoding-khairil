// presenter/addStoryPresenter.js
import { ApiService } from '../services/apiService.js';

export function addStoryPresenter(view) {
  async function handleAddStory(formData) {
    try {
      // Validasi input
      const description = formData.get('description');
      const photo = formData.get('photo');
      
      if (!description || !photo) {
        view.showMessage('Deskripsi dan foto harus diisi');
        return;
      }

      // Validasi file foto
      if (!photo.type.startsWith('image/')) {
        view.showMessage('File harus berupa gambar');
        return;
      }
      
      // Cek ukuran file (max 1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (photo.size > maxSize) {
        view.showMessage('Ukuran foto maksimal 1MB');
        return;
      }

      // Loading state
      view.showLoading(true);
      
      // Dapatkan token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      // Periksa apakah ada data lokasi
      const lat = formData.get('lat');
      const lon = formData.get('lon');
      
      // Log data yang akan dikirim untuk debugging
      console.log('Data yang dikirim:', {
        description: description,
        photo: photo.name,
        lat: lat || 'tidak ada',
        lon: lon || 'tidak ada'
      });
      
      // Panggil API addStory
      await ApiService.addStory(formData, token);
      
      // Tampilkan pesan sukses
      view.showMessage('Cerita berhasil ditambahkan!');
      
      // Reset form
      view.resetForm();
      
      // Redirect ke halaman stories setelah timeout singkat
      setTimeout(() => {
        window.location.hash = '#/stories';
      }, 1500);
    } catch (error) {
      // Tampilkan pesan error
      view.showMessage(`Gagal menambahkan cerita: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      // Matikan loading state
      view.showLoading(false);
    }
  }

  // Mendengarkan event submit dari view
  view.onSubmit((formData) => {
    handleAddStory(formData);
  });

  return {
    handleAddStory
  };
}
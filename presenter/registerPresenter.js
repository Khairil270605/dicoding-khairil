// presenter/registerPresenter.js
import { ApiService } from '../services/apiService.js';

export function registerPresenter(view) {
  async function handleRegister(email, name, password) {
    try {
      // Validasi input
      if (!email || !name || !password) {
        view.showMessage('Semua field harus diisi');
        return;
      }
      
      if (password.length < 8) {
        view.showMessage('Password minimal 8 karakter');
        return;
      }

      // Loading state
      view.showLoading(true);
      
      // Panggil API register
      const response = await ApiService.register(email, name, password);
      
      // Tampilkan pesan sukses
      view.showMessage('Registrasi berhasil! Silahkan login.');
      
      // Redirect ke halaman login setelah timeout singkat
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
    } catch (error) {
      // Tampilkan pesan error
      view.showMessage(`Gagal registrasi: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      // Matikan loading state
      view.showLoading(false);
    }
  }

  // Mendengarkan event submit dari view
  view.onSubmit((email, name, password) => {
    handleRegister(email, name, password);
  });

  return {
    handleRegister
  };
}
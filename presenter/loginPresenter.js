// presenter/loginPresenter.js
import { ApiService } from '../services/apiService.js';

export function loginPresenter(view) {
  async function handleLogin(email, password) {
    try {
      // Validasi input
      if (!email || !password) {
        view.showMessage('Email dan password harus diisi');
        return;
      }
      
      if (password.length < 8) {
        view.showMessage('Password minimal 8 karakter');
        return;
      }

      // Loading state
      view.showLoading(true);
      
      // Panggil API login
      const response = await ApiService.login(email, password);
      
      // Simpan token ke localStorage
      localStorage.setItem('token', response.loginResult.token);
      localStorage.setItem('userId', response.loginResult.userId);
      localStorage.setItem('name', response.loginResult.name);
      
      // Tampilkan pesan sukses
      view.showMessage('Login berhasil!');
      
      // Redirect ke halaman stories
      window.location.hash = '#/stories';
    } catch (error) {
      // Tampilkan pesan error
      view.showMessage(`Gagal login: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      // Matikan loading state
      view.showLoading(false);
    }
  }

  // Mendengarkan event submit dari view
  view.onSubmit((email, password) => {
    handleLogin(email, password);
  });

  return {
    handleLogin
  };
}
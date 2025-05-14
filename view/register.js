// views/register.js
import { registerPresenter } from '../presenter/registerPresenter.js';

export function renderRegister(container) {
  container.innerHTML = `
    <section class="register-section">
      <h2>Register</h2>
      <form id="registerForm">
        <label for="name">Nama</label>
        <input id="name" type="text" required />

        <label for="email">Email</label>
        <input id="email" type="email" required />

        <label for="password">Password</label>
        <input id="password" type="password" required minlength="8" />

        <button type="submit">Daftar</button>
      </form>
      <p id="registerMessage"></p>
      <div id="registerLoading" class="loading-spinner" style="display: none;"></div>
    </section>
  `;

  const form = document.getElementById('registerForm');
  const message = document.getElementById('registerMessage');
  const loadingIndicator = document.getElementById('registerLoading');

  // View object mengikuti pola MVP
  const view = {
    onSubmit(callback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        callback(email, name, password);
      });
    },
    showMessage(text) {
      message.textContent = text;
    },
    showLoading(isLoading) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
      form.querySelector('button').disabled = isLoading;
    }
  };

  // Inisialisasi presenter dengan view
  registerPresenter(view);
}
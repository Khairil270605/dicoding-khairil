// views/login.js
import { loginPresenter } from '../presenter/loginPresenter.js';

export function renderLogin(container) {
  container.innerHTML = `
    <section class="login-section">
      <h2>Login</h2>
      <form id="loginForm">
        <label for="email">Email</label>
        <input id="email" type="email" required />

        <label for="password">Password</label>
        <input id="password" type="password" required minlength="8" />

        <button type="submit">Login</button>
      </form>
      <p id="loginMessage"></p>
      <div id="loginLoading" class="loading-spinner" style="display: none;"></div>
    </section>
  `;

  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const loadingIndicator = document.getElementById('loginLoading');

  // View object mengikuti pola MVP
  const view = {
    onSubmit(callback) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;
        callback(email, password);
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
  loginPresenter(view);
}
import "./login-model.js";
import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this, window.AuthModel);
  }

  async render() {
    return `
      <section class="auth-container">
        <h1>Login</h1>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Login</button>
          <p style="margin-top: 16px;">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      this.presenter.login(email, password);
    });
  }

  showSuccess(message) {
    alert(message);
    window.location.hash = "#/home";
  }

  showError(message) {
    alert(`Gagal login: ${message}`);
  }
}

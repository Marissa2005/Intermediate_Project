import RegisterModel from './register-model.js';
import RegisterPresenter from './register-presenter.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Register</h1>
        <form id="register-form">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.presenter = RegisterPresenter(this, RegisterModel);
    this.presenter.init();
  }

  bindSubmit(callback) {
    document.getElementById('register-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
      };
      callback(formData);
    });
  }

  showSuccess(message) {
    alert(message);
    this.navigateToLogin();
  }

  showError(message) {
    alert(message);
  }

  navigateToLogin() {
    window.location.hash = '#/login';
  }
}

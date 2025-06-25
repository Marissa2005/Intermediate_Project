export default class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async login(email, password) {
    try {
      const result = await this.model.login(email, password);

      if (!result.error) {
        this.view.showSuccess("Login berhasil!"); // token sudah disimpan di model
      } else {
        this.view.showError(result.message);
      }
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

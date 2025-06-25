const RegisterPresenter = (view, model) => ({
  init() {
    view.bindSubmit(this.handleSubmit.bind(this));
  },

  async handleSubmit(formData) {
    try {
      await model.registerUser(formData);
      view.showSuccess('Registrasi berhasil! Silakan login.');
    } catch (error) {
      view.showError(`Gagal register: ${error.message}`);
    }
  },
});

export default RegisterPresenter;

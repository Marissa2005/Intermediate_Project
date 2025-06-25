export default class AboutPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async loadContent() {
    try {
      const content = await this.model.getContent();
      this.view.showContent(content);
    } catch {
      this.view.showError('Gagal memuat konten.');
    }
  }
}

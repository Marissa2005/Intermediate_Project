import AboutModel from "./about-model.js";
import AboutPresenter from "./about-presenter.js";

export default class AboutPage {
  constructor() {
    this.presenter = new AboutPresenter(this, AboutModel);
  }

  async render() {
  return `
    <div id="page-wrapper">
      <section class="container" id="about-section">
        <p>Loading...</p>
      </section>
    </div>
  `;
}

  async afterRender() {
    this.presenter.loadContent();
  }

  showContent({ title, description }) {
    const container = document.getElementById("about-section");
    container.innerHTML = `
      <h1>${title}</h1>
      <p>${description}</p>
    `;
  }

  showError(message) {
    const container = document.getElementById("about-section");
    container.innerHTML = `<p style="color:red">${message}</p>`;
  }
}

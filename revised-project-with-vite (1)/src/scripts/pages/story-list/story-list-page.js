export default class StoryListPage {
  constructor(containerId = '#app') {
    this.container = document.querySelector(containerId);
  }

  render(stories) {
    return `
      <section class="container" tabindex="-1">
        <h1>Daftar Cerita</h1>
        <ul>
          ${stories.map(story => `
            <li>
              <h2>${story.title}</h2>
              <p>${story.content}</p>
              <img src="${story.image}" alt="${story.title}" />
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }

  showStories(stories) {
    this.container.innerHTML = this.render(stories);
    this.afterRender();
  }

  afterRender() {
    // Tambahkan event listener jika diperlukan
  }
}

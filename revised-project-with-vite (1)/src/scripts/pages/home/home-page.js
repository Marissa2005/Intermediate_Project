import HomeModel from './home-model.js';
import HomePresenter from './home-presenter.js';
import { LikedStoryDB } from '/scripts/utils/idb.js';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <div id="welcome-message"></div>
        <h1>All Stories</h1>
        <div id="stories-list" class="stories-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = HomePresenter(this, HomeModel);
    presenter.init();
  }

  showWelcomeMessage() {
    const welcomeContainer = document.getElementById('welcome-message');
    welcomeContainer.innerHTML = `
      <div style="background: linear-gradient(135deg, #FFE8CD, #FFF2EB); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #8B4513; margin-bottom: 10px;">👋 Selamat Datang di StoriesApp!</h2>
        <p style="color: #A0522D; margin-bottom: 15px;">Bergabunglah dengan komunitas kami untuk berbagi dan menjelajahi cerita menarik</p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="#/login" style="background: #FFD6BA; color: #8B4513; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500;">Login</a>
          <a href="#/register" style="background: #FFDCDC; color: #8B4513; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 500;">Daftar</a>
        </div>
      </div>
    `;
  }

  getStoriesContainer() {
    return document.getElementById('stories-list');
  }

  showStories(stories, container, isDummyData = false) {
    container.innerHTML = stories.map((story) => {
      const truncatedDescription = this.truncateText(story.description, 150);
      const needsExpansion = story.description.length > 150;
      
      return `
        <div class="story-card" data-id="${story.id}">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
          <div class="story-info">
            <h3>${story.name}</h3>
            <div class="story-description collapsed" data-full-text="${this.escapeHtml(story.description)}">
              ${truncatedDescription}
            </div>
            ${needsExpansion ? `<button class="read-more-btn" data-story-id="${story.id}">Read more</button>` : ''}
            <div class="story-meta">
              ${!isDummyData 
                ? `<a href="#/detail/${story.id}" class="view-detail-link">View Detail</a>` 
                : `<span style="color: #999; font-size: 0.9rem;">Login untuk melihat detail</span>`
              }
              ${!isDummyData 
                ? `<button class="like-button" data-id="${story.id}" data-title="${story.name}">🤍</button>`
                : `<span style="color: #999; font-size: 1.2rem;">🤍</span>`
              }
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Only setup interactive features for real stories
    if (!isDummyData) {
      // Setup like buttons
      container.querySelectorAll('.like-button').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const storyId = btn.dataset.id;
          const storyTitle = btn.dataset.title;
          const storyImg = btn.closest('.story-card').querySelector('img')?.src;

          const isLiked = btn.classList.toggle('liked');
          btn.textContent = isLiked ? '❤️' : '🤍';

          if (isLiked) {
            await LikedStoryDB.put({
              id: storyId,
              title: storyTitle,
              photoUrl: storyImg,
            });
          } else {
            await LikedStoryDB.delete(storyId);
          }
        });
      });
    }

    // Setup read more buttons for all stories
    container.querySelectorAll('.read-more-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const storyId = btn.dataset.storyId;
        const descriptionElement = container.querySelector(`.story-card[data-id="${storyId}"] .story-description`);
        const fullText = descriptionElement.dataset.fullText;
        
        if (descriptionElement.classList.contains('collapsed')) {
          // Expand
          descriptionElement.innerHTML = fullText;
          descriptionElement.classList.remove('collapsed');
          descriptionElement.classList.add('expanded');
          btn.textContent = 'Read less';
        } else {
          // Collapse
          const truncatedText = this.truncateText(fullText, 150);
          descriptionElement.innerHTML = truncatedText;
          descriptionElement.classList.remove('expanded');
          descriptionElement.classList.add('collapsed');
          btn.textContent = 'Read more';
        }
      });
    });
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(container, message) {
    container.innerHTML = `<p>${message}</p>`;
  }
}

const LikedView = {
    render() {
        return `
      <section class="container">
        <h1>Liked Stories</h1>
        <div id="liked-stories-list" class="stories-grid"></div>
      </section>
    `;
    },

    showLikedStories(stories) {
        const container = document.getElementById('liked-stories-list');

        if (stories.length === 0) {
            container.innerHTML = '<p>Tidak ada story yang disukai.</p>';
            return;
        }

        container.innerHTML = stories.map((story) => `
      <div class="story-card" data-id="${story.id}">
        <img src="${story.photoUrl || 'https://via.placeholder.com/300'}" alt="${story.title}" class="story-image" />
        <div class="story-info">
          <h3>${story.title}</h3>
          <a href="#/detail/${story.id}" class="view-detail-link">View Detail</a>
          <button class="like-button liked" data-id="${story.id}">❤️</button>
        </div>
      </div>
    `).join('');

        container.querySelectorAll('.like-button').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const storyId = btn.dataset.id;

                // Hapus dari IndexedDB
                await import('/scripts/utils/idb.js').then(({ LikedStoryDB }) =>
                    LikedStoryDB.delete(storyId)
                );

                // Hapus elemen dari tampilan
                const storyCard = btn.closest('.story-card');
                storyCard.remove();

                // Jika sudah kosong, tampilkan pesan
                if (container.children.length === 0) {
                    container.innerHTML = '<p>Tidak ada story yang disukai.</p>';
                }
            });
        });

    },
};

export default LikedView;

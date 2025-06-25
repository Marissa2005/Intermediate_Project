const HomePresenter = (view, model) => {
  return {
    async init() {
      const container = view.getStoriesContainer();
      const token = model.getToken();
      
      // Show different content based on authentication status
      if (!token) {
        view.showWelcomeMessage();
      }

      try {
        const response = await model.getStories();
        const stories = response.listStory || [];
        view.showStories(stories, container, !token);
      } catch (error) {
        view.showError(container, 'Gagal memuat cerita. Coba lagi nanti.');
      }
    },
  };
};

export default HomePresenter;

const StoryDetailPresenter = (view, model) => ({
  async init() {
    const id = model.getStoryId();
    if (!id) {
      view.showError("ID cerita tidak ditemukan di URL.");
      return;
    }

    try {
      const token = model.getToken();  
      const story = await model.fetchStoryDetail(id, token);
      view.showStoryDetail(story);
    } catch (error) {
      view.showError(error.message);
    }
  },
});

export default StoryDetailPresenter;

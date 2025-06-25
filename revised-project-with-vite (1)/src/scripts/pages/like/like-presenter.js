const LikedPresenter = (view, model) => ({
  async init() {
    const stories = await model.getAllLikedStories();
    view.showLikedStories(stories);
  },
});

export default LikedPresenter;

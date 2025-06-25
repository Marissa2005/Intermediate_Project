export default class StoryListPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    const stories = await this.model.fetchStories();
    this.view.showStories(stories); 
  }
}

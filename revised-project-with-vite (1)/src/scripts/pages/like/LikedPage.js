import LikedModel from './like-model.js';
import LikedView from './like-view.js';
import LikedPresenter from './like-presenter.js';

export default class LikedPage {
  async render() {
    return LikedView.render();
  }

  async afterRender() {
    const presenter = LikedPresenter(LikedView, LikedModel);
    presenter.init();
  }
}

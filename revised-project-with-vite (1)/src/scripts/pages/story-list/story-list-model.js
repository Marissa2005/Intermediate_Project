import { getAllStories } from '../data/api';

export default class StoryListModel {
  async fetchStories() {
    return await getAllStories();
  }
}

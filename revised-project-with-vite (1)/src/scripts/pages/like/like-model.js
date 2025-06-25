import { LikedStoryDB } from '/scripts/utils/idb.js';

const LikedModel = {
  async getAllLikedStories() {
    try {
      const stories = await LikedStoryDB.getAll();
      return stories.sort((a, b) => new Date(b.likedAt || b.createdAt) - new Date(a.likedAt || a.createdAt));
    } catch (error) {
      console.error('Error getting liked stories:', error);
      return [];
    }
  },
  
  async getLikedStory(id) {
    try {
      return await LikedStoryDB.get(id);
    } catch (error) {
      console.error('Error getting liked story:', error);
      return null;
    }
  },
  
  async addLikedStory(story) {
    try {
      await LikedStoryDB.put(story);
      return true;
    } catch (error) {
      console.error('Error adding liked story:', error);
      return false;
    }
  },
  
  async removeLikedStory(id) {
    try {
      await LikedStoryDB.delete(id);
      return true;
    } catch (error) {
      console.error('Error removing liked story:', error);
      return false;
    }
  },
  
  async getLikedStoriesCount() {
    try {
      return await LikedStoryDB.count();
    } catch (error) {
      console.error('Error getting liked stories count:', error);
      return 0;
    }
  },
};

export default LikedModel;

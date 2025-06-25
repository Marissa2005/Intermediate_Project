import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 2;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    // Create liked_stories store
    if (!db.objectStoreNames.contains('liked_stories')) {
      const likedStore = db.createObjectStore('liked_stories', { keyPath: 'id' });
      likedStore.createIndex('createdAt', 'createdAt');
    }
    
    // Create offline_stories store for offline functionality
    if (!db.objectStoreNames.contains('offline_stories')) {
      const offlineStore = db.createObjectStore('offline_stories', { keyPath: 'id' });
      offlineStore.createIndex('createdAt', 'createdAt');
      offlineStore.createIndex('synced', 'synced');
    }
    
    // Create app_cache store for general caching
    if (!db.objectStoreNames.contains('app_cache')) {
      db.createObjectStore('app_cache', { keyPath: 'key' });
    }
  },
});

export const LikedStoryDB = {
  async getAll() {
    try {
      return (await dbPromise).getAll('liked_stories');
    } catch (error) {
      console.error('Error getting all liked stories:', error);
      return [];
    }
  },
  
  async get(id) {
    try {
      return (await dbPromise).get('liked_stories', id);
    } catch (error) {
      console.error('Error getting liked story:', error);
      return null;
    }
  },
  
  async put(story) {
    try {
      const storyWithTimestamp = {
        ...story,
        likedAt: new Date().toISOString(),
        createdAt: story.createdAt || new Date().toISOString(),
      };
      return (await dbPromise).put('liked_stories', storyWithTimestamp);
    } catch (error) {
      console.error('Error putting liked story:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      return (await dbPromise).delete('liked_stories', id);
    } catch (error) {
      console.error('Error deleting liked story:', error);
      throw error;
    }
  },
  
  async count() {
    try {
      return (await dbPromise).count('liked_stories');
    } catch (error) {
      console.error('Error counting liked stories:', error);
      return 0;
    }
  },
};

export const OfflineStoryDB = {
  async getAll() {
    try {
      return (await dbPromise).getAll('offline_stories');
    } catch (error) {
      console.error('Error getting offline stories:', error);
      return [];
    }
  },
  
  async put(story) {
    try {
      const offlineStory = {
        ...story,
        id: story.id || `offline_${Date.now()}`,
        createdAt: story.createdAt || new Date().toISOString(),
        synced: false,
      };
      return (await dbPromise).put('offline_stories', offlineStory);
    } catch (error) {
      console.error('Error storing offline story:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      return (await dbPromise).delete('offline_stories', id);
    } catch (error) {
      console.error('Error deleting offline story:', error);
      throw error;
    }
  },
  
  async getUnsyncedStories() {
    try {
      const db = await dbPromise;
      const tx = db.transaction('offline_stories', 'readonly');
      const index = tx.store.index('synced');
      return await index.getAll(false);
    } catch (error) {
      console.error('Error getting unsynced stories:', error);
      return [];
    }
  },
};

export const AppCacheDB = {
  async get(key) {
    try {
      const result = await (await dbPromise).get('app_cache', key);
      return result?.value;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  },
  
  async put(key, value) {
    try {
      return (await dbPromise).put('app_cache', {
        key,
        value,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error putting cache:', error);
      throw error;
    }
  },
  
  async delete(key) {
    try {
      return (await dbPromise).delete('app_cache', key);
    } catch (error) {
      console.error('Error deleting cache:', error);
      throw error;
    }
  },
};

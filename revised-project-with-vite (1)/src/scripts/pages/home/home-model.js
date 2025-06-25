import { getAllStories } from '/scripts/data/api.js';

const HomeModel = {
  getToken() {
    return localStorage.getItem('authToken');
  },

  getDummyStories() {
    return {
      listStory: [
        {
          id: 'dummy-1',
          name: 'Welcome to StoriesApp!',
          description: 'Selamat datang di StoriesApp! Aplikasi berbagi cerita yang memungkinkan Anda untuk membagikan momen-momen berharga dalam hidup. Daftar dan login untuk mulai berbagi cerita Anda sendiri dan melihat cerita menarik dari pengguna lain.',
          photoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
          lat: null,
          lon: null
        },
        {
          id: 'dummy-2',
          name: 'Bagikan Cerita Anda',
          description: 'Dengan StoriesApp, Anda dapat dengan mudah membagikan foto dan cerita dari berbagai tempat. Tambahkan lokasi, tulis deskripsi yang menarik, dan biarkan orang lain merasakan pengalaman Anda. Login sekarang untuk mulai berbagi!',
          photoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
          lat: null,
          lon: null
        },
        {
          id: 'dummy-3',
          name: 'Jelajahi Cerita Menarik',
          description: 'Temukan cerita-cerita menarik dari berbagai pengguna di seluruh dunia. Setiap cerita memiliki keunikan tersendiri dan dapat memberikan inspirasi untuk perjalanan Anda selanjutnya. Bergabunglah dengan komunitas kami!',
          photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
          lat: null,
          lon: null
        }
      ]
    };
  },

  async getStories() {
    const token = this.getToken();
    
    if (!token) {
      // Return dummy stories for non-authenticated users
      return this.getDummyStories();
    }
    
    try {
      return await getAllStories(token);
    } catch (error) {
      console.warn('Failed to fetch stories, showing dummy stories:', error);
      return this.getDummyStories();
    }
  },
};

export default HomeModel;

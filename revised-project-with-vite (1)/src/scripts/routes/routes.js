import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import RegisterPage from '../pages/register/register-page';
import AddNewStoryPage from '../pages/add-new-story/add-new-story';
import StoryListPage from '../pages/story-list/story-list-page';
import LoginPage from '../pages/login/login-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import LikedPage from '../pages/like/LikedPage';

const routes = {
  '/': new HomePage(), // sebelumnya HomePage
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/home': new HomePage(), // ganti /home jadi beranda setelah login
  '/about': new AboutPage(),
  '/add-new-story': new AddNewStoryPage(),
  '/list-story': new StoryListPage(),
  '/detail/:id': new StoryDetailPage(),
  '/liked': new LikedPage(),
};


export default routes;

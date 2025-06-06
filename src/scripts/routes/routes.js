import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import AddMessagePage from '../pages/add-message/add-message';

const routes = {
  '/homepage': {
    component: new HomePage(),
    authRequired: true,
    title: 'Home',
  },
  '/add-message': {
    component: new AddMessagePage(),
    authRequired: true,
    title: 'Add Message',
  },
  '/login': {
    component: new LoginPage(),
    redirectIfAuth: true,
    title: 'login',
  },
  '/register': {
    component: new RegisterPage(),
    redirectIfAuth: true,
    title: 'register',
  },
};

export default routes;

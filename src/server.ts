import CategoryController from './services/category/category.controller';
import App from './app';
import AuthenticationController from './services/authentication/auth.controller';
import Userontroller from './services/user/user.controller';

const app = new App(
  [
    new AuthenticationController(),
    new CategoryController(),
    new Userontroller()
  ],
);

app.listen();

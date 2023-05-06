import CategoryController from './services/category/category.controller';
import App from './app';
import AuthenticationController from './services/authentication/auth.controller';


const app = new App(
  [
    new AuthenticationController(),
    new CategoryController()
  ],
);

app.listen();

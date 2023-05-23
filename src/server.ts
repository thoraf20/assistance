import CategoryController from './services/category/category.controller';
import App from './app';
import AuthenticationController from './services/authentication/auth.controller';
import Userontroller from './services/user/user.controller';
import AssistanceController from './services/assistance/assistance.controller';
import DonorController from './services/donation/donation.controller';

const app = new App(
  [
    new AuthenticationController(),
    new CategoryController(),
    new Userontroller(),
    new AssistanceController(),
    new DonorController()
  ],
);

app.listen();

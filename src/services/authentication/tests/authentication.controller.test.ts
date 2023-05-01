import * as typeorm from 'typeorm';
import * as request from 'supertest';
import App from '../../../app';
import { CreateUserDto } from '../../user/user.dto';
import AuthenticationController from '../../authentication/auth.controller';

describe('The AuthenticationController', () => {
  describe('POST /auth/register', () => {
    describe('if the email is not taken', () => {
      it('should create user and return the user data', () => {
        const userData: CreateUserDto = {
          full_name: 'John',
          email: 'john@smith.com',
          password: 'strongPassword123',
        };
        process.env.JWT_SECRET = 'jwt_secret';
        const authenticationController = new AuthenticationController();
        authenticationController.authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
        authenticationController.authenticationService.user.save = jest.fn().mockReturnValue({
          ...userData,
          id: 0,
        });
        (typeorm as any).connect = jest.fn();
        const app = new App([
          authenticationController,
        ]);
        return request(app.getServer())
          .post(`${authenticationController.path}/register`)
          .send(userData)
      });
    });
  });
});

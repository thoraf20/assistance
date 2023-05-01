import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import { CreateUserDto, ResetPasswordDto } from '../user/user.dto';
import { User } from './../user/user.model';
import AuthenticationService from './auth.service';
import { EmailVerificationDto, LogInDto } from './auth.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = User;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.userRegistration);
    this.router.post(`${this.path}/email/verify`, validationMiddleware(EmailVerificationDto), this.emailverification);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    // this.router.post(`${this.path}/forgot_password`, validationMiddleware(ForgotPasswordDto), this.forgotPassword);
    // this.router.post(`${this.path}/reset_password`, validationMiddleware(ResetPasswordDto), this.resetPassword);
    // this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private userRegistration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const user = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private emailverification = async (request: Request, response: Response, next: NextFunction) => {
    const verificationData : EmailVerificationDto = request.body
    console.log(verificationData)

    try {
      const verificationResponse = await this.authenticationService.verifyEmail(verificationData.email, verificationData.code);
      response.send(verificationResponse)
    } catch (error) {
      next(error)
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    try {
      const loginResponse = await this.authenticationService.login(logInData);
      response.send(loginResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationController;
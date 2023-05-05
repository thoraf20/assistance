import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import { CreateUserDto } from '../user/user.dto';
import { User } from './../user/user.model';
import AuthenticationService from './auth.service';
import { EmailVerificationDto, ForgotPasswordDto, LogInDto, ResetPasswordDto, TwoFADto } from './auth.dto';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import authMiddleware from '../../middleware/auth.middleware';
import WrongAuthenticationTokenException from '../../exceptions/WrongAuthenticationTokenException';

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
    this.router.post(`${this.path}/2fa/generate`, authMiddleware(), this.generate2FACode);
    this.router.post(`${this.path}/2fa/turn-on`,
    validationMiddleware(TwoFADto),
     authMiddleware(), 
     this.turnOnTwofactorAuthenticationCode
     );
     this.router.post(`${this.path}/2fa/authenticate`,
    validationMiddleware(TwoFADto),
     authMiddleware(true), 
     this.secondFactorAuthentication
     );
    this.router.post(`${this.path}/forgot_password`, validationMiddleware(ForgotPasswordDto), this.forgotPassword);
    this.router.post(`${this.path}/reset_password`, validationMiddleware(ResetPasswordDto), this.resetPassword);
    this.router.post(`${this.path}/logout`, this.loggingOut);
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
  private forgotPassword = async (request: Request, response: Response, next: NextFunction) => {
    const forgossPasswordData : ForgotPasswordDto = request.body

    try {
      const forgotPasswordResponse = await this.authenticationService.forgotPassword(forgossPasswordData.email);
      response.send(forgotPasswordResponse)
    } catch (error) {
      next(error)
    }
  }
  private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
    const resetPasswordData : ResetPasswordDto = request.body

    try {
      const resetPasswordResponse = await this.authenticationService.resetPassword(
        resetPasswordData.email, 
        resetPasswordData.code, 
        resetPasswordData.password
      );
      response.send(resetPasswordResponse)
    } catch (error) {
      next(error)
    }
  }

  private loggingOut = (request: Request, response: Response) => {
    response.send(200);
  }

  private generate2FACode = async (request: RequestWithUser, response: Response) => {
    const user = request.user;
    const { otpauthUrl, base32 } = await this.authenticationService.getTwofactorAuthenticationCode();

    await this.user.update(
      { id: user.id },
      { twoFACode: base32 }
    )
    await this.authenticationService.respondWithQRCode(otpauthUrl, response)
  }

  private turnOnTwofactorAuthenticationCode = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const user = request.user;
    const { twoFACode } = request.body;

    const isCodeValid = await this.authenticationService.verifyTwofactorAuthenticationCode(twoFACode, user)
    if (isCodeValid) {
      await this.user.update(
        { id: user.id},
        { is2FAEnable: true }
      )

      response.send(200)
    } else {
      next(new WrongAuthenticationTokenException());
    }
  }

  private secondFactorAuthentication = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const { twoFACode } = request.body
    const user = request.user
    const isCodeValid = await this.authenticationService.verifyTwofactorAuthenticationCode(twoFACode, user);

    if (isCodeValid) {
      const tokenData = this.authenticationService.createToken(user, true)
      response.send({
        ...user,
        password: undefined,
        twoFACode: undefined
      })
    } else {
      next(new WrongAuthenticationTokenException())
    }
  }
}

export default AuthenticationController;
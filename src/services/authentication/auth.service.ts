import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import { User, UserStatus } from "../../services/user/user.model";
import { CreateUserDto } from '../../services/user/user.dto';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import { OTP } from '../../services/otp/otp.model';
import { EmailService } from '../../services/messaging/email.service';
import { EmailSubject } from '../../utils/type';
import { myDataSource } from '../../config/db.config';
import InvalidOTPException from '../../exceptions/InvalidOTPException';
import OTPExpiredException from '../../exceptions/OtpExpiredException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import { LogInDto } from './auth.dto';
import DataStoredInToken from 'interfaces/dataStoredInToken';
import TokenData from '../../interfaces/tokenData.interface';

class AuthenticationService {
  public user = User;
  public otp = OTP;

  public async register(userData: CreateUserDto) {
    const queryRunner = myDataSource.createQueryRunner()
    await queryRunner.connect(); 
    await queryRunner.startTransaction();

    try {

    if (
      await this.user.findOne({ 
        where : { email: userData.email.toLowerCase() } 
      })
    ) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User();
    newUser.email = userData.email.toLowerCase()
    newUser.password = hashedPassword
    newUser.full_name = userData.full_name

    await newUser.save()

    const code = Math.floor(Math.random() * 9000 + 1000);

    const newOTP = new OTP();
    newOTP.user_id = newUser.id
    newOTP.code = `${code}`
   
    await newOTP.save()

    await EmailService(
      userData.email, 
      EmailSubject.ACCOUNT_VERIFICATION, 
      `Here is your verification code ${code}`
    )

    await queryRunner.commitTransaction(); 

    return {
      success: true,
      message: `verification code has been sent to your email(${userData.email}) address`,
    };
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    }
  }

  public async verifyEmail(email: string, code: string) {
    const queryRunner = myDataSource.createQueryRunner()
    await queryRunner.connect(); 
    await queryRunner.startTransaction();
    try {
      const userData = await this.user.findOne({
        where: { email: email.toLowerCase() }
      })
  
      if (userData) {
        if (userData.isEmailVerified === true) {
          return {
            success: true,
            message: 'Email address already verified'
          }
        }
  
        const otp = await this.otp.findOne({
          where: { user_id: userData.id, code },
        })
  
        if (!otp) {
          throw new InvalidOTPException()
        }
  
        if (moment(otp.created_at) > moment().add(5, 'minutes')) {
          throw new OTPExpiredException()
        }
  
        await queryRunner.startTransaction();
  
        await this.user.update(
          { id: userData.id },
          { isEmailVerified: true, status: UserStatus.ACTIVE }
        )
  
        await this.otp.delete(
          { id: otp.id }
        )
        
        await queryRunner.commitTransaction(); 
  
        return {
          success: true,
          message: 'Email successfully verified'
        }
      } else {
        throw new WrongCredentialsException()
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    }
  }
  public async login(logInData: LogInDto) {
    const user = await myDataSource.getRepository(User).createQueryBuilder('user')
    .where("user.email = :email", { email: logInData.email.toLowerCase() })
    .addSelect("user.password")
    .getOne()

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password, user.password
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        return {
          success: true,
          token: tokenData.token
        };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  }
  public async forgotPassword(email: string) {
    const user = await this.user.findOne({
      where: { email: email.toLowerCase() }
    })

    if (user) {
      const code = Math.floor(Math.random() * 9000 + 1000);

      const newOtp = new OTP()
      newOtp.user_id = user.id
      newOtp.code = `${code}`

      await newOtp.save()

      await EmailService(
        user.email, 
        EmailSubject.FORGOT_PASSWORD, 
        `It seems you forgot your password. Here is your verification code: ${code} to reset your password`
      )

      return {
        success: true,
        message: `Verification code hass been sent to your registered email(${user.email}) address`
      }
    } else {
      throw new WrongCredentialsException()
    }
  }
  public async resetPassword(email: string, code: string, password: string) {
    const queryRunner = myDataSource.createQueryRunner()
    await queryRunner.connect(); 

    const user = await this.user.findOne({
      where: { email: email.toLowerCase() }
    })

    if (user) {
      const otp = await this.otp.findOne({
        where: { user_id: user.id, code }
      })

      if (!otp) {
        throw new InvalidOTPException()
      }

      if (moment(otp.created_at) > moment().add(5, 'minutes')) {
        throw new OTPExpiredException()
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await queryRunner.startTransaction();

      await this.user.update(
        { id: user.id },
        { password: hashedPassword }
      )

      await this.otp.delete(
        { id: user.id, code }
      )

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'password successfully updated'
      }
    } else {
      await queryRunner.rollbackTransaction()
      throw new WrongCredentialsException()
    }
  }

  public createToken(user: User): TokenData {
    const expiresIn = `${process.env.JWT_EXPIRESIN}`;
    const secret = `${process.env.JWT_SECRET}`;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      email: user.email,
    };
    return {
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;
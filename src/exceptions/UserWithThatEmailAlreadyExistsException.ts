import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(httpStatus.CONFLICT, `User with email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;

import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class WrongCredentialsException extends HttpException {
  constructor() {
    super(httpStatus.BAD_REQUEST, 'Wrong credentials provided');
  }
}

export default WrongCredentialsException;

import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(httpStatus.UNAUTHORIZED, 'Wrong authentication token');
  }
}

export default WrongAuthenticationTokenException;

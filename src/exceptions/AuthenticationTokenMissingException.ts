import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(httpStatus.UNAUTHORIZED, 'Authentication token missing');
  }
}

export default AuthenticationTokenMissingException;

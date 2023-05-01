import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class NotAuthorizedException extends HttpException {
  constructor() {
    super(httpStatus.UNAUTHORIZED, "You're not authorized");
  }
}

export default NotAuthorizedException;

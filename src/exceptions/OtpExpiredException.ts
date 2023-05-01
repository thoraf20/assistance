import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class OTPExpiredException extends HttpException {
  constructor() {
    super(httpStatus.BAD_REQUEST, `code expired`);
  }
}

export default OTPExpiredException;

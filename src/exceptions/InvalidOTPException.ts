import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class InvalidOTPException extends HttpException {
  constructor() {
    super(httpStatus.BAD_REQUEST, `invalid code`);
  }
}

export default InvalidOTPException;

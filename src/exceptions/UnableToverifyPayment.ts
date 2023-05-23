import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class UnprocessableEntityException extends HttpException {
  constructor(messge: string) {
    super(httpStatus.UNPROCESSABLE_ENTITY, messge);
  }
}

export default UnprocessableEntityException;
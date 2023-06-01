import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class AssistanceAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(httpStatus.CONFLICT, `Assistance with name ${name} already exists`);
  }
}

export default AssistanceAlreadyExistsException;

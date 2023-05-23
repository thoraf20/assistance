import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class AssistanceNotFoundException extends HttpException {
  constructor() {
    super(httpStatus.NOT_FOUND, `assistance not found`);
  }
}

export default AssistanceNotFoundException;
import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(httpStatus.NOT_FOUND, `User with id ${id} not found`);
  }
}

export default UserNotFoundException;

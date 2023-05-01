import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(httpStatus.NOT_FOUND, `Post with id ${id} not found`);
  }
}

export default PostNotFoundException;

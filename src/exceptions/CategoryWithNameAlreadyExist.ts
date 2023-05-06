import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class CategoryWithNameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(httpStatus.CONFLICT, `Category with name ${name} already exists`);
  }
}

export default CategoryWithNameAlreadyExistsException;

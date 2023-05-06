import HttpException from './HttpException';
import httpStatus from 'http-status-codes'

class CategoryNotFoundException extends HttpException {
  constructor() {
    super(httpStatus.NOT_FOUND, `category not found`);
  }
}

export default CategoryNotFoundException;

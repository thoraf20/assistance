import { Request, Response, NextFunction, Router } from 'express';
import httpStatus from 'http-status-codes';
import Controller from '../../interfaces/controller.interface';
import UserService from './user.service';

class Userontroller implements Controller {
  public path = '/user';
  public router = Router();
  public userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.fetchAllUser);
    this.router.get(`${this.path}/:id`, this.fetchOneUser);
  }

  private fetchAllUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await this.userService.fetchAll();
      response.status(httpStatus.OK).send(users);
    } catch (error) {
      next(error);
    }
  }

  private fetchOneUser = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id
    try {
      const user = await this.userService.fetchOne(id);
      response.status(httpStatus.OK).send(user);
    } catch (error) {
      next(error);
    }
  }
}

export default Userontroller;
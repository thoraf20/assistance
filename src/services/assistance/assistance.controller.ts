import { Request, Response, NextFunction, Router } from 'express';
import httpStatus from 'http-status-codes';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import AssistanceService from './assistance.service';
import { CreateAssistanceDto } from './assistance.dto';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/requestWithUser.interface';

class AssistanceController implements Controller {
  public path = '/assistance';
  public router = Router();
  public assistanceService = new AssistanceService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(), validationMiddleware(CreateAssistanceDto), this.createAssistance);
    this.router.get(`${this.path}`, this.fetctAllAssistances);
    this.router.get(`${this.path}/user`, authMiddleware(), this.fetchUserAssistance);
    this.router.get(`${this.path}/cat`, this.fetchAllBycategory);
    this.router.get(`${this.path}/:id`, this.fetchOneAssistance);
  }

  private createAssistance = async (request: Request, response: Response, next: NextFunction) => {
    const assistanceData: CreateAssistanceDto = request.body;
    try {
      const assistance = await this.assistanceService.create(assistanceData);
      response.status(httpStatus.CREATED).send(assistance);
    } catch (error) {
      next(error);
    }
  }
  private fetctAllAssistances = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const assisatnces = await this.assistanceService.getAll();
      response.status(httpStatus.OK).send(assisatnces);
    } catch (error) {
      next(error);
    }
  }
  private fetchUserAssistance = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const userId = request.user.id
    try {
      const assistance = await this.assistanceService.getAllUserAssistance(userId);
      response.status(httpStatus.OK).send(assistance);
    } catch (error) {
      next(error);
    }
  }
  private fetchOneAssistance = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id as string
    try {
      const assistance = await this.assistanceService.getOneById(id);
      response.status(httpStatus.OK).send(assistance);
    } catch (error) {
      next(error);
    }
  }
  private fetchAllBycategory = async (request: Request, response: Response, next: NextFunction) => {
    const categoryId = request.query.category as any
    try {
      const assistance = await this.assistanceService.getAllByCategory(categoryId);
      response.status(httpStatus.OK).send(assistance);
    } catch (error) {
      next(error);
    }
  }
}

export default AssistanceController
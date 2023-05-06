import { Request, Response, NextFunction, Router } from 'express';
import httpStatus from 'http-status-codes';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import CategoryService from './category.service';
import { Category } from './category.model';
import { CreateCategoryDto } from './category.dto';


class CategoryController implements Controller {
  public path = '/category';
  public router = Router();
  public categoryService = new CategoryService();
  private category = Category;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(CreateCategoryDto), this.createCategory);
    this.router.get(`${this.path}`, this.fetctAllCategories);
    this.router.get(`${this.path}/:id`, this.fetctOneCategory);
  }

  private createCategory = async (request: Request, response: Response, next: NextFunction) => {
    const categoryData: CreateCategoryDto = request.body;
    try {
      const category = await this.categoryService.create(categoryData);
      response.status(httpStatus.CREATED).send(category);
    } catch (error) {
      next(error);
    }
  }
  private fetctAllCategories = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.fetchAll();
      response.status(httpStatus.OK).send(categories);
    } catch (error) {
      next(error);
    }
  }
  private fetctOneCategory = async (request: Request, response: Response, next: NextFunction) => {
    const catId = request.params.id
    try {
      const category = await this.categoryService.fetchOne(catId);
      response.status(httpStatus.OK).send(category);
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
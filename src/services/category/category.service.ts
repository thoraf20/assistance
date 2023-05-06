import { Response, response } from 'express';
import { Category } from "./category.model";
import { CreateCategoryDto } from './category.dto';
import CategoryWithNameAlreadyExistsException from '../../exceptions/CategoryWithNameAlreadyExist';
import { cloudinary } from '../../config/cloudinary.config';
import CategoryNotFoundException from '../../exceptions/CategoryNotFoundException';

class CategoryService {
  public category = Category;

  public async create(categoryData: CreateCategoryDto) {
    const categoryExist = await this.category.findOne({
      where: { name: categoryData.name.toLowerCase() }
    })
    if (!categoryExist) {
      const response = await cloudinary.v2.uploader.upload(categoryData.imgUrl, { public_id: categoryData.name, resource_type: 'raw' })
      await this.category.save({
        ...categoryData,
        imgUrl: response.secure_url
      })
      return {
        success: true,
        message: 'category created successfully'
      }
    } else {
      throw new CategoryWithNameAlreadyExistsException(categoryData.name);
    }
  }
  public async fetchAll() {
    const allCategories = await this.category.find()

    if (allCategories.length) {
      return {
        success: true,
        message: 'categories fetched successfully',
        data: allCategories
      }
    } else {
      throw new CategoryNotFoundException();
    }
  }
  public async fetchOne(id: string) {
    const category = await this.category.findOne({
      where: { id }
    })

    if (category) {
      return {
        success: true,
        message: 'category fetched successfully',
        data: category
      }
    } else {
      throw new CategoryNotFoundException();
    }
  }
}

export default CategoryService;
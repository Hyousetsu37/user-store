import { categoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

interface Categories {
  id: string;
  name: string;
  isAvailable: boolean;
}

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExist = await categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExist) throw CustomError.badRequest("Category already exist");

    try {
      const category = new categoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        isAvailable: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        categoryModel.countDocuments(),
        categoryModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      const hasNext = total / limit > page ? true : false;

      return {
        page: page,
        limit: limit,
        total: total,
        prev:
          page === 1 ? null : `/api/categories?page=${page - 1}&limit=${limit}`,
        next: hasNext
          ? `/api/categories?page=${page + 1}&limit=${limit}`
          : null,
        categories: categories.map((category) => {
          return {
            id: category.id,
            name: category.name,
            isAvailable: category.available,
          };
        }),
      };
    } catch (error) {
      throw CustomError.internalServer("Internal server Error");
    }
  }
}

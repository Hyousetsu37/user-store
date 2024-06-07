import { productModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
  constructor() {}
  async createProduct(createProductDto: CreateProductDto) {
    const productExist = await productModel.findOne({
      name: createProductDto.name,
    });
    if (productExist) throw CustomError.badRequest("Product already exists");

    try {
      const product = new productModel(createProductDto);
      await product.save();
      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, products] = await Promise.all([
        productModel.countDocuments(),
        productModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("user")
          .populate("category"),
      ]);
      const hasNext = total / limit > page ? true : false;

      return {
        page,
        limit,
        total,
        prev:
          page === 1 ? null : `/api/products?page=${page - 1}&limit=${limit}`,
        next: hasNext ? `/api/products?page=${page + 1}&limit=${limit}` : null,
        products,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}

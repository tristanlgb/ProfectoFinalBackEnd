// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    this.validateObjectId(id);

    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} does not exist`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    this.validateObjectId(id);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} does not exist`);
    }

    return updatedProduct;
  }

  async delete(id: string): Promise<ProductDocument> {
    this.validateObjectId(id);

    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${id} does not exist`);
    }

    return deletedProduct;
  }

  async getProductById(id: string): Promise<ProductDocument> {
    return this.findOne(id);
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid product id: ${id}`);
    }
  }
}

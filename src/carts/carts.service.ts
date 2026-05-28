// src/carts/carts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';

type PurchaseResult = {
  status: 'success';
  totalAmount: number;
  unavailableProducts: Types.ObjectId[];
};

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async createCart(): Promise<CartDocument> {
    this.logger.log('Creating a new cart...');

    const newCart = new this.cartModel({
      items: [],
    });

    return newCart.save();
  }

  async getCartById(cartId: string): Promise<CartDocument> {
    this.validateObjectId(cartId, 'cart');

    const cart = await this.cartModel
      .findById(cartId)
      .populate('items.product')
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    return cart;
  }

  async addProduct(
    cartId: string,
    productId: string,
    quantity = 1,
    user: any,
  ): Promise<CartDocument> {
    this.validateObjectId(cartId, 'cart');
    this.validateObjectId(productId, 'product');
    this.validateQuantity(quantity);

    const cart = await this.cartModel.findById(cartId).exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    const product = await this.productsService.getProductById(productId);

    if (product.stock <= 0) {
      throw new BadRequestException(
        `Product with ID ${productId} is out of stock`,
      );
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Not enough stock. Available stock: ${product.stock}`,
      );
    }

    if (user?.role === 'premium' && user?.email === product.owner) {
      throw new ForbiddenException('You cannot add your own product');
    }

    const itemIndex = cart.items.findIndex(
      (item) => this.getItemProductId(item.product) === productId,
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Not enough stock. Available stock: ${product.stock}`,
        );
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();

    this.logger.log(`Product ${productId} added to cart ${cartId}`);
    return this.getCartById(cartId);
  }

  async updateCart(
    cartId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDocument> {
    this.validateObjectId(cartId, 'cart');

    const cart = await this.cartModel.findById(cartId).exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    if (!updateCartDto.items || !Array.isArray(updateCartDto.items)) {
      throw new BadRequestException('Items must be an array');
    }

    for (const item of updateCartDto.items) {
      this.validateObjectId(item.product, 'product');
      this.validateQuantity(item.quantity);

      const product = await this.productsService.getProductById(item.product);

      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Not enough stock for product ${item.product}. Available stock: ${product.stock}`,
        );
      }
    }

    cart.items = updateCartDto.items.map((item) => ({
      product: new Types.ObjectId(item.product),
      quantity: item.quantity,
    }));

    await cart.save();

    this.logger.log(`Cart ${cartId} updated successfully`);
    return this.getCartById(cartId);
  }

  async removeProduct(cartId: string, productId: string): Promise<CartDocument> {
    this.validateObjectId(cartId, 'cart');
    this.validateObjectId(productId, 'product');

    const cart = await this.cartModel.findById(cartId).exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    const itemIndex = cart.items.findIndex(
      (item) => this.getItemProductId(item.product) === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(`Product not found in cart`);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    this.logger.log(
      `Product ${productId} removed from cart ${cartId} successfully`,
    );

    return this.getCartById(cartId);
  }

  async clearCart(cartId: string): Promise<CartDocument> {
    this.validateObjectId(cartId, 'cart');

    const cart = await this.cartModel.findById(cartId).exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    cart.items = [];
    await cart.save();

    this.logger.log(`Cart ${cartId} cleared successfully`);
    return this.getCartById(cartId);
  }

  async purchaseCart(cartId: string, user: any): Promise<PurchaseResult> {
    this.validateObjectId(cartId, 'cart');

    const cart = await this.cartModel
      .findById(cartId)
      .populate('items.product')
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
    }

    let totalAmount = 0;
    const unavailableProducts: Types.ObjectId[] = [];

    for (const item of cart.items) {
      const product =
        item.product instanceof Types.ObjectId
          ? await this.productsService.getProductById(item.product.toHexString())
          : (item.product as ProductDocument);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;
      } else {
        unavailableProducts.push(product._id as Types.ObjectId);
      }
    }

    cart.items = [];
    await cart.save();

    this.logger.log(`Cart ${cartId} purchased successfully`);

    return {
      status: 'success',
      totalAmount,
      unavailableProducts,
    };
  }

  private validateObjectId(id: string, resourceName: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${resourceName} ID format`);
    }
  }

  private validateQuantity(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a number greater than 0');
    }
  }

  private getItemProductId(product: Types.ObjectId | ProductDocument): string {
    if (product instanceof Types.ObjectId) {
      return product.toHexString();
    }

    return (product._id as Types.ObjectId).toHexString();
  }
}

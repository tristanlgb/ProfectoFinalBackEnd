// cart.controller.ts
import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
  } from '@nestjs/common';
  import { CartsService } from './carts.service';
  import { ProductsService } from '../products/products.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';


  
  @Controller('carts')
  @UseGuards(JwtAuthGuard)
  export class CartController {
    private readonly logger = new Logger(CartController.name);
  
    constructor(
      private readonly cartService: CartsService,
      private readonly productService: ProductsService,
    ) {}
  
    @Post()
    async createCart(@Request() req) {
      this.logger.log('Creating a new cart...');
      try {
        const result = await this.cartService.createCart();
        this.logger.log('Cart created successfully');
        return { status: 'success', payload: result };
      } catch (error) {
        this.logger.error('Error occurred in createCart', error.stack);
        throw new BadRequestException('An error occurred while creating the cart');
      }
    }
  
    @Post(':cid/products/:pid')
    async addProduct(
      @Param('cid') cid: string,
      @Param('pid') pid: string,
      @Body('quantity') quantity: number,
      @Request() req,
    ) {
      this.logger.log('Adding a product to the cart...');
      const user = req.user;
  
      // Verify cart ID
      const cart = await this.cartService.getCartById(cid);
      if (!cart) {
        this.logger.warn(`Cart with id ${cid} does not exist`);
        throw new NotFoundException(`Cart with id ${cid} does not exist`);
      }
  
      // Verify product ID
      const product = await this.productService.getProductById(pid);
      if (!product) {
        this.logger.warn(`Product with id ${pid} does not exist`);
        throw new NotFoundException(`Product with id ${pid} does not exist`);
      }
  
      // Check product stock
      if (product.stock <= 0) {
        this.logger.warn(`Product with id ${pid} is out of stock`);
        throw new BadRequestException(`Product with id ${pid} is out of stock`);
      }
  
      // Check if user is trying to add their own product
      if (user.role === 'premium' && user.email === product.owner) {
        this.logger.warn(`User cannot add their own product with id ${pid}`);
        throw new ForbiddenException(`You cannot add your own product`);
      }
  
      // Add product to cart
      try {
       const result = await this.cartService.addProduct(cid, pid, quantity, user);
        this.logger.log('Product added to cart successfully');
        return { status: 'success', payload: result };
      } catch (error) {
        this.logger.error('Error occurred in addProduct', error.stack);
        throw new BadRequestException('An error occurred while adding the product');
      }
    }
  
    @Get(':cid')
    async getCart(@Param('cid') cid: string) {
      this.logger.log(`Fetching cart with id ${cid}...`);
      const cart = await this.cartService.getCartById(cid);
      if (!cart) {
        this.logger.warn(`Cart with id ${cid} does not exist`);
        throw new NotFoundException(`Cart with id ${cid} does not exist`);
      }
      this.logger.log('Cart fetched successfully');
      return { status: 'success', payload: cart };
    }
  
    // Other methods...
  }
  


  // 
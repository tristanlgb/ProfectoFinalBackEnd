// src/carts/carts.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { Model, Types } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartsService {
    private readonly logger = new Logger(CartsService.name);

    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        private readonly productsService: ProductsService,
    ) {}

    // Create a new cart
    async createCart(): Promise<Cart> {
        this.logger.log('Creating a new cart...');
        const newCart = new this.cartModel({ items: [] });
        return newCart.save();
    }

    // Get a cart by ID
    async getCartById(cartId: string): Promise<Cart> {
        this.logger.log(`Fetching cart with ID: ${cartId}`);
        if (!Types.ObjectId.isValid(cartId)) {
            throw new BadRequestException('Invalid cart ID format');
        }

        const cart = await this.cartModel
            .findById(cartId)
            .populate('items.product')
            .exec();

        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        return cart;
    }

    // Add a product to the cart
    async addProduct(
        cartId: string,
        productId: string,
        quantity: number,
        user: any,
    ): Promise<Cart> {
        this.logger.log(
            `Adding product ${productId} to cart ${cartId} with quantity ${quantity}`,
        );

        if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid cart ID or product ID format');
        }

        const cart = await this.cartModel.findById(cartId).exec();
        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        const product = await this.productsService.getProductById(productId);
        if (!product) {
            this.logger.warn(`Product with ID ${productId} not found`);
            throw new NotFoundException(`Product with ID ${productId} does not exist`);
        }

        if (product.stock <= 0) {
            this.logger.warn(`Product with ID ${productId} is out of stock`);
            throw new BadRequestException(
                `Product with ID ${productId} is out of stock`,
            );
        }

        if (user.role === 'premium' && user.email === product.owner) {
            this.logger.warn(`User cannot add their own product`);
            throw new ForbiddenException(`You cannot add your own product`);
        }

        // Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex((item) => {
            let itemProductId: string;

            if (item.product instanceof Types.ObjectId) {
                itemProductId = item.product.toHexString();
            } else {
                const productDoc = item.product as ProductDocument;
                itemProductId = (productDoc._id as Types.ObjectId).toHexString();
            }

            return itemProductId === productId;
        });

        if (itemIndex > -1) {
            // Update the quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.items.push({
                product: new Types.ObjectId(productId),
                quantity: quantity,
            });
        }

        // Save the updated cart
        await cart.save();

        // Optionally, reduce the stock of the product
        // await this.productsService.decreaseStock(productId, quantity);

        this.logger.log(`Product ${productId} added to cart ${cartId}`);
        return this.getCartById(cartId);
    }

    // Update cart items
    async updateCart(
        cartId: string,
        updateCartDto: UpdateCartDto,
    ): Promise<Cart> {
        this.logger.log(`Updating cart with ID: ${cartId}`);
        if (!Types.ObjectId.isValid(cartId)) {
            throw new BadRequestException('Invalid cart ID format');
        }

        const cart = await this.cartModel.findById(cartId).exec();
        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        cart.items = updateCartDto.items.map((item) => ({
            product: new Types.ObjectId(item.product),
            quantity: item.quantity,
        }));

        await cart.save();

        this.logger.log(`Cart ${cartId} updated successfully`);
        return this.getCartById(cartId);
    }

    // Remove a product from the cart
    async removeProduct(cartId: string, productId: string): Promise<Cart> {
        this.logger.log(
            `Removing product ${productId} from cart ${cartId}`,
        );

        if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid cart ID or product ID format');
        }

        const cart = await this.cartModel.findById(cartId).exec();
        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        const itemIndex = cart.items.findIndex((item) => {
            let itemProductId: string;

            if (item.product instanceof Types.ObjectId) {
                itemProductId = item.product.toHexString();
            } else {
                const productDoc = item.product as ProductDocument;
                itemProductId = (productDoc._id as Types.ObjectId).toHexString();
            }

            return itemProductId === productId;
        });

        if (itemIndex === -1) {
            this.logger.warn(`Product ${productId} not found in cart ${cartId}`);
            throw new NotFoundException(`Product not found in cart`);
        }

        // Remove the product from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        this.logger.log(
            `Product ${productId} removed from cart ${cartId} successfully`,
        );
        return this.getCartById(cartId);
    }

    // Clear all products from the cart
    async clearCart(cartId: string): Promise<Cart> {
        this.logger.log(`Clearing cart with ID: ${cartId}`);
        if (!Types.ObjectId.isValid(cartId)) {
            throw new BadRequestException('Invalid cart ID format');
        }

        const cart = await this.cartModel.findById(cartId).exec();
        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        cart.items = [];
        await cart.save();

        this.logger.log(`Cart ${cartId} cleared successfully`);
        return this.getCartById(cartId);
    }

    // Purchase the cart (simplified example)
    async purchaseCart(cartId: string, user: any): Promise<any> {
        this.logger.log(`Purchasing cart with ID: ${cartId}`);
        if (!Types.ObjectId.isValid(cartId)) {
            throw new BadRequestException('Invalid cart ID format');
        }

        const cart = await this.cartModel.findById(cartId).populate('items.product').exec();
        if (!cart) {
            this.logger.warn(`Cart with ID ${cartId} not found`);
            throw new NotFoundException(`Cart with ID ${cartId} does not exist`);
        }

        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.items) {
            let product: ProductDocument;

            if (item.product instanceof Types.ObjectId) {
                // If item.product is still an ObjectId, fetch the product
                product = await this.productsService.getProductById(item.product.toHexString());
            } else {
                product = item.product as ProductDocument;
            }

            if (product.stock >= item.quantity) {
                // Deduct the stock
                product.stock -= item.quantity;
                await product.save();

                // Calculate total amount
                totalAmount += product.price * item.quantity;
            } else {
                // Add to unavailable products
                unavailableProducts.push(product._id);
            }
        }

        // Clear the cart
        cart.items = [];
        await cart.save();

        // Generate a purchase record (e.g., an order) if needed
        // ...

        this.logger.log(`Cart ${cartId} purchased successfully`);

        return {
            status: 'success',
            totalAmount,
            unavailableProducts,
        };
    }
}

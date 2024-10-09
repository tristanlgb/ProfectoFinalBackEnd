// src/carts/carts.module.ts
import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // Import ProductsModule if you need ProductsService
  ],
  controllers: [CartController],
  providers: [CartsService],
})
export class CartsModule {}

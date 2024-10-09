// src/carts/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: Product.name },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  })
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

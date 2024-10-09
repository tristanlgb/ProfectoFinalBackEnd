// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  stock: number;

  @Prop()
  code: string;

  @Prop()
  thumbnail: string;

  // Add this field
  @Prop({ type: String, required: true })
  owner: string; // Or use 'Types.ObjectId' if referencing a User document
}

export const ProductSchema = SchemaFactory.createForClass(Product);

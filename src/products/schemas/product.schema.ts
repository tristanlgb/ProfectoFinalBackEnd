// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 'general', trim: true })
  category: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ default: '' })
  thumbnail: string;

  @Prop({ type: String, default: 'admin' })
  owner: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

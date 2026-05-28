// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsBoolean()
  @IsOptional()
  readonly status?: boolean;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly stock?: number;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly thumbnail?: string;

  @IsString()
  @IsOptional()
  readonly owner?: string;
}

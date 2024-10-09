// src/carts/dto/create-cart.dto.ts
import { IsArray, ValidateNested, IsMongoId, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @IsOptional()
  items?: CartItemDto[];
}

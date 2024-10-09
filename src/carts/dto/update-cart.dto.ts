// src/carts/dto/update-cart.dto.ts
import { IsArray, ValidateNested, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

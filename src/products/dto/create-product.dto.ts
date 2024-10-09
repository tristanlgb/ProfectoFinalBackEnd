import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsBoolean()
  @IsOptional()
  readonly status?: boolean;

  @IsNumber()
  @IsOptional()
  readonly stock?: number;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly thumbnail?: string;
}

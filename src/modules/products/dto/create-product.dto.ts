import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsMongoId,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================== SUB-DTOs ====================

export class ThumbnailDto {
  @IsNotEmpty()
  publicId: string;

  @IsUrl()
  @IsNotEmpty()
  secureUrl: string;
}

// ==================== CREATE PRODUCT DTO ====================

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  price: number;

  @ValidateNested()
  @Type(() => ThumbnailDto)
  @IsOptional()
  thumbnail?: ThumbnailDto; // Optional - không bắt buộc

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  categoryIds: string[];

  @IsMongoId()
  @IsNotEmpty()
  brandId: string;

  @IsOptional()
  material?: string;
}

// ==================== CREATE PRODUCT IMAGES DTO ====================

export class ProductImageDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  publicId: string;
  @IsNotEmpty()
  secureUrl: string;
}

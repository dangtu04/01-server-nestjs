import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// ==================== VARIANT DTOs ====================
export class VariantItemDto {
  @IsMongoId()
  sizeId: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}

export class UpdateVariantsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantItemDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  variants: VariantItemDto[];
}
// // ==================== STATUS DTO ====================

// export class UpdateProductStatusDto {
//   @IsEnum(['active', 'inactive', 'draft'])
//   @IsNotEmpty()
//   status: string;
// }

// // ==================== QUERY/FILTER DTO ====================

// export class QueryProductDto {
//   @IsOptional()
//   @IsString()
//   search?: string; // Tìm theo name

//   @IsOptional()
//   @IsMongoId()
//   categoryId?: string;

//   @IsOptional()
//   @IsMongoId()
//   brandId?: string;

//   @IsOptional()
//   @IsEnum(['active', 'inactive', 'draft'])
//   status?: string;

//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   minPrice?: number;

//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   maxPrice?: number;

//   @IsOptional()
//   @IsString()
//   sizeCode?: string; // Filter theo size: "M", "L"

//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;

//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   limit?: number = 10;

//   @IsOptional()
//   @IsString()
//   sortBy?: string = 'createdAt';

//   @IsOptional()
//   @IsEnum(['asc', 'desc'])
//   sortOrder?: 'asc' | 'desc' = 'desc';
// }

// // ==================== RESPONSE DTOs ====================

// export class VariantResponseDto {
//   sizeId: string;
//   sizeCode: string;
//   sizeName: string;
//   sku: string;
//   quantity: number;
//   isAvailable: boolean;
// }

// export class ProductResponseDto {
//   _id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   price: number;
//   thumbnail?: ThumbnailDto;
//   categoryIds: string[];
//   brandId?: string;
//   material?: string;
//   variants: VariantResponseDto[];
//   status: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export class PaginatedProductResponseDto {
//   data: ProductResponseDto[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }

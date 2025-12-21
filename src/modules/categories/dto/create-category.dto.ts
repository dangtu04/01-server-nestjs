import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string; // "Áo thun nam"

  @IsOptional()
  @IsMongoId()
  parentId?: string | null; // null = category cha

  @IsOptional()
  @IsNumber()
  order?: number; // thứ tự hiển thị

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

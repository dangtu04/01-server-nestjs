import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSizeDto {
  @IsNotEmpty()
  code: string; // "S", "M", "L", "XL", "XXL"
  @IsNotEmpty()
  name: string; // "Size S", "Size M"

  @IsOptional()
  order: number;
  // Thứ tự hiển thị: 1, 2, 3...
  @IsOptional()
  isActive: boolean;
}

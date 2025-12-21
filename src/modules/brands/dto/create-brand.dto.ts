import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { UserRole } from '@/enum/user.enum';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;
}

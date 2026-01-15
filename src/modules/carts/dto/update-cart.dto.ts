import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {}

export class UpdateCartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  newQuantity: number;
}

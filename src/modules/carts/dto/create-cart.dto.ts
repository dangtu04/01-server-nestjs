import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsMongoId()
  sizeId: string;

  @IsNotEmpty()
  quantity: number;
}

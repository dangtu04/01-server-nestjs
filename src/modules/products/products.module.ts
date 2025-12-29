import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Size, SizeSchema } from '../sizes/schemas/size.schema';
import {
  ProductImage,
  ProductImageSchema,
} from './schemas/product.image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Size.name, schema: SizeSchema },
      { name: ProductImage.name, schema: ProductImageSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

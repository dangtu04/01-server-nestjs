import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductImageDocument = HydratedDocument<ProductImage>;

@Schema({ timestamps: true })
export class ProductImage {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId; // Reference đến Product

  @Prop({ required: true, unique: true, trim: true })
  publicId: string; // "products/ao-thun-001-1"

  @Prop({ required: true, trim: true })
  secureUrl: string; // "https://res.cloudinary.com/..."

  // @Prop({ required: true, default: 1, min: 1 })
  // order: number; // Thứ tự hiển thị

  // @Prop({ trim: true })
  // alt: string; // Text mô tả ảnh (SEO)
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

// ==================== SUB-SCHEMAS (Embedded) ====================

// Thumbnail Sub-Schema
@Schema({ _id: false })
export class Thumbnail {
  @Prop({ required: true, trim: true })
  publicId: string; // "products/ao-thun-001"

  @Prop({ required: true, trim: true })
  secureUrl: string; // "https://res.cloudinary.com/..."
}

export const ThumbnailSchema = SchemaFactory.createForClass(Thumbnail);

// Variant Sub-Schema (Size + Quantity)
@Schema({ _id: false })
export class ProductVariant {
  @Prop({ type: Types.ObjectId, ref: 'Size', required: true })
  sizeId: Types.ObjectId; // Reference đến Size

  @Prop({ required: true, uppercase: true, trim: true })
  sizeCode: string; // "M", "L", "XL" - Denormalize để query nhanh

  @Prop({ required: true, trim: true })
  sizeName: string; // "Size M" - Denormalize

  @Prop({ required: true, default: 0, min: 0 })
  quantity: number; // Số lượng tồn kho

  @Prop({ default: false })
  isAvailable: boolean; // Còn hàng hay không
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

// ==================== MAIN PRODUCT SCHEMA ====================

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string; // "Áo thun nam basic"

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string; // "ao-thun-nam-basic"

  @Prop({ trim: true })
  description: string; // Mô tả chi tiết

  @Prop({ required: true, min: 0 })
  price: number; // Giá chung cho tất cả size

  @Prop({ type: ThumbnailSchema, required: false, default: null })
  thumbnail: Thumbnail; // Ảnh đại diện

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  categoryIds: Types.ObjectId[]; // Mảng category IDs

  @Prop({ type: Types.ObjectId, ref: 'Brand', default: null })
  brandId: Types.ObjectId; // Reference đến Brand

  @Prop({ trim: true })
  material: string; // "Cotton 100%", "Polyester"

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[]; // Tồn kho theo size

  @Prop({
    enum: ['active', 'inactive', 'draft'],

    default: 'draft',
  })
  status: string; // Trạng thái sản phẩm
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
// ProductSchema.index({ slug: 1 });
// ProductSchema.index({ categoryIds: 1 });
// ProductSchema.index({ brandId: 1 });
// ProductSchema.index({ status: 1 });
// ProductSchema.index({ 'variants.sku': 1 }); // Query theo SKU
// ProductSchema.index({ 'variants.sizeCode': 1 }); // Query theo size
// ProductSchema.index({ price: 1 }); // Sort theo giá

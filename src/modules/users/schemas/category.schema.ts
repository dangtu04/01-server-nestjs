import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string; // "Áo thun nam", "Quần jean"

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string; // "ao-thun-nam"

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId: Types.ObjectId; // null = category cha

  @Prop({ default: 0 })
  level: number; // 0: root, 1: sub, 2: sub-sub

  @Prop({ default: 0 })
  order: number; // Thứ tự hiển thị

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

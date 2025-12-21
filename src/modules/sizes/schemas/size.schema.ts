import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SizeDocument = HydratedDocument<Size>;

@Schema({ timestamps: true })
export class Size {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string; // "S", "M", "L", "XL", "XXL"

  @Prop({ required: true, trim: true })
  name: string; // "Size S", "Size M"

  @Prop({ required: true, default: 0 })
  order: number; // Thứ tự hiển thị: 1, 2, 3...

  @Prop({ default: true })
  isActive: boolean;
}

export const SizeSchema = SchemaFactory.createForClass(Size);

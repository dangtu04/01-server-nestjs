import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

// ==================== SUB-SCHEMAS ====================

// Cart Item Sub-Schema
@Schema({ _id: true, timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Size', required: true })
  sizeId: Types.ObjectId; // ← CHỈ CÓ ID
  // Số lượng - Giới hạn tối đa 30
  @Prop({ required: true, min: 1, max: 30, default: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// ==================== MAIN CART SCHEMA ====================

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0, min: 0 })
  totalItems: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

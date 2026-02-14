import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { Product } from '@/modules/products/schemas/product.schema';
import { Size } from '@/modules/sizes/schemas/size.schema';
import { OrderItem } from './schemas/order.item.schema';
import {
  PaymentMethod,
  PaymentStatus,
  ShippingConfig,
} from '@/enum/order.enum';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Size.name) private sizeModel: Model<Size>,
  ) {}

  private async validateAndDecreaseStock(cart: Cart): Promise<void> {
    for (const item of cart.items) {
      // console.log('>>>>> item: ', item);
      const product = await this.productModel
        .findById(item.productId)
        .select('variants');
      if (!product) {
        throw new BadRequestException('Không tìm thây sản phẩm');
      }
      // console.log('>>>>', product);
      const { variants } = product;

      const foundVariant = variants.find(
        (v) => v.sizeId.toString() === item.sizeId.toString(),
      );
      if (!foundVariant) {
        throw new BadRequestException('Không tìm thấy size');
      }
      if (foundVariant.quantity < item.quantity) {
        throw new BadRequestException('Không đủ số lượng');
      }
    }
    for (const item of cart.items) {
      //update giảm quantity
      const product = await this.productModel.findById(item.productId);
      // console.log('>>>>> product: ', product);
      const oldQutity = product.variants.find(
        (variant) => variant.sizeId.toString() === item.sizeId.toString(),
      ).quantity;
      // console.log('>>>: ', oldQutity);
      const newQuantity = oldQutity - item.quantity;
      await this.productModel
        .updateOne(
          {
            _id: product._id,
            'variants.sizeId': item.sizeId,
          },
          {
            $set: {
              'variants.$.quantity': newQuantity,
            },
          },
        )
        .exec();
    }
  }
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const user = await this.userModel.findById(userId).select('email');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    const cart = await this.cartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }
    await this.validateAndDecreaseStock(cart);
    return;
    // chuẩn bị items cho order trong schema
    const items: OrderItem[] = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productModel
          .findById(item.productId)
          .select('name slug price');
        // console.log('>>>>> product: ', product);
        const size = await this.sizeModel
          .findById(item.sizeId)
          .select('code name');
        // console.log('>>>>> size: ', size);
        const result = {
          productId: product._id,
          productName: product.name,
          productSlug: product.slug,
          price: product.price,

          sizeId: size._id,
          sizeCode: size.code,
          sizeName: size.name,

          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
        };
        return result;
      }),
    );

    // chuẩn bị cho delivery trong schema
    const delivery = {
      receiverName: createOrderDto.delivery.receiverName,
      receiverPhone: createOrderDto.delivery.receiverPhone,
      address: createOrderDto.delivery.address,
      note: createOrderDto.delivery.note,
    };

    // giá tạm tính
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

    // phí ship
    const shippingFee =
      subtotal >= ShippingConfig.FREE_SHIPPING_THRESHOLD
        ? 0
        : ShippingConfig.DEFAULT_FEE;

    // tổng tiền
    const totalAmount = subtotal + shippingFee;

    // chuẩn bị cho payment trong schema
    const payment = {
      method: PaymentMethod.COD,
      status: PaymentStatus.UNPAID,
    };

    const newOrder = await this.orderModel.create({
      userId: user._id,
      userEmail: user.email,
      items,
      delivery,
      payment,
      subtotal,
      shippingFee,
      totalAmount,
    });
    console.log('>>>>> newOrder: ', newOrder);

    return {};
  }
}

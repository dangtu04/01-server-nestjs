import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { Cart } from './schemas/cart.schema';
import { CartLimits } from '@/enum/cart.enum.';
import { ProductStatus } from '@/enum/product.enum';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async addToCart(dto: CreateCartDto) {
    const { userId, productId, sizeId } = dto;
    const quantity = Number(dto.quantity);
    // validate dto
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(productId) ||
      !Types.ObjectId.isValid(sizeId)
    ) {
      throw new BadRequestException('Id không hợp lệ');
    }

    if (quantity < 1 || quantity > CartLimits.MAX_QUANTITY_PER_ITEM) {
      throw new BadRequestException(
        `Số lượng phải từ 1 đến ${CartLimits.MAX_QUANTITY_PER_ITEM}`,
      );
    }

    // check user
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    // check product
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // check product active
    if (product.status !== ProductStatus.Active) {
      throw new BadRequestException('Sản phẩm không khả dụng');
    }

    // check size dựa theo size của product đã check trước
    const variant = product.variants.find((v) => v.sizeId.equals(sizeId));
    if (!variant || !variant.isAvailable) {
      throw new BadRequestException('Kích thước không khả dụng');
    }
    // check không quá số lượng trong variant
    if (variant.quantity < quantity) {
      throw new BadRequestException('Số lượng vượt quá tồn kho');
    }

    // get cart, nếu chưa có thì tạo rỗng items
    const cart = await this.cartModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [], totalItems: 0 } },
      { new: true, upsert: true },
    );

    // check xem có trùng với sản phẩm có trong cart không
    const existingItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.sizeId.equals(sizeId),
    );

    // đã có sản phẩm trong cart
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > CartLimits.MAX_QUANTITY_PER_ITEM) {
        throw new BadRequestException(
          `Số lượng tối đa cho mỗi sản phẩm là ${CartLimits.MAX_QUANTITY_PER_ITEM}`,
        );
      }
      existingItem.quantity = newQty;
    } else {
      if (cart.items.length >= CartLimits.MAX_ITEMS) {
        throw new BadRequestException(
          `Giỏ hàng chỉ được phép tối đa ${CartLimits.MAX_ITEMS} sản phẩm`,
        );
      }
      cart.items.push({
        productId: new Types.ObjectId(productId),
        sizeId: new Types.ObjectId(sizeId),
        quantity,
      });

      cart.totalItems += 1;
    }

    await cart.save();

    return {
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      // cart,
    };
  }

  async getCartByUserId(userId: string, current: number, pageSize: number) {
    // validate đầu vào
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    current = +current || 1;
    pageSize = +pageSize || 10;

    if (current < 1) current = 1;
    if (pageSize < 1 || pageSize > CartLimits.MAX_ITEMS) pageSize = 10;

    // tìm cart và populate data liên quan
    const cart = await this.cartModel
      .findOne({ userId })
      .populate({
        path: 'items.productId',
        select: 'name price thumbnail.secureUrl',
      })
      .populate({
        path: 'items.sizeId',
        select: 'name',
      })
      .lean();

    // cart không hợp lệ hoặc rỗng
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        meta: {
          current,
          pageSize,
          pages: 0,
          totals: 0,
        },
        results: [],
      };
    }

    // tính toán pagination
    const totalItems = cart.items.length;
    const totalPages = Math.ceil(+totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const pagedItems = cart.items.slice(skip, skip + pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        totals: totalItems,
      },
      results: pagedItems,
    };
  }
}

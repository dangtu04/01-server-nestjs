import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Roles } from '@/decorator/customize';
import { UserRole } from '@/enum/user.enum';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  addToCart(@Request() req, @Body() createCartDto: CreateCartDto) {
    const userId = req.user._id;
    return this.cartsService.addToCart(userId, createCartDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  getCartByUserId(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Request() req,
  ) {
    const userId = req.user._id;
    return this.cartsService.getCartByUserId(userId, +current, +pageSize);
  }

  @Patch() // id của từng item trong cart
  @Roles(UserRole.ADMIN, UserRole.USER)
  updateCartItem(@Request() req, @Body() dto: UpdateCartItemDto) {
    const userId = req.user._id;
    return this.cartsService.updateCartItem(userId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  deleteCartItem(@Request() req, @Param('id') id: string) {
    // id là _id của item trong cart

    const userId = req.user._id;
    return this.cartsService.deleteCartItem(userId, id);
  }
}

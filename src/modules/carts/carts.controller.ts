import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Roles } from '@/decorator/customize';
import { UserRole } from '@/enum/user.enum';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  addToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.addToCart(createCartDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  getCartByUserId(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Request() req,
  ) {
    const userId = req.user._id;
    return this.cartsService.getCartByUserId(userId, +current, +pageSize);
  }
}

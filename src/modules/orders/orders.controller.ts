import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { Roles } from '@/decorator/customize';
import { UserRole } from '@/enum/user.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user._id;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAllOrders(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.ordersService.gettAllOrders(query, +current, +pageSize);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Patch('status/:id')
  @Roles(UserRole.ADMIN)
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      updateOrderStatusDto.status,
    );
  }
}

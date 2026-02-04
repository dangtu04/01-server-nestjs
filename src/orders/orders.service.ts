import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  async createOrder(createOrderDto: CreateOrderDto) {
    return createOrderDto;
  }
}

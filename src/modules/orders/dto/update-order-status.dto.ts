import { IsEnum } from 'class-validator';
import { OrderStatus } from '@/enum/order.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

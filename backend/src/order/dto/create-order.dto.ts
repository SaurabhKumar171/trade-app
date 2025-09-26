import { IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { OrderType } from 'src/enums/order.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsEnum(OrderType)
  type: OrderType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsNumber()
  buy_order_id: number;

  @IsNotEmpty()
  @IsNumber()
  sell_order_id: number;

  @IsNotEmpty()
  @IsNumber()
  buyer_id: number;

  @IsNotEmpty()
  @IsNumber()
  seller_id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderType } from 'src/enums/order.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 1. Preview Trade
  @Post('preview')
  preview(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.preview(createOrderDto);
  }

  // 2. Place Buy Order
  @Post('buy')
  placeBuy(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.type = OrderType.BUY;
    return this.orderService.create(createOrderDto);
  }

  // 3. Place Buy Order
  @Post('sell')
  placeSell(@Body() createOrderDto: CreateOrderDto) {
    createOrderDto.type = OrderType.SELL;
    return this.orderService.create(createOrderDto);
  }

  // 4. Get Current Orderbook
  @Get('orderbook')
  getOrderbook() {
    return this.orderService.getOrderbook();
  }

  // 5. Get Trade History
  @Get('trades')
  getTrades(@Query('user_id') user_id?: number) {
    return this.orderService.getTrades(user_id);
  }
}

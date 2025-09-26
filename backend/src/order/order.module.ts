import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { TradeModule } from 'src/trade/trade.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), TradeModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

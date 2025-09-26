import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';

@Module({
  controllers: [TradeController],
  providers: [TradeService],
  imports: [TypeOrmModule.forFeature([Trade])],
  exports: [TypeOrmModule],
})
export class TradeModule {}

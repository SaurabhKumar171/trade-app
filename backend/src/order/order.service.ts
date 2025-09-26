import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Trade } from 'src/trade/entities/trade.entity';
import { OrderType, OrderStatus } from 'src/enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Trade) private tradeRepo: Repository<Trade>,
  ) {}

  // ----------------------
  // 1. Preview Trade
  // ----------------------
  async preview(orderDto: CreateOrderDto) {
    const matchingOrders = await this.getMatchingOrders(orderDto);

    const previewTrades: {
      price: number;
      quantity: number;
      counterparty_id: number;
    }[] = [];

    let remainingQty = orderDto.quantity;

    for (const match of matchingOrders) {
      const tradeQty = Math.min(remainingQty, match.remaining_quantity);

      previewTrades.push({
        price: match.price,
        quantity: tradeQty,
        counterparty_id: match.user_id,
      });

      remainingQty -= tradeQty;
      if (remainingQty === 0) break;
    }

    return {
      possible: previewTrades.length > 0,
      trades: previewTrades,
      remaining_quantity: remainingQty,
    };
  }

  // ----------------------
  // 2 & 3. Place Buy/Sell Order
  // ----------------------
  async create(createOrderDto: CreateOrderDto) {
    const matchingOrders = await this.getMatchingOrders(createOrderDto);

    // Step 1: Insert new order
    const order = this.orderRepo.create({
      ...createOrderDto,
      remaining_quantity: createOrderDto.quantity,
    });
    await this.orderRepo.save(order);

    // Step 2: Execute trades
    const executedTrades: Trade[] = [];
    let remainingQty = createOrderDto.quantity;

    for (const match of matchingOrders) {
      const tradeQty = Math.min(remainingQty, match.remaining_quantity);

      // Create trade
      const trade = this.tradeRepo.create({
        buy_order_id:
          createOrderDto.type === OrderType.BUY
            ? order.order_id
            : match.order_id,
        sell_order_id:
          createOrderDto.type === OrderType.SELL
            ? order.order_id
            : match.order_id,
        buyer_id:
          createOrderDto.type === OrderType.BUY
            ? createOrderDto.user_id
            : match.user_id,
        seller_id:
          createOrderDto.type === OrderType.SELL
            ? createOrderDto.user_id
            : match.user_id,
        price: match.price,
        quantity: tradeQty,
      });
      await this.tradeRepo.save(trade);

      // Update matched order
      match.remaining_quantity -= tradeQty;
      match.status =
        match.remaining_quantity === 0
          ? OrderStatus.FILLED
          : OrderStatus.PARTIAL;
      await this.orderRepo.save(match);

      executedTrades.push(trade);
      remainingQty -= tradeQty;
      if (remainingQty === 0) break;
    }

    // Update new order
    order.remaining_quantity = remainingQty;
    order.status =
      remainingQty === 0
        ? OrderStatus.FILLED
        : remainingQty < createOrderDto.quantity
          ? OrderStatus.PARTIAL
          : OrderStatus.PENDING;
    await this.orderRepo.save(order);

    return {
      order_id: order.order_id,
      status: order.status,
      executed_trades: executedTrades.map((t) => ({
        price: t.price,
        quantity: t.quantity,
        counterparty_id:
          t.buyer_id === createOrderDto.user_id ? t.seller_id : t.buyer_id,
      })),
      remaining_quantity: remainingQty,
    };
  }

  // ----------------------
  // 4. Get Current Orderbook
  // ----------------------
  async getOrderbook() {
    const buyOrders = await this.orderRepo.find({
      where: { type: OrderType.BUY, status: OrderStatus.PENDING },
      order: { price: 'DESC', created_at: 'ASC' },
    });

    const sellOrders = await this.orderRepo.find({
      where: { type: OrderType.SELL, status: OrderStatus.PENDING },
      order: { price: 'ASC', created_at: 'ASC' },
    });

    return {
      buy_orders: buyOrders.map((o) => ({
        price: o.price,
        quantity: o.quantity,
        remaining_quantity: o.remaining_quantity,
      })),
      sell_orders: sellOrders.map((o) => ({
        price: o.price,
        quantity: o.quantity,
        remaining_quantity: o.remaining_quantity,
      })),
    };
  }

  // ----------------------
  // 5. Get Trade History
  // ----------------------
  async getTrades(user_id?: number) {
    const where = user_id
      ? [{ buyer_id: user_id }, { seller_id: user_id }]
      : {};
    const trades = await this.tradeRepo.find({
      where,
      order: { created_at: 'ASC' },
    });

    return trades.map((t) => ({
      trade_id: t.trade_id,
      buy_order_id: t.buy_order_id,
      sell_order_id: t.sell_order_id,
      buyer_id: t.buyer_id,
      seller_id: t.seller_id,
      price: t.price,
      quantity: t.quantity,
      created_at: t.created_at,
    }));
  }

  // ----------------------
  // Helper: Match Orders
  // ----------------------
  private async getMatchingOrders(orderDto: CreateOrderDto) {
    if (orderDto.type === OrderType.BUY) {
      return this.orderRepo.find({
        where: {
          type: OrderType.SELL,
          status: OrderStatus.PENDING,
          price: LessThanOrEqual(orderDto.price),
        },
        order: { price: 'ASC', created_at: 'ASC' },
      });
    } else {
      return this.orderRepo.find({
        where: {
          type: OrderType.BUY,
          status: OrderStatus.PENDING,
          price: MoreThanOrEqual(orderDto.price),
        },
        order: { price: 'DESC', created_at: 'ASC' },
      });
    }
  }
}

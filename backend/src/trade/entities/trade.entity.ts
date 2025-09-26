import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  trade_id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'buy_order_id' })
  buy_order: Order;

  @Column()
  buy_order_id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'sell_order_id' })
  sell_order: Order;

  @Column()
  sell_order_id: number;

  @Column()
  buyer_id: number;

  @Column()
  seller_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}

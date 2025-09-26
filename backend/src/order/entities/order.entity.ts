import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { OrderType, OrderStatus } from 'src/enums/order.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({})
  quantity: number;

  @Column({})
  remaining_quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: number;
}

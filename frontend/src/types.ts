export type OrderType = "BUY" | "SELL";

export type CreateOrderDto = {
  user_id: number;
  type?: OrderType;
  price: number;
  quantity: number;
};

export type PreviewTrade = {
  price: number;
  quantity: number;
  counterparty_id: number;
};

export type OrderbookRow = {
  price: number;
  quantity: number;
  remaining_quantity: number;
};

export type TradeRow = {
  trade_id?: number;
  buy_order_id?: number;
  sell_order_id?: number;
  buyer_id?: number;
  seller_id?: number;
  price: number;
  quantity: number;
  created_at?: string;
};

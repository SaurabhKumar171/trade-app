// components/Orderbook.tsx
import React from "react";
import type { OrderbookRow } from "../types";

type OrderbookProps = {
  buyOrders: OrderbookRow[];
  sellOrders: OrderbookRow[];
};

// Helper to calculate total volume for depth visualization
const calculateTotalVolume = (orders: OrderbookRow[]) =>
  orders.reduce((acc, o) => acc + o.remaining_quantity, 0);

export default function Orderbook({ buyOrders, sellOrders }: OrderbookProps) {
  const totalBuyVolume = calculateTotalVolume(buyOrders);
  const totalSellVolume = calculateTotalVolume(sellOrders);
  const maxVolume = Math.max(totalBuyVolume, totalSellVolume);

  const bestAsk = sellOrders[0]?.price || 0;
  const bestBid = buyOrders[0]?.price || 0;
  const spread =
    bestAsk > 0 && bestBid > 0 ? (bestAsk - bestBid).toFixed(2) : "-";

  const OrderRow = ({
    price,
    remaining_quantity,
    total,
    isBuy,
  }: OrderbookRow & { total: number; isBuy: boolean }) => {
    const depthPercentage = maxVolume > 0 ? (total / maxVolume) * 100 : 0;

    return (
      <div className="relative flex justify-between text-sm font-mono p-1.5 overflow-hidden">
        <div
          className={`absolute top-0 bottom-0 ${
            isBuy ? "right-0 bg-green-500/10" : "left-0 bg-red-500/10"
          }`}
          style={{ width: `${depthPercentage}%` }}
        ></div>
        <span className={`z-10 ${isBuy ? "text-green-400" : "text-slate-300"}`}>
          {Number(price).toFixed(2)}
        </span>
        <span className="z-10 text-slate-300">{remaining_quantity}</span>
        <span className={`z-10 ${isBuy ? "text-slate-300" : "text-red-400"}`}>
          {Number(total).toFixed(2)}
        </span>
      </div>
    );
  };

  // Calculate cumulative totals for visualization
  const cumulativeBuys = buyOrders.map((o, i) => ({
    ...o,
    total: buyOrders
      .slice(0, i + 1)
      .reduce((acc, curr) => acc + curr.remaining_quantity, 0),
  }));
  const cumulativeSells = sellOrders.map((o, i) => ({
    ...o,
    total: sellOrders
      .slice(0, i + 1)
      .reduce((acc, curr) => acc + curr.remaining_quantity, 0),
  }));

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg shadow-2xl border border-slate-700">
      <h2 className="font-semibold mb-3 text-slate-200">Orderbook</h2>

      {/* Table Header */}
      <div className="flex justify-between text-xs text-slate-500 mb-2 px-1.5 font-sans">
        <span>Price (USD)</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>

      {/* Sell Orders */}
      <div className="space-y-0.5">
        {cumulativeSells
          .slice()
          .reverse()
          .map((o, i) => (
            <OrderRow key={i} {...o} isBuy={false} />
          ))}
      </div>

      {/* Spread */}
      <div className="py-2 my-1 text-center border-y border-slate-700">
        <span
          className={`text-lg font-bold ${
            parseFloat(spread) > 0 ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {spread}
        </span>
      </div>

      {/* Buy Orders */}
      <div className="space-y-0.5">
        {cumulativeBuys.map((o, i) => (
          <OrderRow key={i} {...o} isBuy={true} />
        ))}
      </div>
    </div>
  );
}

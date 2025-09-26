// components/TradesTable.tsx
import React from "react";
import type { TradeRow } from "../types";

type TradesProps = {
  trades: TradeRow[];
  currentUserId: number; // To determine buy/sell color
};

export default function TradesTable({ trades, currentUserId }: TradesProps) {
  return (
    <section className="bg-slate-900/70 p-4 rounded-lg shadow-2xl border border-slate-700">
      <h2 className="font-semibold mb-3 text-slate-200">Trade History</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-slate-300">
          <thead className="bg-slate-800 sticky top-0">
            <tr className="text-left">
              <th className="p-2.5 font-medium text-slate-400">Time</th>
              <th className="p-2.5 font-medium text-slate-400">Price</th>
              <th className="p-2.5 font-medium text-slate-400">Quantity</th>
              <th className="p-2.5 font-medium text-slate-400">Buyer</th>
              <th className="p-2.5 font-medium text-slate-400">Seller</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No trades yet
                </td>
              </tr>
            )}
            {trades.map((t, i) => {
              const isUserBuyer = t.buyer_id === currentUserId;
              return (
                <tr key={i} className="hover:bg-slate-800/50">
                  <td className="p-2.5 font-mono text-slate-500">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td
                    className={`p-2.5 font-mono font-semibold ${
                      isUserBuyer ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {Number(t.price).toFixed(2)}
                  </td>
                  <td className="p-2.5 font-mono">{t.quantity}</td>
                  <td className="p-2.5 font-mono">{t.buyer_id}</td>
                  <td className="p-2.5 font-mono">{t.seller_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

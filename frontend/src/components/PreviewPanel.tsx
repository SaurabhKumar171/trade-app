// components/PreviewPanel.tsx
import React from "react";
import type { PreviewTrade } from "../types";

type PreviewProps = {
  possible: boolean;
  trades: PreviewTrade[];
  remaining_quantity: number;
};

export default function PreviewPanel({
  possible,
  trades,
  remaining_quantity,
}: PreviewProps) {
  return (
    <div className="mt-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-slate-300">
      <h3 className="font-semibold mb-3 text-slate-200">Order Preview</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Possible:</span>
          {possible ? (
            <span className="font-bold text-green-400">✅ Yes</span>
          ) : (
            <span className="font-bold text-red-400">❌ No</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Remaining Quantity:</span>
          <span className="font-mono">{remaining_quantity}</span>
        </div>
      </div>

      {trades.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-400 mb-2">
            Matching Trades
          </h4>
          <div className="overflow-hidden border border-slate-700 rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-slate-800">
                <tr className="text-left">
                  <th className="p-2 font-medium">Price</th>
                  <th className="p-2 font-medium">Quantity</th>
                  <th className="p-2 font-medium">Counterparty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {trades.map((t, i) => (
                  <tr key={i} className="bg-slate-900/50">
                    <td className="p-2 font-mono">{t.price}</td>
                    <td className="p-2 font-mono">{t.quantity}</td>
                    <td className="p-2 font-mono">{t.counterparty_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

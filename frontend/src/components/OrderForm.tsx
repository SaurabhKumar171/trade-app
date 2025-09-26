import React from "react";
import type { OrderType } from "../types";

type OrderFormProps = {
  price: number;
  setPrice: (val: number) => void;
  quantity: number;
  setQuantity: (val: number) => void;
  handlePreview: (type: OrderType) => void;
  handlePlace: (type: OrderType) => void;
  loading: boolean;
};

export default function OrderForm({
  price,
  setPrice,
  quantity,
  setQuantity,
  handlePreview,
  handlePlace,
  loading,
}: OrderFormProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-medium mb-3 text-gray-700">Place Order</h2>
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-sm text-black">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="px-2 py-1 border rounded w-32 text-black"
          />
        </div>
        <div>
          <label className="block text-sm  text-black">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-2 py-1 border rounded w-32 text-black"
          />
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => handlePreview("BUY")}
            disabled={loading}
            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Preview Buy
          </button>
          <button
            onClick={() => handlePlace("BUY")}
            disabled={loading}
            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Place Buy
          </button>
          <button
            onClick={() => handlePreview("SELL")}
            disabled={loading}
            className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white"
          >
            Preview Sell
          </button>
          <button
            onClick={() => handlePlace("SELL")}
            disabled={loading}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Place Sell
          </button>
        </div>
      </div>
    </div>
  );
}

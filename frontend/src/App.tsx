// App.tsx
import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import OrderForm from "./components/OrderForm";
import PreviewPanel from "./components/PreviewPanel";
import Orderbook from "./components/Orderbook";
import TradesTable from "./components/TradesTable";
import ErrorAlert from "./components/ErrorAlert";
import SuccessAlert from "./components/SuccessAlert"; // Import new component
import type {
  OrderType,
  CreateOrderDto,
  PreviewTrade,
  OrderbookRow,
  TradeRow,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [userId, setUserId] = useState<number>(1);
  const [price, setPrice] = useState<number>(100.5);
  const [quantity, setQuantity] = useState<number>(10);
  const [previewResult, setPreviewResult] = useState<null | {
    possible: boolean;
    trades: PreviewTrade[];
    remaining_quantity: number;
  }>(null);
  const [orderbook, setOrderbook] = useState<{
    buy_orders: OrderbookRow[];
    sell_orders: OrderbookRow[];
  }>({ buy_orders: [], sell_orders: [] });
  const [trades, setTrades] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // For success notifications

  const fetchOrderbook = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/order/orderbook`);
      if (!res.ok) throw new Error("Failed to fetch orderbook");
      setOrderbook(await res.json());
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  }, []);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/order/trades`);
      if (!res.ok) throw new Error("Failed to fetch trades");
      const tradeData: TradeRow[] = await res.json();
      // Sort trades by most recent first
      setTrades(
        tradeData.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  }, []);

  useEffect(() => {
    fetchOrderbook();
    fetchTrades();
    // Optional: Auto-refresh data every 5 seconds
    const interval = setInterval(() => {
      fetchOrderbook();
      fetchTrades();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrderbook, fetchTrades]);

  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  async function handlePreview(type: OrderType) {
    clearNotifications();
    setLoading(true);
    try {
      const body: CreateOrderDto = { user_id: userId, type, price, quantity };
      const res = await fetch(`${API_BASE}/order/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Preview failed");
      setPreviewResult(await res.json());
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePlace(type: OrderType) {
    clearNotifications();
    setLoading(true);
    try {
      const endpoint = type === "BUY" ? "order/buy" : "order/sell";
      const body = { user_id: userId, price, quantity }; // DTO might not need 'type' here
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const resText = await res.text();
      if (!res.ok) throw new Error(resText || `${type} order failed`);

      const data = JSON.parse(resText);
      await fetchOrderbook();
      await fetchTrades();
      setPreviewResult(null);
      setSuccess(
        `Order placed: ${data.status}, remaining: ${data.remaining_quantity}`
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header userId={userId} setUserId={setUserId} />

        <main className="flex flex-col gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <OrderForm
              price={price}
              setPrice={setPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              handlePreview={handlePreview}
              handlePlace={handlePlace}
              loading={loading}
            />
            {previewResult && <PreviewPanel {...previewResult} />}
          </div>

          {/* Center Column */}
          <div className="">
            <Orderbook
              buyOrders={orderbook.buy_orders}
              sellOrders={orderbook.sell_orders}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1">
            <TradesTable trades={trades} currentUserId={userId} />
          </div>
        </main>

        {/* Notifications */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && (
          <SuccessAlert message={success} onClose={() => setSuccess(null)} />
        )}
      </div>
    </div>
  );
}

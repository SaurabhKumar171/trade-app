type HeaderProps = {
  userId: number;
  setUserId: (id: number) => void;
};

export default function Header({ userId, setUserId }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
      <h1 className="text-3xl font-bold text-slate-100">📊 Orderbook</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-400">User ID</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="w-24 px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
    </header>
  );
}

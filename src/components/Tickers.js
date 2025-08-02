import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Service layer for API calls
const tradeService = {
  submitOrder: async ({ symbol, qty, side }) => {
    try {
      // Generate a UUID for tickerId
      const tradeId = crypto.randomUUID ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );

      const response = await fetch('http://localhost:8080/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeId: tradeId,
          ticker: symbol,
          quantity: qty,
          price: 0, // Set price as needed, or pass as argument
          buySell: side.toUpperCase(),
          clientId: 'client_Mitali',
        }),
      });
      if (!response.ok) throw new Error('API error');
      const res =  await response.json();
      console.log('Trade submitted successfully:', res);
      return res;
    } catch (error) {
      console.error('Trade API error:', error);
      throw error;
    }
  },
};

const Tickers = ({ items }) => {
  // Store qty for each symbol
  const [qtys, setQtys] = React.useState({});

  const handleQtyChange = (symbol, value) => {
    setQtys((prev) => ({
      ...prev,
      [symbol]: value,
    }));
  };

  const handleTrade = async (symbol, side) => {
    const qty = Number(qtys[symbol]) || 1;
    try {
      await tradeService.submitOrder({ symbol, qty, side });
      // Optionally show success message or update UI
    } catch (e) {
      // Optionally show error message
    }
  };

  return (
    <aside className="w-full max-w-xl bg-gray-800 p-4 rounded-lg overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.symbol}
            className="flex flex-col gap-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            {/* Top Row: Symbol, Price, Trend, Qty, Buy, Sell */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Symbol + Price */}
              <div className="flex flex-col min-w-[80px]">
                <span className="font-medium text-white">{item.symbol}</span>
                <span className="text-sm text-gray-400">
                  {item.price.toLocaleString()}
                </span>
              </div>

              {/* Trend */}
              <div
                className={`flex items-center text-sm font-semibold ${
                  item.color === 'green' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {item.color === 'green' ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </span>
              </div>

              {/* Qty input */}
              <div className="flex items-center gap-2">
                <label htmlFor={`qty-${item.symbol}`} className="text-white text-sm">
                  Qty:
                </label>
                <input
                  id={`qty-${item.symbol}`}
                  type="number"
                  min="1"
                  className="w-20 px-2 py-1 rounded bg-gray-900 text-white text-sm border border-gray-600 focus:outline-none"
                  value={qtys[item.symbol] || ''}
                  onChange={(e) => handleQtyChange(item.symbol, e.target.value)}
                />
              </div>

              {/* Buy & Sell Buttons */}
              <div className="flex gap-2">
                <button
                  className="w-16 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition"
                  onClick={() => handleTrade(item.symbol, 'buy')}
                >
                  Buy
                </button>
                <button
                  className="w-16 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition"
                  onClick={() => handleTrade(item.symbol, 'sell')}
                >
                  Sell
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Tickers;


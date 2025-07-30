import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Watchlist = ({ items }) => (
  <aside className="w-64 bg-gray-800 p-4 rounded-lg overflow-y-auto">
    <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.symbol} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
          <div>
            <span className="font-medium">{item.symbol}</span>
            <span className="block text-sm text-gray-400">{item.price.toLocaleString()}</span>
          </div>
          <div className={`flex items-center ${item.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
            {item.color === 'green' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
          </div>
        </li>
      ))}
    </ul>
  </aside>
);

export default Watchlist;

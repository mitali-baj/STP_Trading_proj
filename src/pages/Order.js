import React from 'react';
import Header from '../components/Header';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Tickers from '../components/Tickers';
import News from '../components/News';
import { chartData, indices, watchlistItems, newsItems } from '../data/sampleData';
const Order = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      
      <main className="flex-grow p-6 overflow-hidden flex">
        <div className="flex-grow mr-4">
          <Tickers items={watchlistItems} />
          
        </div>
        <News items={newsItems} />
      </main>
    </div>
  );
};

export default Order;

import React, { useState } from 'react';
import Tickers from '../components/Tickers';
import News from '../components/News';
import WebSocketClient from '../components/WebSocketClient';
import { watchlistItems } from '../data/sampleData';

// Basic keyword-based sentiment detection fallback
const detectSentiment = (title) => {
  const t = title.toLowerCase();

  if (t.includes('surge') || t.includes('gain') || t.includes('rise') || t.includes('profit') || t.includes('record') || t.includes('soars') || t.includes('growth')) {
    return 'Positive';
  } else if (t.includes('fall') || t.includes('loss') || t.includes('drop') || t.includes('plunge') || t.includes('scandal') || t.includes('decline') || t.includes('negative')) {
    return 'Negative';
  } else {
    return 'Neutral';
  }
};

const Order = () => {
  const [newsMessages, setNewsMessages] = useState([]);
  const [watchlistItems, setWatchListItems] = useState([]);


  const handleNewMessage = (msg) => {
    try {
      const parsedMsg = typeof msg === 'string' ? JSON.parse(msg) : msg;

      if (parsedMsg.messageType === 'news') {
        const rawTitle = parsedMsg.message?.title || '';
        const backendSentiment = parsedMsg.message?.sentiment?.toLowerCase();
        const finalSentiment = backendSentiment === 'positive' || backendSentiment === 'negative'
          ? backendSentiment
          : detectSentiment(rawTitle).toLowerCase();

        const formatted = {
          sentiment: finalSentiment.charAt(0).toUpperCase() + finalSentiment.slice(1), // Capitalize
          ticker: parsedMsg.message?.ticker || 'N/A',
          headline: rawTitle,
          color: finalSentiment === 'positive' ? 'green' :
                 finalSentiment === 'negative' ? 'red' : 'gray',
        };

        // Limit to last 9
        setNewsMessages(prev => [formatted, ...prev].slice(0, 6));
      }


if (parsedMsg.messageType === 'prices') {
  const newSymbol = parsedMsg.message?.ticker || 'N/A';
  const newPrice = parsedMsg.message?.close;

  setWatchListItems(prevItems => {
    const existingIndex = prevItems.findIndex(item => item.symbol === newSymbol);

    if (existingIndex !== -1) {
      // Update price of existing ticker
      const updated = [...prevItems];
      updated[existingIndex] = { ...updated[existingIndex], price: newPrice };
      return updated;
    } else {
      // Add new ticker if not already present
      return [...prevItems, { symbol: newSymbol, price: newPrice }];
    }
  });
}



    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <main className="flex-grow p-6 overflow-hidden flex">
        <div className="flex-grow mr-4">
          <Tickers items={watchlistItems} />
        </div>
        <News items={newsMessages} />
      </main>

      <WebSocketClient onMessage={handleNewMessage} />
    </div>
  );
};


//for prices:
export default Order;

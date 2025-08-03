import React, { useState } from 'react';
import WebSocketClient from '../components/WebSocketClient';

const Portfolio = () => {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (msg) => {
    // Ensure string or parse if needed
    // check "messageType" whether "prices" or "news" and handle accordingly
    try {
      const parsedMsg = typeof msg === 'string' ? JSON.parse(msg) : msg;
      setMessages(prev => [...prev, parsedMsg]);
    } catch (err) {
      console.error('Error parsing message:', err);
      setMessages(prev => [...prev, msg]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📈 Live Trade Updates</h1>

      <WebSocketClient onMessage={handleNewMessage} />

      <ul className="bg-gray-800 text-white p-4 rounded space-y-2 max-h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <li key={idx} className="border-b border-gray-700 py-2">
            <pre className="whitespace-pre-wrap break-words text-sm">{JSON.stringify(msg, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;

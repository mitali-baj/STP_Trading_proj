// import React, { useEffect, useState } from 'react';
// import WebSocketClient from '../components/WebSocketClient';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';

// const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA', '#F87171', '#4ADE80'];

// const Portfolio = () => {
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [livePrices, setLivePrices] = useState([]);
//   const [summary, setSummary] = useState({
//     totalNotional: 0,
//     totalMarket: 0,
//     totalUnrealized: 0,
//     totalRealized: 0,
//   });

//   // Add a new state to track if we've already sent the AI prompt
//   const [aiPromptSent, setAiPromptSent] = useState(false);
//   const [aiHeadline, setAiHeadline] = useState("");
//   const [aiDescription, setAiDescription] = useState("");
// const [showStrategyDesc, setShowStrategyDesc] = useState(false);

//   useEffect(() => {
//     fetch('http://localhost:8080/trades?clientId=client_Mitali')
//       .then(res => res.json())
//       .then(data => setTrades(data))
//       .catch(err => console.error(err));
//   }, []);

//   const handleNewMessage = (msg) => {
//     try {
//       const parsedMsg = typeof msg === 'string' ? JSON.parse(msg) : msg;

//       if (parsedMsg.messageType === 'prices') {
//         const newSymbol = parsedMsg.message?.ticker || 'N/A';
//         const newPrice = parsedMsg.message?.close;

//         setLivePrices(prevItems => {
//           const existingIndex = prevItems.findIndex(item => item.symbol === newSymbol);
//           if (existingIndex !== -1) {
//             const updated = [...prevItems];
//             updated[existingIndex] = { ...updated[existingIndex], price: newPrice };
//             return updated;
//           } else {
//             return [...prevItems, { symbol: newSymbol, price: newPrice }];
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Error parsing WebSocket message:', err);
//     }
//   };

//   useEffect(() => {
//     if (!trades.length) return;

//     const settledTrades = trades.filter(
//       t =>
//         t.lifecycleState === 'VALIDATION & SETTLEMENT' &&
//         t.settlementStatus === 'SETTLED'
//     );

//     const portfolioMap = {};

//     settledTrades.forEach(trade => {
//       const { ticker, quantity, buySell, price } = trade;

//       if (!portfolioMap[ticker]) {
//         portfolioMap[ticker] = {
//           ticker,
//           quantityHeld: 0,
//           totalBuyCost: 0,
//           realizedPnL: 0,
//         };
//       }

//       const position = portfolioMap[ticker];

//       if (buySell === 'BUY') {
//         position.totalBuyCost += price * quantity;
//         position.quantityHeld += quantity;
//       } else if (buySell === 'SELL') {
//         const sellQty = quantity;
//         const avgBuyPrice =
//           position.quantityHeld > 0
//             ? position.totalBuyCost / position.quantityHeld
//             : 0;

//         const matchedQty = Math.min(sellQty, position.quantityHeld);
//         const pnl = (price - avgBuyPrice) * matchedQty;

//         position.realizedPnL += pnl;
//         position.totalBuyCost -= avgBuyPrice * matchedQty;
//         position.quantityHeld -= matchedQty;
//       }
//     });

//     let totalNotional = 0;
//     let totalMarket = 0;
//     let totalUnrealized = 0;

//     const positions = Object.values(portfolioMap);

//     // ✅ Compute realized PnL from all positions
//     const totalRealized = positions.reduce((acc, pos) => acc + pos.realizedPnL, 0);

//     // ✅ Create holdings array only for positions with quantity > 0
//     const holdingsArr = positions
//       .filter(pos => pos.quantityHeld > 0)
//       .map(pos => {
//         const avgBuyPrice = pos.quantityHeld > 0 ? pos.totalBuyCost / pos.quantityHeld : 0;
//         const live = livePrices.find(p => p.symbol === pos.ticker);
//         const marketPrice = live?.price || avgBuyPrice;

//         const notionalValue = pos.quantityHeld * avgBuyPrice;
//         const marketValue = pos.quantityHeld * marketPrice;
//         const unrealizedPnL = marketValue - notionalValue;

//         totalNotional += notionalValue;
//         totalMarket += marketValue;
//         totalUnrealized += unrealizedPnL;

//         return {
//           ticker: pos.ticker,
//           qty: pos.quantityHeld,
//           notionalPrice: avgBuyPrice.toFixed(2),
//           notionalValue,
//           marketPrice: marketPrice.toFixed(2),
//           marketValue,
//           unrealizedPnL,
//           realizedPnL: pos.realizedPnL,
//         };
//       });

//     setHoldings(holdingsArr);
//     setSummary({
//       totalNotional,
//       totalMarket,
//       totalUnrealized,
//       totalRealized,
//     });

//   }, [trades, livePrices]);


// useEffect(() => {
// //   if (!aiPromptSent && holdings.length > 0) {
//     const fetchAI = async () => {
//     try {
//     const aiPrompt = `
// Below is my portfolio. You are expected to provide a rebalance strategy in two parts. 
// 1. Strategy Headline max 20 words. Include the ticker name in the headline.
// 2. Details of the strategy execution 
// 3. Ticker wise buy / sell quantity. 
// You must provide the response in a well formed json. 
// Below is an example of json structure.

// {
//     "headline": <headline>,
//     "strategy_description": <description in max 300 words>,
//     "ticker_actions": [
//         {
//             "ticker": <ticker>,
//             "action": <buy/sell>,
//             "qty": <qty>
//         },
//         {
//             "ticker": <ticker>,
//             "action": <buy/sell>,
//             "qty": <qty>
//         }
//     ]
// } 

// Only provide well formed JSON object as response output.

// Portfolio Data:
// ${JSON.stringify(holdings, null, 2)}
// `;

//     fetch("http://localhost:5000/api/bedrock", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt: aiPrompt })
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log("AI full response:", data);

//         // Set headline if present
//         if (data && data.headline) {
//           setAiHeadline(data.headline);
//         }
//         if (data.strategy_description) setAiDescription(data.strategy_description);

//         // Show complete AI response
//         console.log(`AI Response:\n${JSON.stringify(data, null, 2)}`);

//         // Mark as sent to avoid future calls
//         setAiPromptSent(true);
//       })
//       .catch(err => {
//         console.error("Error calling AI:", err);
//       });
//     } catch (err) {
//         console.error("Error in AI fetch:", err);
//     }
//   };
//   if (!aiPromptSent && holdings.length > 0) {
//     fetchAI();
//   }
// },[holdings, aiPromptSent]);



//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-6">
    

    
// {aiHeadline && (
//   <div className="bg-gray-800 p-5 rounded-xl shadow-md mb-8">
//     <h3 className="text-lg font-bold text-blue-400">AI Suggested Rebalance</h3>
    
//     <p className="text-white text-xl mt-2">{aiHeadline}</p>

//     {/* Collapse Toggle */}
//     <button
//       onClick={() => setShowStrategyDesc(prev => !prev)}
//       className="mt-4 text-sm text-blue-400 hover:underline focus:outline-none"
//     >
//       {showStrategyDesc ? "Hide Details ▲" : "Show Details ▼"}
//     </button>

//     {/* Collapsible Content */}
//     {showStrategyDesc && aiDescription && (
//       <div className="mt-3 p-3 bg-gray-700 rounded-lg text-gray-300 text-sm whitespace-pre-wrap">
//         {aiDescription}
//       </div>
//     )}
//   </div>
// )}
// {/* 
//   </div> */}
// {/* )} */}
//       {/* Summary & Chart */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//         {/* Portfolio Summary Cards */}
//         <div className="bg-gray-800 p-5 rounded-xl shadow-md space-y-4">
//           <h3 className="text-lg font-bold text-white">Portfolio Summary</h3>
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div className="bg-gray-700 p-8 rounded-xl">
//               <p className="text-gray-400 text-lg">Notional Value</p>
//               <p className="text-white font-semibold text-xl">₹{summary.totalNotional.toFixed(2)}</p>
//             </div>
//             <div className="bg-gray-700 p-8 rounded-xl">
//               <p className="text-gray-400 text-lg">Market Value</p>
//               <p className="text-white font-semibold text-xl">₹{summary.totalMarket.toFixed(2)}</p>
//             </div>
//             <div className="bg-gray-700 p-8 rounded-xl">
//               <p className="text-gray-400 text-lg">Unrealized P/L</p>
//               <p className={`font-semibold text-xl ${summary.totalUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                 ₹{summary.totalUnrealized.toFixed(2)}
//               </p>
//             </div>
//             <div className="bg-gray-700 p-8 rounded-xl">
//               <p className="text-gray-400 text-lg">Realized P/L</p>
//               <p className={`font-semibold text-xl ${summary.totalRealized >= 0 ? 'text-green-300' : 'text-red-300'}`}>
//                 ₹{summary.totalRealized.toFixed(2)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-gray-800 p-6 rounded-xl shadow-md">
//           <h3 className="text-lg font-bold text-white mb-4">Stock Composition</h3>
//           {holdings.length > 0 ? (
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={holdings}
//                   dataKey="notionalValue"
//                   nameKey="ticker"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={90}
//                 >
//                   {holdings.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => `₹${parseFloat(value).toFixed(2)}`} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-400">No data to display.</p>
//           )}
//         </div>
//       </div>

//       {/* Holdings Table */}
//       <h2 className="text-2xl font-semibold mb-6 text-blue-400">Current Holdings</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gray-700 text-sm">
//               <th className="px-4 py-2 text-left">Ticker</th>
//               <th className="px-4 py-2 text-left">Qty</th>
//               <th className="px-4 py-2 text-left">Notional Price</th>
//               <th className="px-4 py-2 text-left">Notional Value</th>
//               <th className="px-4 py-2 text-left">Market Price</th>
//               <th className="px-4 py-2 text-left">Market Value</th>
//               <th className="px-4 py-2 text-left">Unrealized P/L</th>
//               <th className="px-4 py-2 text-left">Realized P/L</th>
//             </tr>
//           </thead>
//           <tbody>
//             {holdings.map((item, index) => (
//               <tr key={index} className="border-b border-gray-700 text-sm">
//                 <td className="px-4 py-2">{item.ticker}</td>
//                 <td className="px-4 py-2">{item.qty}</td>
//                 <td className="px-4 py-2">₹{item.notionalPrice}</td>
//                 <td className="px-4 py-2">₹{item.notionalValue.toFixed(2)}</td>
//                 <td className="px-4 py-2">₹{item.marketPrice}</td>
//                 <td className="px-4 py-2">₹{item.marketValue.toFixed(2)}</td>
//                 <td
//                   className={`px-4 py-2 font-semibold ${
//                     item.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
//                   }`}
//                 >
//                   ₹{item.unrealizedPnL.toFixed(2)}
//                 </td>
//                 <td
//                   className={`px-4 py-2 font-semibold ${
//                     item.realizedPnL >= 0 ? 'text-green-300' : 'text-red-300'
//                   }`}
//                 >
//                   ₹{item.realizedPnL.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//             {holdings.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center text-gray-400 py-4">
//                   No current holdings.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <WebSocketClient onMessage={handleNewMessage} />
//     </div>
//   );
// };

// export default Portfolio;

import React, { useEffect, useState } from 'react';
import WebSocketClient from '../components/WebSocketClient';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA', '#F87171', '#4ADE80'];

const Portfolio = () => {
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState([]);
  const [summary, setSummary] = useState({
    totalNotional: 0,
    totalMarket: 0,
    totalUnrealized: 0,
    totalRealized: 0,
  });

  // Track readiness for AI fetch
  const [holdingsReady, setHoldingsReady] = useState(false);

  const [aiPromptSent, setAiPromptSent] = useState(false);
  const [aiHeadline, setAiHeadline] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [showStrategyDesc, setShowStrategyDesc] = useState(false);

  // Fetch trades initially
  useEffect(() => {
    fetch('http://localhost:8080/trades?clientId=client_Mitali')
      .then(res => res.json())
      .then(data => setTrades(data))
      .catch(err => console.error(err));
  }, []);

  // Handle live prices via WebSocket
  const handleNewMessage = (msg) => {
    try {
      const parsedMsg = typeof msg === 'string' ? JSON.parse(msg) : msg;
      if (parsedMsg.messageType === 'prices') {
        const newSymbol = parsedMsg.message?.ticker || 'N/A';
        const newPrice = parsedMsg.message?.close;

        setLivePrices(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.symbol === newSymbol);
          if (existingIndex !== -1) {
            const updated = [...prevItems];
            updated[existingIndex] = { ...updated[existingIndex], price: newPrice };
            return updated;
          } else {
            return [...prevItems, { symbol: newSymbol, price: newPrice }];
          }
        });
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };

  // Calculate holdings
  useEffect(() => {
    if (!trades.length) return;

    const settledTrades = trades.filter(
      t =>
        t.lifecycleState === 'VALIDATION & SETTLEMENT' &&
        t.settlementStatus === 'SETTLED'
    );

    const portfolioMap = {};

    settledTrades.forEach(trade => {
      const { ticker, quantity, buySell, price } = trade;

      if (!portfolioMap[ticker]) {
        portfolioMap[ticker] = {
          ticker,
          quantityHeld: 0,
          totalBuyCost: 0,
          realizedPnL: 0,
        };
      }

      const position = portfolioMap[ticker];

      if (buySell === 'BUY') {
        position.totalBuyCost += price * quantity;
        position.quantityHeld += quantity;
      } else if (buySell === 'SELL') {
        const sellQty = quantity;
        const avgBuyPrice =
          position.quantityHeld > 0
            ? position.totalBuyCost / position.quantityHeld
            : 0;

        const matchedQty = Math.min(sellQty, position.quantityHeld);
        const pnl = (price - avgBuyPrice) * matchedQty;

        position.realizedPnL += pnl;
        position.totalBuyCost -= avgBuyPrice * matchedQty;
        position.quantityHeld -= matchedQty;
      }
    });

    let totalNotional = 0;
    let totalMarket = 0;
    let totalUnrealized = 0;

    const positions = Object.values(portfolioMap);
    const totalRealized = positions.reduce((acc, pos) => acc + pos.realizedPnL, 0);

    const holdingsArr = positions
      .filter(pos => pos.quantityHeld > 0)
      .map(pos => {
        const avgBuyPrice = pos.quantityHeld > 0 ? pos.totalBuyCost / pos.quantityHeld : 0;
        const live = livePrices.find(p => p.symbol === pos.ticker);
        const marketPrice = live?.price || avgBuyPrice;

        const notionalValue = pos.quantityHeld * avgBuyPrice;
        const marketValue = pos.quantityHeld * marketPrice;
        const unrealizedPnL = marketValue - notionalValue;

        totalNotional += notionalValue;
        totalMarket += marketValue;
        totalUnrealized += unrealizedPnL;

        return {
          ticker: pos.ticker,
          qty: pos.quantityHeld,
          notionalPrice: avgBuyPrice.toFixed(2),
          notionalValue,
          marketPrice: marketPrice.toFixed(2),
          marketValue,
          unrealizedPnL,
          realizedPnL: pos.realizedPnL,
        };
      });

    setHoldings(holdingsArr);
    setSummary({
      totalNotional,
      totalMarket,
      totalUnrealized,
      totalRealized,
    });

    // Mark holdings as ready after calculation
    setHoldingsReady(true);
  }, [trades, livePrices]);

  // Fetch AI strategy after holdings are ready
  useEffect(() => {
    const fetchAI = async () => {
      try {
        const aiPrompt = `
Below is my portfolio. You are expected to provide a rebalance strategy in two parts. 
1. Strategy Headline max 20 words. Include the ticker name in the headline.
2. Details of the strategy execution 
3. Ticker wise buy / sell quantity. 
You must provide the response in a well formed json. 
Below is an example of json structure.

{
    "headline": <headline>,
    "strategy_description": <description in max 300 words>,
    "ticker_actions": [
        {
            "ticker": <ticker>,
            "action": <buy/sell>,
            "qty": <qty>
        }
    ]
} 

Only provide well formed JSON object as response output.

Portfolio Data:
${JSON.stringify(holdings, null, 2)}
`;

        const res = await fetch("http://localhost:5000/api/bedrock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt })
        });

        const data = await res.json();
        console.log("AI full response:", data);

        if (data && data.headline) setAiHeadline(data.headline);
        if (data.strategy_description) setAiDescription(data.strategy_description);

        setAiPromptSent(true);
      } catch (err) {
        console.error("Error in AI fetch:", err);
      }
    };

    if (!aiPromptSent && holdingsReady && holdings.length > 0) {
      fetchAI();
    }
  }, [holdingsReady, holdings, aiPromptSent]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {aiHeadline && (
        <div className="bg-gray-800 p-5 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-bold text-blue-400">AI Suggested Rebalance</h3>
          <p className="text-white text-xl mt-2">{aiHeadline}</p>
          <button
            onClick={() => setShowStrategyDesc(prev => !prev)}
            className="mt-4 text-sm text-blue-400 hover:underline focus:outline-none"
          >
            {showStrategyDesc ? "Hide Details ▲" : "Show Details ▼"}
          </button>
          {showStrategyDesc && aiDescription && (
            <div className="mt-3 p-3 bg-gray-700 rounded-lg text-gray-300 text-sm whitespace-pre-wrap">
              {aiDescription}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-5 rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-bold text-white">Portfolio Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-8 rounded-xl">
              <p className="text-gray-400 text-lg">Notional Value</p>
              <p className="text-white font-semibold text-xl">₹{summary.totalNotional.toFixed(2)}</p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl">
              <p className="text-gray-400 text-lg">Market Value</p>
              <p className="text-white font-semibold text-xl">₹{summary.totalMarket.toFixed(2)}</p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl">
              <p className="text-gray-400 text-lg">Unrealized P/L</p>
              <p className={`font-semibold text-xl ${summary.totalUnrealized >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{summary.totalUnrealized.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl">
              <p className="text-gray-400 text-lg">Realized P/L</p>
              <p className={`font-semibold text-xl ${summary.totalRealized >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{summary.totalRealized.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-white mb-4">Stock Composition</h3>
          {holdings.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={holdings}
                  dataKey="notionalValue"
                  nameKey="ticker"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                >
                  {holdings.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${parseFloat(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No data to display.</p>
          )}
        </div>
      </div>

      {/* Holdings Table */}
      <h2 className="text-2xl font-semibold mb-6 text-blue-400">Current Holdings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-sm">
              <th className="px-4 py-2 text-left">Ticker</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Notional Price</th>
              <th className="px-4 py-2 text-left">Notional Value</th>
              <th className="px-4 py-2 text-left">Market Price</th>
              <th className="px-4 py-2 text-left">Market Value</th>
              <th className="px-4 py-2 text-left">Unrealized P/L</th>
              <th className="px-4 py-2 text-left">Realized P/L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 text-sm">
                <td className="px-4 py-2">{item.ticker}</td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">₹{item.notionalPrice}</td>
                <td className="px-4 py-2">₹{item.notionalValue.toFixed(2)}</td>
                <td className="px-4 py-2">₹{item.marketPrice}</td>
                <td className="px-4 py-2">₹{item.marketValue.toFixed(2)}</td>
                <td className={`px-4 py-2 font-semibold ${item.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{item.unrealizedPnL.toFixed(2)}
                </td>
                <td className={`px-4 py-2 font-semibold ${item.realizedPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  ₹{item.realizedPnL.toFixed(2)}
                </td>
              </tr>
            ))}
            {holdings.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-4">
                  No current holdings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <WebSocketClient onMessage={handleNewMessage} />
    </div>
  );
};

export default Portfolio;

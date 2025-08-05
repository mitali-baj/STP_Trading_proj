// // File: STP_TRADING_PROJ/src/pages/ReportsCharts.js

// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
// import { Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

// const ReportsCharts = () => {
//   const [dateRange, setDateRange] = useState('30');
//   const [loading, setLoading] = useState(false);
//   const [tradeSummary, setTradeSummary] = useState(null);
//   const [volumeData, setVolumeData] = useState([]);
//   const [tradeTypeData, setTradeTypeData] = useState([]);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [performanceData, setPerformanceData] = useState([]);

//   // API Base URL - adjust according to your backend
//   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

//   useEffect(() => {
//     fetchReportsData();
//   }, [dateRange]);

//   const fetchReportsData = async () => {
//     setLoading(true);
//     try {
//       // Fetch all reports data
//       const [summaryRes, volumeRes, typeRes, historyRes, performanceRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/reports/trade-summary?days=${dateRange}`),
//         fetch(`${API_BASE_URL}/reports/volume-by-instrument?days=${dateRange}`),
//         fetch(`${API_BASE_URL}/reports/trade-type-breakdown?days=${dateRange}`),
//         fetch(`${API_BASE_URL}/reports/trade-history?days=${dateRange}`),
//         fetch(`${API_BASE_URL}/reports/performance?days=${dateRange}`)
//       ]);

//       const summaryData = await summaryRes.json();
//       const volumeDataRes = await volumeRes.json();
//       const typeDataRes = await typeRes.json();
//       const historyDataRes = await historyRes.json();
//       const performanceDataRes = await performanceRes.json();

//       setTradeSummary(summaryData);
//       setVolumeData(volumeDataRes);
//       setTradeTypeData(typeDataRes);
//       setTradeHistory(historyDataRes);
//       setPerformanceData(performanceDataRes);
//     } catch (error) {
//       console.error('Error fetching reports data:', error);
//       // You could add error handling UI here
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToCSV = async (reportType) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/reports/export/${reportType}?days=${dateRange}&format=csv`);
//       const blob = await response.blob();
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${reportType}-report.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error exporting report:', error);
//     }
//   };

//   const exportToExcel = async (reportType) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/reports/export/${reportType}?days=${dateRange}&format=excel`);
//       const blob = await response.blob();
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${reportType}-report.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error exporting report:', error);
//     }
//   };

//   const StatCard = ({ title, value, icon, trend, trendValue }) => (
//     <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-400 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//           {trend && (
//             <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
//               {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//               <span className="ml-1 text-sm">{trendValue}</span>
//             </div>
//           )}
//         </div>
//         <div className="text-blue-400">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading reports...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Reports & Charts</h1>
//             <p className="text-gray-400 mt-2">Comprehensive trading analytics and performance insights</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <select 
//               value={dateRange} 
//               onChange={(e) => setDateRange(e.target.value)}
//               className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
//             >
//               <option value="7">Last 7 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 90 days</option>
//               <option value="365">Last Year</option>
//             </select>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => exportToCSV('summary')}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>CSV</span>
//               </button>
//               <button
//                 onClick={() => exportToExcel('summary')}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>Excel</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Trade Summary Stats */}
//         {tradeSummary && (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
//               <Activity className="mr-2" size={20} />
//               Trade Summary Stats
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatCard 
//                 title="Total Trades Executed" 
//                 value={tradeSummary.totalTrades} 
//                 icon={<FileText size={24} />}
//                 trend="up"
//                 trendValue={`+${tradeSummary.tradesGrowth}% from last period`}
//               />
//               <StatCard 
//                 title="Win Rate" 
//                 value={`${tradeSummary.winRate}%`} 
//                 icon={<TrendingUp size={24} />}
//                 trend={tradeSummary.winRateChange > 0 ? "up" : "down"}
//                 trendValue={`${tradeSummary.winRateChange > 0 ? '+' : ''}${tradeSummary.winRateChange}% from last period`}
//               />
//               <StatCard 
//                 title="Total Profit" 
//                 value={`₹${tradeSummary.totalProfit?.toLocaleString()}`} 
//                 icon={<DollarSign size={24} />}
//                 trend={tradeSummary.profitChange > 0 ? "up" : "down"}
//                 trendValue={`${tradeSummary.profitChange > 0 ? '+' : ''}${tradeSummary.profitChange}% from last period`}
//               />
//               <StatCard 
//                 title="Avg Holding Period" 
//                 value={`${tradeSummary.avgHoldingPeriod} days`} 
//                 icon={<Calendar size={24} />}
//               />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Most Traded Stock</p>
//                 <p className="text-xl font-bold text-blue-400">{tradeSummary.mostTradedStock}</p>
//               </div>
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Most Profitable Trade</p>
//                 <p className="text-xl font-bold text-green-400">
//                   {tradeSummary.mostProfitableTrade?.symbol} +₹{tradeSummary.mostProfitableTrade?.profit?.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Largest Loss</p>
//                 <p className="text-xl font-bold text-red-400">
//                   {tradeSummary.largestLoss?.symbol} ₹{tradeSummary.largestLoss?.loss?.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Trade Volume by Instrument */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Trade Volume by Instrument</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={volumeData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="symbol" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
//                   labelStyle={{ color: '#F3F4F6' }}
//                 />
//                 <Legend />
//                 <Bar dataKey="trades" fill="#3B82F6" name="Number of Trades" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Trade Type Breakdown */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Trade Type Breakdown</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tradeTypeData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
//                 >
//                   {tradeTypeData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Performance Over Time */}
//         {performanceData.length > 0 && (
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
//             <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
//                   labelStyle={{ color: '#F3F4F6' }}
//                 />
//                 <Legend />
//                 <Line type="monotone" dataKey="cumulative" stroke="#10B981" strokeWidth={3} name="Cumulative Profit (₹)" />
//                 <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Period Profit (₹)" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Trade History Table */}
//         <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-white">Full Trade History</h3>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => exportToCSV('history')}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>CSV</span>
//               </button>
//               <button
//                 onClick={() => exportToExcel('history')}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>Excel</span>
//               </button>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-700">
//                   <th className="text-left py-3 px-4 text-gray-300">Trade ID</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Date</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Symbol</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Type</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Quantity</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Price</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Total</th>
//                   <th className="text-center py-3 px-4 text-gray-300">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tradeHistory.map((trade) => (
//                   <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="py-3 px-4 text-blue-400 font-mono">{trade.id}</td>
//                     <td className="py-3 px-4 text-gray-300">{new Date(trade.date).toLocaleDateString()}</td>
//                     <td className="py-3 px-4 text-white font-semibold">{trade.symbol}</td>
//                     <td className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         trade.type === 'BUY' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
//                       }`}>
//                         {trade.type}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-right text-gray-300">{trade.quantity}</td>
//                     <td className="py-3 px-4 text-right text-gray-300">₹{trade.price}</td>
//                     <td className="py-3 px-4 text-right text-white font-semibold">₹{trade.total?.toLocaleString()}</td>
//                     <td className="py-3 px-4 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         trade.status === 'EXECUTED' ? 'bg-green-900 text-green-400' : 
//                         trade.status === 'PENDING' ? 'bg-yellow-900 text-yellow-400' : 
//                         'bg-red-900 text-red-400'
//                       }`}>
//                         {trade.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsCharts;

// File: STP_TRADING_PROJ/src/pages/ReportsCharts.js

//***OLD WORKING CODE***/

// // File: STP_TRADING_PROJ/src/pages/ReportsCharts.js

// import React, { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
// } from 'recharts';
// import { Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

// // ====== Helper Functions ======

// // Process trades to group by tradeId and get final status
// function processTradeData(rawTrades) {
//   // Group by tradeId
//   const grouped = rawTrades.reduce((acc, trade) => {
//     if (!acc[trade.tradeId]) {
//       acc[trade.tradeId] = [];
//     }
//     acc[trade.tradeId].push(trade);
//     return acc;
//   }, {});

//   // For each tradeId, create a consolidated trade record
//   const processedTrades = Object.entries(grouped).map(([tradeId, tradeStages]) => {
//     // Sort stages by createdAt to get chronological order
//     tradeStages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    
//     // Get the latest stage (settlement stage)
//     const latestStage = tradeStages[tradeStages.length - 1];
    
//     // Find settlement stage - check multiple possible field names and values
//     const settlementStage = tradeStages.find(stage => 
//       stage.settlementStatus === 'Success' || 
//       stage.settlementStatus === 'Failed' ||
//       stage.settlementStatus === 'SUCCESS' ||
//       stage.settlementStatus === 'FAILED' ||
//       stage.status === 'SETTLED' || 
//       stage.status === 'SUCCESS' ||
//       stage.status === 'FAILED' ||
//       (stage.stage && stage.stage.toLowerCase().includes('settlement')) ||
//       (stage.step && stage.step.toLowerCase().includes('settlement'))
//     ) || latestStage;
    
//     // Determine final status with multiple fallback options
//     let finalStatus = 'Unknown';
    
//     if (settlementStage.settlementStatus) {
//       finalStatus = settlementStage.settlementStatus;
//     } else if (settlementStage.status === 'SETTLED' || settlementStage.status === 'SUCCESS') {
//       finalStatus = 'Success';
//     } else if (settlementStage.status === 'FAILED') {
//       finalStatus = 'Failed';
//     } else if (latestStage.status) {
//       finalStatus = latestStage.status;
//     }
    
//     // Portfolio-style calculations for total and profit
//     const quantity = parseFloat(latestStage.quantity) || 0;
//     const price = parseFloat(latestStage.price) || 0;
    
//     // Calculate total value (quantity * price)
//     const calculatedTotal = quantity * price;
    
//     // For profit calculation, we need buy and sell prices
//     // If this is a complete trade cycle, calculate P&L
//     let calculatedProfit = 0;
    
//     // Find buy and sell stages
//     const buyStages = tradeStages.filter(s => (s.buySell || s.type) === 'BUY');
//     const sellStages = tradeStages.filter(s => (s.buySell || s.type) === 'SELL');
    
//     if (buyStages.length > 0 && sellStages.length > 0) {
//       // Calculate P&L: (Sell Price - Buy Price) * Quantity
//       const buyPrice = parseFloat(buyStages[0].price) || 0;
//       const sellPrice = parseFloat(sellStages[0].price) || 0;
//       const tradeQuantity = parseFloat(buyStages[0].quantity) || quantity;
      
//       if (latestStage.buySell === 'SELL' || latestStage.type === 'SELL') {
//         calculatedProfit = (sellPrice - buyPrice) * tradeQuantity;
//       }
//     }
    
//     // Use existing values if available, otherwise use calculated values
//     const finalTotal = latestStage.total !== undefined && latestStage.total !== null
//       ? parseFloat(latestStage.total)
//       : calculatedTotal;
      
//     const finalProfit = latestStage.profit !== undefined && latestStage.profit !== null
//       ? parseFloat(latestStage.profit)
//       : calculatedProfit;

//     // Use data from the most complete stage (usually the latest one)
//     const consolidatedTrade = {
//       tradeId: tradeId,
//       createdAt: tradeStages[0].createdAt, // Use first stage creation time
//       ticker: latestStage.ticker || latestStage.symbol,
//       symbol: latestStage.ticker || latestStage.symbol,
//       buySell: latestStage.buySell || latestStage.type,
//       type: latestStage.buySell || latestStage.type,
//       quantity: quantity,
//       price: price,
//       total: finalTotal,
//       profit: finalProfit,
//       holdingPeriodDays: latestStage.holdingPeriodDays,
//       // Use the determined final status
//       status: finalStatus,
//       settlementStatus: settlementStage?.settlementStatus,
//       // Keep all stages for reference
//       allStages: tradeStages,
//       // Debug info
//       _debug: {
//         stagesCount: tradeStages.length,
//         latestStageStatus: latestStage.status,
//         settlementStageFound: !!settlementStage,
//         allStatuses: tradeStages.map(s => s.status)
//       }
//     };
    
//     return consolidatedTrade;
//   });

//   return processedTrades;
// }

// function calcTradeSummary(trades) {
//   if (!trades || trades.length === 0) return null;
//   const totalTrades = trades.length;

//   // Win rate (trades with profit > 0)
//   const wins = trades.filter(t => (t.profit ?? 0) > 0).length;
//   const winRate = totalTrades === 0 ? 0 : Math.round((wins / totalTrades) * 100);

//   // Total profit
//   const totalProfit = trades.reduce((acc, t) => acc + (t.profit ?? 0), 0);

//   // Avg. holding period (field: holdingPeriodDays; fallback to 0)
//   const avgHoldingPeriod = Math.round(
//     trades.reduce((acc, t) => acc + (t.holdingPeriodDays ?? 0), 0) / totalTrades
//   ) || 0;

//   // Most traded stock (by frequency)
//   const countBySymbol = {};
//   for (const t of trades) {
//     const symbol = t.ticker || t.symbol || 'Unknown';
//     countBySymbol[symbol] = (countBySymbol[symbol] || 0) + 1;
//   }
//   const mostTradedStock =
//     Object.entries(countBySymbol).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

//   // Most profitable trade
//   const mostProfitableTrade = trades.reduce(
//     (max, t) => (t.profit ?? 0) > (max.profit ?? 0) ? t : max, trades[0]
//   );
//   // Largest loss (most negative profit)
//   const largestLoss = trades.reduce(
//     (min, t) => (t.profit ?? 0) < (min.profit ?? 0) ? t : min, trades[0]
//   );

//   // Grow & change stats are set to 0 (fill these with proper logic if you want period-over-period comparison)
//   return {
//     totalTrades,
//     tradesGrowth: 0,
//     winRate,
//     winRateChange: 0,
//     totalProfit,
//     profitChange: 0,
//     avgHoldingPeriod,
//     mostTradedStock,
//     mostProfitableTrade: { 
//       symbol: mostProfitableTrade?.ticker || mostProfitableTrade?.symbol || '-', 
//       profit: mostProfitableTrade?.profit || 0 
//     },
//     largestLoss: { 
//       symbol: largestLoss?.ticker || largestLoss?.symbol || '-', 
//       loss: Math.abs(largestLoss?.profit || 0) 
//     }
//   };
// }

// // Bar chart: Trade volume by instrument (count per symbol)
// function calcVolumeData(trades) {
//   const map = {};
//   trades.forEach(t => { 
//     const symbol = t.ticker || t.symbol || 'Unknown';
//     map[symbol] = (map[symbol] || 0) + 1; 
//   });
//   return Object.entries(map).map(([symbol, trades]) => ({ symbol, trades }));
// }

// // Pie chart: Trade type breakdown (e.g., BUY/SELL)
// function calcTradeTypeData(trades) {
//   const map = {};
//   trades.forEach(t => { 
//     const type = t.buySell || t.type || 'Unknown';
//     map[type] = (map[type] || 0) + 1; 
//   });
//   const colors = { BUY: '#10B981', SELL: '#EF4444', Unknown: '#6B7280' };
//   return Object.entries(map).map(([name, value]) => ({
//     name,
//     value,
//     color: colors[name] || '#6366F1'
//   }));
// }

// // Line chart: Profit over time
// function calcPerformanceData(trades) {
//   // By date (YYYY-MM-DD) using createdAt
//   const byDate = {};
//   trades.forEach(t => {
//     const date = new Date(t.createdAt).toISOString().split('T')[0];
//     if (!byDate[date]) byDate[date] = { profit: 0, count: 0 };
//     byDate[date].profit += t.profit ?? 0;
//     byDate[date].count += 1;
//   });
//   let cumulative = 0;
//   return Object.entries(byDate)
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([date, vals]) => {
//       cumulative += vals.profit;
//       return { date, profit: vals.profit, cumulative };
//     });
// }

// // ====== Main Component ======

// const ReportsCharts = () => {
//   const [dateRange, setDateRange] = useState('30');
//   const [loading, setLoading] = useState(false);
//   const [tradeSummary, setTradeSummary] = useState(null);
//   const [volumeData, setVolumeData] = useState([]);
//   const [tradeTypeData, setTradeTypeData] = useState([]);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [performanceData, setPerformanceData] = useState([]);

//   // Fetch & filter trades
//   useEffect(() => {
//     fetchReportsData();
//   }, [dateRange]);

//   const fetchReportsData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8080/trades?clientId=client_Mitali');
//       let rawTrades = await res.json();

//       // Process raw trades to consolidate by tradeId
//       let trades = processTradeData(rawTrades);

//       // Sort by createdAt descending (most recent first)
//       trades.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

//       // Optional: apply date filter here if your endpoint does NOT filter by date
//       if (dateRange !== 'all') {
//         const days = parseInt(dateRange, 10);
//         const now = Date.now();
//         trades = trades.filter(t => {
//           const tradeDate = new Date(t.createdAt).getTime();
//           return tradeDate >= now - days * 24 * 60 * 60 * 1000;
//         });
//       }

//       setTradeSummary(calcTradeSummary(trades));
//       setVolumeData(calcVolumeData(trades));
//       setTradeTypeData(calcTradeTypeData(trades));
//       setTradeHistory(trades);
//       setPerformanceData(calcPerformanceData(trades));
      
//       // Debug: Log the first few processed trades to see their structure
//       console.log('Processed trades sample:', trades.slice(0, 3));
//       console.log('Raw trades sample:', rawTrades.slice(0, 3));
//     } catch (err) {
//       console.error('Error fetching trades:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // CSV/Excel export (exports current tradeHistory)
//   const exportToCSV = () => {
//     const csv = [
//       ['Trade ID', 'Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Total', 'Profit', 'Settlement Status'],
//       ...tradeHistory.map(t => [
//         t.tradeId || t.id, 
//         t.createdAt ? new Date(t.createdAt).toLocaleString() : t.date, 
//         t.ticker || t.symbol, 
//         t.buySell || t.type, 
//         t.quantity, 
//         t.price, 
//         t.total, 
//         t.profit, 
//         t.status
//       ]),
//     ].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'trades-report.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   const exportToExcel = () => {
//     // Use CSV, but with .xls extension for Excel to open it. (For true Excel: use a library.)
//     const csv = [
//       ['Trade ID', 'Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Total', 'Profit', 'Settlement Status'],
//       ...tradeHistory.map(t => [
//         t.tradeId || t.id, 
//         t.createdAt ? new Date(t.createdAt).toLocaleString() : t.date, 
//         t.ticker || t.symbol, 
//         t.buySell || t.type, 
//         t.quantity, 
//         t.price, 
//         t.total, 
//         t.profit, 
//         t.status
//       ]),
//     ].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'trades-report.xls';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   const StatCard = ({ title, value, icon, trend, trendValue }) => (
//     <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-400 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//           {trend && (
//             <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
//               {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//               <span className="ml-1 text-sm">{trendValue}</span>
//             </div>
//           )}
//         </div>
//         <div className="text-blue-400">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading reports...</div>
//       </div>
//     );
//   }

//   console.log('tradeHistory', tradeHistory);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Reports & Charts</h1>
//             <p className="text-gray-400 mt-2">Comprehensive trading analytics and performance insights</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <select
//               value={dateRange}
//               onChange={e => setDateRange(e.target.value)}
//               className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
//             >
//               <option value="7">Last 7 days</option>
//               <option value="30">Last 30 days</option>
//               <option value="90">Last 90 days</option>
//               <option value="365">Last Year</option>
//               <option value="all">All Time</option>
//             </select>
//             <div className="flex space-x-2">
//               <button
//                 onClick={exportToCSV}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>CSV</span>
//               </button>
//               <button
//                 onClick={exportToExcel}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>Excel</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Trade Summary Stats */}
//         {tradeSummary && (
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
//               <Activity className="mr-2" size={20} />
//               Trade Summary Stats
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatCard
//                 title="Total Trades Executed"
//                 value={tradeSummary.totalTrades}
//                 icon={<FileText size={24} />}
//                 trend="up"
//                 trendValue={`+${tradeSummary.tradesGrowth}% from last period`}
//               />
//               {/* <StatCard
//                 title="Win Rate"
//                 value={`${tradeSummary.winRate}%`}
//                 icon={<TrendingUp size={24} />}
//                 trend={tradeSummary.winRateChange > 0 ? "up" : "down"}
//                 trendValue={`${tradeSummary.winRateChange > 0 ? '+' : ''}${tradeSummary.winRateChange}% from last period`}
//               /> */}
//               <StatCard
//                 title="Total Profit"
//                 value={`₹${tradeSummary.totalProfit?.toLocaleString()}`}
//                 icon={<DollarSign size={24} />}
//                 trend={tradeSummary.profitChange > 0 ? "up" : "down"}
//                 trendValue={`${tradeSummary.profitChange > 0 ? '+' : ''}${tradeSummary.profitChange}% from last period`}
//               />
//               {/* <StatCard
//                 title="Avg Holding Period"
//                 value={`${tradeSummary.avgHoldingPeriod} days`}
//                 icon={<Calendar size={24} />}
//               /> */}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Most Traded Stock</p>
//                 <p className="text-xl font-bold text-blue-400">{tradeSummary.mostTradedStock}</p>
//               </div>
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Most Profitable Trade</p>
//                 <p className="text-xl font-bold text-green-400">
//                   {tradeSummary.mostProfitableTrade?.symbol} +₹{tradeSummary.mostProfitableTrade?.profit?.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//                 <p className="text-gray-400 text-sm">Largest Loss</p>
//                 <p className="text-xl font-bold text-red-400">
//                   {tradeSummary.largestLoss?.symbol} ₹{tradeSummary.largestLoss?.loss?.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Trade Volume by Instrument */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Trade Volume by Instrument</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={volumeData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="symbol" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1F2937',
//                     border: '1px solid #374151',
//                     borderRadius: '8px'
//                   }}
//                   labelStyle={{ color: '#F3F4F6' }}
//                 />
//                 <Legend />
//                 <Bar dataKey="trades" fill="#3B82F6" name="Number of Trades" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Trade Type Breakdown */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-lg font-semibold text-white mb-4">Trade Type Breakdown</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tradeTypeData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, value, percent }) =>
//                     `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
//                   }
//                 >
//                   {tradeTypeData.map((entry, index) => (
//                     <Cell key={index} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1F2937',
//                     border: '1px solid #374151',
//                     borderRadius: '8px'
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Performance Over Time */}
//         {performanceData.length > 0 && (
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
//             <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1F2937',
//                     border: '1px solid #374151',
//                     borderRadius: '8px'
//                   }}
//                   labelStyle={{ color: '#F3F4F6' }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="cumulative"
//                   stroke="#10B981"
//                   strokeWidth={3}
//                   name="Cumulative Profit (₹)"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="profit"
//                   stroke="#3B82F6"
//                   strokeWidth={2}
//                   name="Period Profit (₹)"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Full Trade History Table (fields mapped to LifeCycle data) */}
//         <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-white">Full Trade History</h3>
//             <div className="flex space-x-2">
//               <button
//                 onClick={exportToCSV}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>CSV</span>
//               </button>
//               <button
//                 onClick={exportToExcel}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Download size={16} />
//                 <span>Excel</span>
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-700">
//                   <th className="text-left py-3 px-4 text-gray-300">Trade ID</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Date</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Symbol</th>
//                   <th className="text-left py-3 px-4 text-gray-300">Type</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Quantity</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Price</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Total</th>
//                   <th className="text-right py-3 px-4 text-gray-300">Profit</th>
//                   <th className="text-center py-3 px-4 text-gray-300">Settlement Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tradeHistory.map((trade) => (
//                   <tr key={trade.tradeId || Math.random()} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="py-3 px-4 text-blue-400 font-mono">{trade.tradeId}</td>
//                     <td className="py-3 px-4 text-gray-300">
//                       {trade.createdAt ? new Date(trade.createdAt).toLocaleString() : "-"}
//                     </td>
//                     <td className="py-3 px-4 text-white font-semibold">
//                       {trade.ticker || trade.symbol || "-"}
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         (trade.buySell || trade.type) === 'BUY' ? 'bg-green-900 text-green-400'
//                         : (trade.buySell || trade.type) === 'SELL' ? 'bg-red-900 text-red-400'
//                         : 'bg-gray-600'
//                       }`}>
//                         {trade.buySell || trade.type || "-"}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-right text-gray-300">{trade.quantity || "-"}</td>
//                     <td className="py-3 px-4 text-right text-gray-300">
//                       {trade.price !== undefined ? `₹${trade.price}` : "-"}
//                     </td>
//                     <td className="py-3 px-4 text-right text-white font-semibold">
//                       {trade.total !== undefined ? `₹${trade.total}` : "-"}
//                     </td>
//                     <td className="py-3 px-4 text-right text-gray-300">
//                       {trade.profit !== undefined ? `₹${trade.profit}` : "-"}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         trade.status === "SETTLED" ? "bg-green-900 text-green-400"
//                         : trade.status === "FAILED" ? "bg-red-900 text-red-400"
//                         : trade.status === "UNKNOWN" ? "bg-grey-900 text-green-400"
//                         : "bg-gray-600 text-gray-300"
//                       }`}>
//                         {/* kkkkk */}
//                         {trade.status || "-"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {tradeHistory.length === 0 && (
//                   <tr>
//                     <td colSpan={9} className="text-center text-gray-500 p-6">
//                       No trades found for this period.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ReportsCharts;

// File: STP_TRADING_PROJ/src/pages/ReportsCharts.js

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

// ====== Helper Functions ======

// Process trades to group by tradeId and get final status
function processTradeData(rawTrades) {
  // Group by tradeId
  const grouped = rawTrades.reduce((acc, trade) => {
    if (!acc[trade.tradeId]) {
      acc[trade.tradeId] = [];
    }
    acc[trade.tradeId].push(trade);
    return acc;
  }, {});

  // For each tradeId, create a consolidated trade record
  const processedTrades = Object.entries(grouped).map(([tradeId, tradeStages]) => {
    // Sort stages by createdAt to get chronological order
    tradeStages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    
    // Get the latest stage (settlement stage)
    const latestStage = tradeStages[tradeStages.length - 1];
    
    // Find settlement stage - check multiple possible field names and values
    const settlementStage = tradeStages.find(stage => 
      stage.settlementStatus === 'Success' || 
      stage.settlementStatus === 'Failed' ||
      stage.settlementStatus === 'SUCCESS' ||
      stage.settlementStatus === 'FAILED' ||
      stage.status === 'SETTLED' || 
      stage.status === 'SUCCESS' ||
      stage.status === 'FAILED' ||
      (stage.stage && stage.stage.toLowerCase().includes('settlement')) ||
      (stage.step && stage.step.toLowerCase().includes('settlement'))
    ) || latestStage;
    
    // Determine final status with multiple fallback options
    let finalStatus = 'Unknown';
    
    if (settlementStage.settlementStatus) {
      finalStatus = settlementStage.settlementStatus;
    } else if (settlementStage.status === 'SETTLED' || settlementStage.status === 'SUCCESS') {
      finalStatus = 'Success';
    } else if (settlementStage.status === 'FAILED') {
      finalStatus = 'Failed';
    } else if (latestStage.status) {
      finalStatus = latestStage.status;
    }
    
    // Portfolio-style calculations for total and profit
    const quantity = parseFloat(latestStage.quantity) || 0;
    const price = parseFloat(latestStage.price) || 0;
    
    // Calculate total value (quantity * price)
    const calculatedTotal = quantity * price;
    
    // For profit calculation, we need buy and sell prices
    // If this is a complete trade cycle, calculate P&L
    let calculatedProfit = 0;
    
    // Find buy and sell stages
    const buyStages = tradeStages.filter(s => (s.buySell || s.type) === 'BUY');
    const sellStages = tradeStages.filter(s => (s.buySell || s.type) === 'SELL');
    
    if (buyStages.length > 0 && sellStages.length > 0) {
      // Calculate P&L: (Sell Price - Buy Price) * Quantity
      const buyPrice = parseFloat(buyStages[0].price) || 0;
      const sellPrice = parseFloat(sellStages[0].price) || 0;
      const tradeQuantity = parseFloat(buyStages[0].quantity) || quantity;
      
      if (latestStage.buySell === 'SELL' || latestStage.type === 'SELL') {
        calculatedProfit = (sellPrice - buyPrice) * tradeQuantity;
      }
    }
    
    // Use existing values if available, otherwise use calculated values
    const finalTotal = latestStage.total !== undefined && latestStage.total !== null
      ? parseFloat(latestStage.total)
      : calculatedTotal;
      
    const finalProfit = latestStage.profit !== undefined && latestStage.profit !== null
      ? parseFloat(latestStage.profit)
      : calculatedProfit;

    // Use data from the most complete stage (usually the latest one)
    const consolidatedTrade = {
      tradeId: tradeId,
      createdAt: tradeStages[0].createdAt, // Use first stage creation time
      ticker: latestStage.ticker || latestStage.symbol,
      symbol: latestStage.ticker || latestStage.symbol,
      buySell: latestStage.buySell || latestStage.type,
      type: latestStage.buySell || latestStage.type,
      quantity: quantity,
      price: price,
      total: finalTotal,
      profit: finalProfit,
      holdingPeriodDays: latestStage.holdingPeriodDays,
      // Use the determined final status
      status: finalStatus,
      settlementStatus: settlementStage?.settlementStatus,
      // Keep all stages for reference
      allStages: tradeStages,
      // Debug info
      _debug: {
        stagesCount: tradeStages.length,
        latestStageStatus: latestStage.status,
        settlementStageFound: !!settlementStage,
        allStatuses: tradeStages.map(s => s.status)
      }
    };
    
    return consolidatedTrade;
  });

  return processedTrades;
}

function calcTradeSummary(trades) {
  if (!trades || trades.length === 0) return null;
  const totalTrades = trades.length;

  // Win rate (trades with profit > 0)
  const wins = trades.filter(t => (t.profit ?? 0) > 0).length;
  const winRate = totalTrades === 0 ? 0 : Math.round((wins / totalTrades) * 100);

  // Total profit
  const totalProfit = trades.reduce((acc, t) => acc + (t.profit ?? 0), 0);

  // Avg. holding period (field: holdingPeriodDays; fallback to 0)
  const avgHoldingPeriod = Math.round(
    trades.reduce((acc, t) => acc + (t.holdingPeriodDays ?? 0), 0) / totalTrades
  ) || 0;

  // Most traded stock (by frequency)
  const countBySymbol = {};
  for (const t of trades) {
    const symbol = t.ticker || t.symbol || 'Unknown';
    countBySymbol[symbol] = (countBySymbol[symbol] || 0) + 1;
  }
  const mostTradedStock =
    Object.entries(countBySymbol).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  // Most profitable trade
  const mostProfitableTrade = trades.reduce(
    (max, t) => (t.profit ?? 0) > (max.profit ?? 0) ? t : max, trades[0]
  );
  // Largest loss (most negative profit)
  const largestLoss = trades.reduce(
    (min, t) => (t.profit ?? 0) < (min.profit ?? 0) ? t : min, trades[0]
  );

  // Grow & change stats are set to 0 (fill these with proper logic if you want period-over-period comparison)
  return {
    totalTrades,
    tradesGrowth: 0,
    winRate,
    winRateChange: 0,
    totalProfit,
    profitChange: 0,
    avgHoldingPeriod,
    mostTradedStock,
    mostProfitableTrade: { 
      symbol: mostProfitableTrade?.ticker || mostProfitableTrade?.symbol || '-', 
      profit: mostProfitableTrade?.profit || 0 
    },
    largestLoss: { 
      symbol: largestLoss?.ticker || largestLoss?.symbol || '-', 
      loss: Math.abs(largestLoss?.profit || 0) 
    }
  };
}

// Bar chart: Trade volume by instrument (count per symbol)
function calcVolumeData(trades) {
  const map = {};
  trades.forEach(t => { 
    const symbol = t.ticker || t.symbol || 'Unknown';
    map[symbol] = (map[symbol] || 0) + 1; 
  });
  return Object.entries(map).map(([symbol, trades]) => ({ symbol, trades }));
}

// Pie chart: Trade type breakdown (e.g., BUY/SELL)
function calcTradeTypeData(trades) {
  const map = {};
  trades.forEach(t => { 
    const type = t.buySell || t.type || 'Unknown';
    map[type] = (map[type] || 0) + 1; 
  });
  const colors = { BUY: '#10B981', SELL: '#EF4444', Unknown: '#6B7280' };
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    color: colors[name] || '#6366F1'
  }));
}

// Line chart: Profit over time
function calcPerformanceData(trades) {
  // By date (YYYY-MM-DD) using createdAt
  const byDate = {};
  trades.forEach(t => {
    const date = new Date(t.createdAt).toISOString().split('T')[0];
    if (!byDate[date]) byDate[date] = { profit: 0, count: 0 };
    byDate[date].profit += t.profit ?? 0;
    byDate[date].count += 1;
  });
  let cumulative = 0;
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => {
      cumulative += vals.profit;
      return { date, profit: vals.profit, cumulative };
    });
}

// ====== Main Component ======

const ReportsCharts = () => {
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [tradeSummary, setTradeSummary] = useState(null);
  const [volumeData, setVolumeData] = useState([]);
  const [tradeTypeData, setTradeTypeData] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // Fetch & filter trades
  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/trades?clientId=client_Mitali');
      let rawTrades = await res.json();

      // Process raw trades to consolidate by tradeId
      let trades = processTradeData(rawTrades);

      // Sort by createdAt descending (most recent first)
      trades.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      // Optional: apply date filter here if your endpoint does NOT filter by date
      if (dateRange !== 'all') {
        const days = parseInt(dateRange, 10);
        const now = Date.now();
        trades = trades.filter(t => {
          const tradeDate = new Date(t.createdAt).getTime();
          return tradeDate >= now - days * 24 * 60 * 60 * 1000;
        });
      }

      setTradeSummary(calcTradeSummary(trades));
      setVolumeData(calcVolumeData(trades));
      setTradeTypeData(calcTradeTypeData(trades));
      setTradeHistory(trades);
      setPerformanceData(calcPerformanceData(trades));
      
      // Debug: Log the first few processed trades to see their structure
      console.log('Processed trades sample:', trades.slice(0, 3));
      console.log('Raw trades sample:', rawTrades.slice(0, 3));
    } catch (err) {
      console.error('Error fetching trades:', err);
    } finally {
      setLoading(false);
    }
  };

  // CSV/Excel export (exports current tradeHistory)
  // CSV/Excel export (exports current tradeHistory) - FIXED VERSION
const exportToCSV = () => {
  console.log('Export data sample:', tradeHistory.slice(0, 2)); // Debug log
  
  const headers = ['Trade ID', 'Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Total', 'Settlement Status'];
  
  const rows = tradeHistory.map(trade => {
    return [
      String(trade.tradeId || trade.id || ''),
      trade.createdAt ? new Date(trade.createdAt).toLocaleString() : '',
      String(trade.ticker || trade.symbol || ''),
      String(trade.buySell || trade.type || ''),
      String(trade.quantity !== undefined && trade.quantity !== null ? trade.quantity : ''),
      String(trade.price !== undefined && trade.price !== null ? trade.price : ''),
      String(trade.total !== undefined && trade.total !== null ? trade.total : ''),
      String(trade.status || trade.settlementStatus || '')
    ];
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  console.log('CSV content preview:', csvContent.substring(0, 500)); // Debug log
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'trades-report.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

  const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1 text-sm">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading reports...</div>
      </div>
    );
  }

  console.log('tradeHistory', tradeHistory);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports & Charts</h1>
            <p className="text-gray-400 mt-2">Comprehensive trading analytics and performance insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <div className="flex space-x-2">
            </div>
          </div>
        </div>

        {/* Trade Summary Stats */}
{tradeSummary && (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
      <Activity className="mr-2" size={20} />
      Trade Summary Stats
    </h2>
    
    {/* Single grid container for side-by-side layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Trades Executed */}
      <StatCard
        title="Total Trades Executed"
        value={tradeSummary.totalTrades}
        icon={<FileText size={24} />}
      />
      
      {/* Most Traded Stock */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-sm">Most Traded Stock</p>
        <p className="text-xl font-bold text-blue-400">{tradeSummary.mostTradedStock}</p>
      </div>
    </div>
    
    
  </div>
)}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trade Volume by Instrument */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Trade Volume by Instrument</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="symbol" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
                <Bar dataKey="trades" fill="#3B82F6" name="Number of Trades" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trade Type Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Trade Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tradeTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {tradeTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Trade History Table (fields mapped to LifeCycle data) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Full Trade History</h3>
            <div className="flex space-x-2">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download size={16} />
                <span>CSV</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Trade ID</th>
                  <th className="text-left py-3 px-4 text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300">Symbol</th>
                  <th className="text-left py-3 px-4 text-gray-300">Type</th>
                  <th className="text-right py-3 px-4 text-gray-300">Quantity</th>
                  <th className="text-right py-3 px-4 text-gray-300">Price</th>
                  <th className="text-right py-3 px-4 text-gray-300">Total</th>
                  <th className="text-center py-3 px-4 text-gray-300">Settlement Status</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.map((trade) => (
                  <tr key={trade.tradeId || Math.random()} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-blue-400 font-mono">{trade.tradeId}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {trade.createdAt ? new Date(trade.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {trade.ticker || trade.symbol || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        (trade.buySell || trade.type) === 'BUY' ? 'bg-green-900 text-green-400'
                        : (trade.buySell || trade.type) === 'SELL' ? 'bg-red-900 text-red-400'
                        : 'bg-gray-600'
                      }`}>
                        {trade.buySell || trade.type || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">{trade.quantity || "-"}</td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {trade.price !== undefined ? `₹${trade.price}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-semibold">
                      {trade.total !== undefined ? `₹${trade.total}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.status === "SETTLED" ? "bg-green-900 text-green-400"
                        : trade.status === "FAILED" ? "bg-red-900 text-red-400"
                        : trade.status === "UNKNOWN" ? "bg-grey-900 text-green-400"
                        : "bg-gray-600 text-gray-300"
                      }`}>
                        {/* kkkkk */}
                        {trade.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
                {tradeHistory.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 p-6">
                      No trades found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsCharts;

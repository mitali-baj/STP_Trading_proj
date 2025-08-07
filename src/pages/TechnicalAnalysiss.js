// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronDown, TrendingUp, Activity, BarChart3 } from 'lucide-react';

// const TechnicalAnalysis = () => {
//   const [selectedTicker, setSelectedTicker] = useState('AAPL');
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
//   const [isLive, setIsLive] = useState(true);
//   const [hoverInfo, setHoverInfo] = useState({ visible: false, data: null, x: 0, y: 0, type: '' });
  
//   const candlestickRef = useRef(null);
//   const rsiRef = useRef(null);
//   const macdRef = useRef(null);
//   const intervalRef = useRef(null);

//   // const tickers = [
//   //   { symbol: 'AAPL', name: 'Apple Inc.', file: 'simulated_AAPL_live.json' },
//   //   { symbol: 'GOOGL', name: 'Alphabet Inc.', file: 'simulated_GOOGL_live.json' },
//   //   { symbol: 'IBM', name: 'IBM Corporation', file: 'simulated_IBM_.json' },
//   //   { symbol: 'MSFT', name: 'Microsoft Corp.', file: 'simulated_MSFT_live.json' },
//   //   { symbol: 'TSLA', name: 'Tesla Inc.', file: 'simulated_TSLA_live.json' },
//   //   { symbol: 'UL', name: 'Unilever PLC', file: 'simulated_UL_live.json' },
//   //   { symbol: 'WMT', name: 'Walmart Inc.', file: 'simulated_WMT_live.json' }
//   // ];

//   const tickers = [
//     { symbol: 'AAPL', file: 'simulated_AAPL_live.json' },
//     { symbol: 'GOOGL', file: 'simulated_GOOGL_live.json' },
//     { symbol: 'IBM', file: 'simulated_IBM_.json' },
//     { symbol: 'MSFT', file: 'simulated_MSFT_live.json' },
//     { symbol: 'TSLA', file: 'simulated_TSLA_live.json' },
//     { symbol: 'UL', file: 'simulated_UL_live.json' },
//     { symbol: 'WMT', file: 'simulated_WMT_live.json' }
//   ];

//   // Market hours utility functions
//   const isMarketOpen = () => {
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const currentTime = hours * 60 + minutes;
    
//     // Market hours: 9:30 AM to 3:59 PM (EST)
//     const marketOpen = 9 * 60 + 30; // 9:30 AM
//     const marketClose = 15 * 60 + 59; // 3:59 PM
    
//     return currentTime >= marketOpen && currentTime <= marketClose;
//   };

//   const getMarketStatus = () => {
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const currentTime = hours * 60 + minutes;
    
//     const marketOpen = 9 * 60 + 30; // 9:30 AM
//     const marketClose = 15 * 60 + 59; // 3:59 PM
    
//     if (currentTime < marketOpen) {
//       return 'PRE_MARKET';
//     } else if (currentTime > marketClose) {
//       return 'AFTER_MARKET';
//     } else {
//       return 'OPEN';
//     }
//   };

//   // Load data from JSON files
//   const loadTickerData = async (ticker) => {
//     try {
//       const response = await fetch(`/data/${ticker.file}`);
//       const jsonData = await response.json();
      
//       // Transform JSON data to match our component structure
//       const transformedData = jsonData.map((item, index) => {
//         const open = parseFloat(item.open);
//         const close = parseFloat(item.close);
//         const change = close - open;
        
//         return {
//           date: new Date(item.timestamp).toISOString(),
//           time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
//           timestamp: item.timestamp,
//           open: parseFloat(item.open),
//           high: parseFloat(item.high),
//           low: parseFloat(item.low),
//           close: parseFloat(item.close),
//           volume: parseInt(item.volume),
//           change: parseFloat(change.toFixed(2)),
//           changePercent: parseFloat((change / open * 100).toFixed(2))
//         };
//       });
      
//       return transformedData;
//     } catch (error) {
//       console.error(`Error loading data for ${ticker.symbol}:`, error);
//       return [];
//     }
//   };

//   // Get current live data slice based on market hours
//   const getCurrentDataSlice = (fullData) => {
//     if (!fullData || fullData.length === 0) return [];
    
//     const marketStatus = getMarketStatus();
//     const now = new Date();
    
//     if (marketStatus === 'PRE_MARKET') {
//       // Show previous day's complete data
//       return fullData;
//     } else if (marketStatus === 'AFTER_MARKET') {
//       // Show complete current day data
//       return fullData;
//     } else {
//       // Market is open - show data up to current time
//       const currentHour = now.getHours();
//       const currentMinute = now.getMinutes();
      
//       return fullData.filter(item => {
//         const itemDate = new Date(item.timestamp);
//         const itemHour = itemDate.getHours();
//         const itemMinute = itemDate.getMinutes();
        
//         const itemTime = itemHour * 60 + itemMinute;
//         const currentTime = currentHour * 60 + currentMinute;
        
//         return itemTime <= currentTime;
//       });
//     }
//   };

//   // Update live data display based on current time
//   const updateLiveData = async () => {
//     if (!isLive) return;
    
//     setData(prevData => {
//       const newData = { ...prevData };
      
//       // Update displayed data slice based on current time
//       tickers.forEach(ticker => {
//         if (prevData[ticker.symbol] && prevData[`${ticker.symbol}_full`]) {
//           const fullData = prevData[`${ticker.symbol}_full`];
//           newData[ticker.symbol] = getCurrentDataSlice(fullData);
//         }
//       });
      
//       return newData;
//     });
    
//     setLastUpdate(new Date());
//   };

//   // Calculate RSI
//   const calculateRSI = (prices, period = 14) => {
//     const rsi = [];
//     const gains = [];
//     const losses = [];

//     for (let i = 1; i < prices.length; i++) {
//       const change = prices[i] - prices[i - 1];
//       gains.push(change > 0 ? change : 0);
//       losses.push(change < 0 ? Math.abs(change) : 0);
//     }

//     for (let i = period; i <= gains.length; i++) {
//       const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b) / period;
//       const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b) / period;
//       const rs = avgGain / avgLoss;
//       const rsiValue = 100 - (100 / (1 + rs));
//       rsi.push(rsiValue);
//     }

//     return rsi;
//   };

//   // Calculate MACD
//   const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
//     const ema = (data, period) => {
//       const k = 2 / (period + 1);
//       const ema = [data[0]];
//       for (let i = 1; i < data.length; i++) {
//         ema.push(data[i] * k + ema[i - 1] * (1 - k));
//       }
//       return ema;
//     };

//     const fastEMA = ema(prices, fastPeriod);
//     const slowEMA = ema(prices, slowPeriod);
//     const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
//     const signalLine = ema(macdLine, signalPeriod);
//     const histogram = macdLine.map((macd, i) => macd - (signalLine[i] || 0));

//     return { macdLine, signalLine, histogram };
//   };

//   // Load initial data and start live updates
//   useEffect(() => {
//     const loadData = async () => {
//       const tickerData = {};
      
//       // Load data for all tickers
//       for (const ticker of tickers) {
//         const fullTickerData = await loadTickerData(ticker);
        
//         // Store both full data and current display slice
//         tickerData[`${ticker.symbol}_full`] = fullTickerData;
//         tickerData[ticker.symbol] = getCurrentDataSlice(fullTickerData);
//       }
      
//       setData(tickerData);
//       setLoading(false);
//     };
    
//     loadData();
    
//     // Start live updates every 2 seconds during market hours
//     const marketStatus = getMarketStatus();
//     if (marketStatus === 'OPEN') {
//       intervalRef.current = setInterval(updateLiveData, 2000);
//     }
    
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   // Update live data when isLive changes
//   useEffect(() => {
//     const marketStatus = getMarketStatus();
    
//     if (isLive && !intervalRef.current && marketStatus === 'OPEN') {
//       intervalRef.current = setInterval(updateLiveData, 2000);
//     } else if (!isLive && intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     } else if (marketStatus !== 'OPEN' && intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
    
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isLive]);

//   // Mouse event handlers for charts
//   const handleMouseMove = (e, chartType) => {
//     const canvas = e.target;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
    
//     const tickerData = data[selectedTicker];
//     if (!tickerData || tickerData.length === 0) return;
    
//     const padding = 40;
//     const chartWidth = canvas.width - 2 * padding;
    
//     // Calculate which data point we're hovering over
//     const dataIndex = Math.floor(((mouseX - padding) / chartWidth) * tickerData.length);
    
//     if (dataIndex >= 0 && dataIndex < tickerData.length) {
//       const candleData = tickerData[dataIndex];
//       const closes = tickerData.map(d => d.close);
      
//       let hoverData = {
//         time: new Date(candleData.date).toLocaleString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: true
//         }),
//         ...candleData
//       };
      
//       if (chartType === 'rsi') {
//         const rsiData = calculateRSI(closes);
//         const rsiIndex = Math.max(0, dataIndex - (closes.length - rsiData.length));
//         if (rsiIndex < rsiData.length) {
//           hoverData.rsi = rsiData[rsiIndex]?.toFixed(2);
//         }
//       } else if (chartType === 'macd') {
//         const macdData = calculateMACD(closes);
//         const macdIndex = Math.max(0, dataIndex - (closes.length - macdData.macdLine.length));
//         if (macdIndex < macdData.macdLine.length) {
//           hoverData.macd = macdData.macdLine[macdIndex]?.toFixed(4);
//           hoverData.signal = macdData.signalLine[macdIndex]?.toFixed(4);
//           hoverData.histogram = macdData.histogram[macdIndex]?.toFixed(4);
//         }
//       }
      
//       setHoverInfo({
//         visible: true,
//         data: hoverData,
//         x: e.clientX + 10,
//         y: e.clientY - 10,
//         type: chartType
//       });
//     }
//   };

//   const handleMouseLeave = () => {
//     setHoverInfo({ visible: false, data: null, x: 0, y: 0, type: '' });
//   };

//   // Custom chart drawing functions
//   const drawCandlestickChart = (canvas, data) => {
//     const ctx = canvas.getContext('2d');
//     const rect = canvas.getBoundingClientRect();
//     canvas.width = rect.width;
//     canvas.height = rect.height;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     if (!data || data.length === 0) return;

//     const padding = 40;
//     const chartWidth = canvas.width - 2 * padding;
//     const chartHeight = canvas.height - 2 * padding;
    
//     const prices = data.map(d => [d.high, d.low, d.open, d.close]).flat();
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);
//     const priceRange = maxPrice - minPrice;
    
//     const candleWidth = chartWidth / data.length * 0.8;
    
//     // Draw grid
//     ctx.strokeStyle = '#374151';
//     ctx.lineWidth = 1;
//     for (let i = 0; i <= 5; i++) {
//       const y = padding + (chartHeight / 5) * i;
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.stroke();
//     }
    
//     // Draw price labels
//     ctx.fillStyle = '#9CA3AF';
//     ctx.font = '12px sans-serif';
//     ctx.textAlign = 'right';
//     for (let i = 0; i <= 5; i++) {
//       const price = maxPrice - (priceRange / 5) * i;
//       const y = padding + (chartHeight / 5) * i;
//       ctx.fillText(price.toFixed(2), padding - 5, y + 4);
//     }
    
//     // Draw candlesticks
//     data.forEach((candle, index) => {
//       const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length) * 0.1;
//       const centerX = x + candleWidth / 2;
      
//       const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
//       const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
//       const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
//       const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      
//       const isGreen = candle.close >= candle.open;
//       const bodyTop = Math.min(openY, closeY);
//       const bodyHeight = Math.abs(closeY - openY);
      
//       // Draw wick
//       ctx.strokeStyle = isGreen ? '#059669' : '#DC2626';
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(centerX, highY);
//       ctx.lineTo(centerX, lowY);
//       ctx.stroke();
      
//       // Draw body
//       ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
//       ctx.fillRect(x, bodyTop, candleWidth, bodyHeight || 1);
//     });
    
//     // Add mouse event listeners
//     canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'candlestick'));
//     canvas.addEventListener('mouseleave', handleMouseLeave);
    
//     // Draw title
//     ctx.fillStyle = '#E5E7EB';
//     ctx.font = 'bold 16px sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText(`${selectedTicker} - Live Price Chart`, canvas.width / 2, 25);
//   };

//   const drawLineChart = (canvas, data, options = {}) => {
//     const ctx = canvas.getContext('2d');
//     const rect = canvas.getBoundingClientRect();
//     canvas.width = rect.width;
//     canvas.height = rect.height;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     if (!data || data.length === 0) return;

//     const padding = 40;
//     const chartWidth = canvas.width - 2 * padding;
//     const chartHeight = canvas.height - 2 * padding;
    
//     const minValue = options.min !== undefined ? options.min : Math.min(...data);
//     const maxValue = options.max !== undefined ? options.max : Math.max(...data);
//     const valueRange = maxValue - minValue;
    
//     // Draw grid
//     ctx.strokeStyle = '#374151';
//     ctx.lineWidth = 1;
//     for (let i = 0; i <= 5; i++) {
//       const y = padding + (chartHeight / 5) * i;
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.stroke();
//     }
    
//     // Draw value labels
//     ctx.fillStyle = '#9CA3AF';
//     ctx.font = '12px sans-serif';
//     ctx.textAlign = 'right';
//     for (let i = 0; i <= 5; i++) {
//       const value = maxValue - (valueRange / 5) * i;
//       const y = padding + (chartHeight / 5) * i;
//       ctx.fillText(value.toFixed(2), padding - 5, y + 4);
//     }
    
//     // Draw line
//     ctx.strokeStyle = options.color || '#3B82F6';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
    
//     data.forEach((value, index) => {
//       const x = padding + (chartWidth / (data.length - 1)) * index;
//       const y = padding + ((maxValue - value) / valueRange) * chartHeight;
      
//       if (index === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
    
//     ctx.stroke();
    
//     // Fill area if specified
//     if (options.fill) {
//       ctx.fillStyle = options.fillColor || 'rgba(59, 130, 246, 0.1)';
//       ctx.lineTo(padding + chartWidth, padding + chartHeight);
//       ctx.lineTo(padding, padding + chartHeight);
//       ctx.closePath();
//       ctx.fill();
//     }
    
//     // Add mouse event listeners
//     canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'rsi'));
//     canvas.addEventListener('mouseleave', handleMouseLeave);
    
//     // Draw reference lines for RSI
//     if (options.type === 'rsi') {
//       ctx.strokeStyle = '#6B7280';
//       ctx.lineWidth = 1;
//       ctx.setLineDash([5, 5]);
      
//       // 70 line (overbought)
//       const y70 = padding + ((maxValue - 70) / valueRange) * chartHeight;
//       ctx.beginPath();
//       ctx.moveTo(padding, y70);
//       ctx.lineTo(canvas.width - padding, y70);
//       ctx.stroke();
      
//       // 30 line (oversold)
//       const y30 = padding + ((maxValue - 30) / valueRange) * chartHeight;
//       ctx.beginPath();
//       ctx.moveTo(padding, y30);
//       ctx.lineTo(canvas.width - padding, y30);
//       ctx.stroke();
      
//       ctx.setLineDash([]);
//     }
//   };

//   const drawMACDChart = (canvas, macdData) => {
//     const ctx = canvas.getContext('2d');
//     const rect = canvas.getBoundingClientRect();
//     canvas.width = rect.width;
//     canvas.height = rect.height;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     if (!macdData || macdData.macdLine.length === 0) return;

//     const padding = 40;
//     const chartWidth = canvas.width - 2 * padding;
//     const chartHeight = canvas.height - 2 * padding;
    
//     const allValues = [...macdData.macdLine, ...macdData.signalLine, ...macdData.histogram];
//     const minValue = Math.min(...allValues);
//     const maxValue = Math.max(...allValues);
//     const valueRange = maxValue - minValue;
    
//     // Draw grid
//     ctx.strokeStyle = '#374151';
//     ctx.lineWidth = 1;
//     for (let i = 0; i <= 5; i++) {
//       const y = padding + (chartHeight / 5) * i;
//       ctx.beginPath();
//       ctx.moveTo(padding, y);
//       ctx.lineTo(canvas.width - padding, y);
//       ctx.stroke();
//     }
    
//     // Draw zero line
//     ctx.strokeStyle = '#6B7280';
//     ctx.lineWidth = 1;
//     const zeroY = padding + ((maxValue - 0) / valueRange) * chartHeight;
//     ctx.beginPath();
//     ctx.moveTo(padding, zeroY);
//     ctx.lineTo(canvas.width - padding, zeroY);
//     ctx.stroke();
    
//     // Draw histogram bars
//     const barWidth = chartWidth / macdData.histogram.length * 0.8;
//     macdData.histogram.forEach((value, index) => {
//       const x = padding + (chartWidth / macdData.histogram.length) * index + (chartWidth / macdData.histogram.length) * 0.1;
//       const y = padding + ((maxValue - Math.max(0, value)) / valueRange) * chartHeight;
//       const height = Math.abs(value) / valueRange * chartHeight;
      
//       ctx.fillStyle = value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
//       ctx.fillRect(x, y, barWidth, height);
//     });
    
//     // Draw MACD line
//     ctx.strokeStyle = '#3B82F6';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     macdData.macdLine.forEach((value, index) => {
//       const x = padding + (chartWidth / (macdData.macdLine.length - 1)) * index;
//       const y = padding + ((maxValue - value) / valueRange) * chartHeight;
      
//       if (index === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
//     ctx.stroke();
    
//     // Draw Signal line
//     ctx.strokeStyle = '#F59E0B';
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     macdData.signalLine.forEach((value, index) => {
//       const x = padding + (chartWidth / (macdData.signalLine.length - 1)) * index;
//       const y = padding + ((maxValue - value) / valueRange) * chartHeight;
      
//       if (index === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
//     ctx.stroke();
    
//     // Add mouse event listeners
//     canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'macd'));
//     canvas.addEventListener('mouseleave', handleMouseLeave);
    
//     // Draw title
//     ctx.fillStyle = '#E5E7EB';
//     ctx.font = 'bold 16px sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('MACD (12, 26, 9)', canvas.width / 2, 25);
//   };

//   // Create charts when data or selected ticker changes
//   useEffect(() => {
//     if (!data[selectedTicker] || loading) return;

//     const tickerData = data[selectedTicker];
//     const closes = tickerData.map(d => d.close);

//     // Draw candlestick chart
//     if (candlestickRef.current) {
//       drawCandlestickChart(candlestickRef.current, tickerData);
//     }

//     // Draw RSI chart
//     if (rsiRef.current) {
//       const rsiData = calculateRSI(closes);
//       drawLineChart(rsiRef.current, rsiData, {
//         color: '#8B5CF6',
//         fillColor: 'rgba(139, 92, 246, 0.1)',
//         fill: true,
//         min: 0,
//         max: 100,
//         title: 'RSI (14)',
//         type: 'rsi'
//       });
//     }

//     // Draw MACD chart
//     if (macdRef.current) {
//       const macdData = calculateMACD(closes);
//       drawMACDChart(macdRef.current, macdData);
//     }
//   }, [selectedTicker, data, loading]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading trading data...</div>
//       </div>
//     );
//   }

//   const currentData = data[selectedTicker];
//   const latestPrice = currentData && currentData.length > 0 ? currentData[currentData.length - 1] : null;
//   const marketStatus = getMarketStatus();

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Live Status */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
//                 <TrendingUp className="text-blue-400" />
//                 STP Trading Platform
//                 <div className="flex items-center gap-2 ml-4">
//                   <div className={`w-3 h-3 rounded-full ${
//                     marketStatus === 'OPEN' && isLive ? 'bg-green-400 animate-pulse' : 
//                     marketStatus === 'OPEN' && !isLive ? 'bg-yellow-400' :
//                     'bg-red-400'
//                   }`}></div>
//                   <span className="text-lg font-normal text-gray-300">
//                     {marketStatus === 'OPEN' && isLive ? 'LIVE MARKET' : 
//                      marketStatus === 'OPEN' && !isLive ? 'MARKET PAUSED' :
//                      marketStatus === 'PRE_MARKET' ? 'PRE-MARKET' : 'MARKET CLOSED'}
//                   </span>
//                 </div>
//               </h1>
//               <p className="text-gray-400">
//                 {marketStatus === 'OPEN' ? 'Real-time Technical Analysis • Live Market Data' : 
//                  marketStatus === 'PRE_MARKET' ? 'Technical Analysis • Pre-Market View (Previous Day Data)' :
//                  'Technical Analysis • Market Closed'}
//               </p>
//               <p className="text-gray-500 text-sm">
//                 Last Update: {lastUpdate.toLocaleTimeString()} • 
//                 Market Hours: 9:30 AM - 4:00 PM EST
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Ticker Selection */}
//         <div className="mb-8">
//           <div className="relative inline-block">
//             <select
//               value={selectedTicker}
//               onChange={(e) => setSelectedTicker(e.target.value)}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-64"
//             >
//               {tickers.map(ticker => (
//                 <option key={ticker.symbol} value={ticker.symbol}>
//                   {ticker.symbol} - {ticker.name}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         {/* Price Summary */}
//         {latestPrice && (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
//             <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
//               <h3 className="text-gray-400 text-sm mb-2">Current Price</h3>
//               <p className="text-3xl font-bold">${latestPrice.close.toFixed(2)}</p>
//             </div>
//             <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
//               <h3 className="text-gray-400 text-sm mb-2">Day Change</h3>
//               <p className={`text-3xl font-bold ${latestPrice.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                 {latestPrice.change >= 0 ? '+' : ''}${latestPrice.change.toFixed(2)}
//               </p>
//             </div>
//             <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
//               <h3 className="text-gray-400 text-sm mb-2">Change %</h3>
//               <p className={`text-3xl font-bold ${latestPrice.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                 {latestPrice.changePercent >= 0 ? '+' : ''}{latestPrice.changePercent}%
//               </p>
//             </div>
//             <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
//               <h3 className="text-gray-400 text-sm mb-2">Volume</h3>
//               <p className="text-3xl font-bold">{latestPrice.volume.toLocaleString()}</p>
//             </div>
//             <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-red-500">
//               <h3 className="text-gray-400 text-sm mb-2">Last Update</h3>
//               <p className="text-2xl font-bold text-blue-400">{latestPrice.time}</p>
//             </div>
//           </div>
//         )}

//         {/* Charts */}
//         <div className="space-y-8">
//           {/* Candlestick Chart */}
//           <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <BarChart3 className="text-green-400" />
//                 <h2 className="text-2xl font-semibold">Live Price Chart - {selectedTicker}</h2>
//               </div>
//               <div className="text-sm text-gray-400">
//                 {marketStatus === 'OPEN' ? 'Live Market Data • Auto-updating every 2s' :
//                  marketStatus === 'PRE_MARKET' ? 'Previous Day Complete Data' :
//                  'Market Closed • Complete Day Data'}
//               </div>
//             </div>
//             <div className="h-[600px] w-full">
//               <canvas ref={candlestickRef} className="w-full h-full"></canvas>
//             </div>
//           </div>

//           {/* RSI Chart */}
//           <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <Activity className="text-purple-400" />
//                 <h2 className="text-2xl font-semibold">RSI Indicator (14)</h2>
//               </div>
//               <div className="flex gap-4 text-sm">
//                 <span className="text-red-400">Overbought: 70+</span>
//                 <span className="text-green-400">Oversold: 30-</span>
//               </div>
//             </div>
//             <div className="h-[400px] w-full">
//               <canvas ref={rsiRef} className="w-full h-full"></canvas>
//             </div>
//           </div>

//           {/* MACD Chart */}
//           <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="text-blue-400" />
//                 <h2 className="text-2xl font-semibold">MACD Indicator (12, 26, 9)</h2>
//               </div>
//               <div className="flex gap-4 text-sm">
//                 <span className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                   MACD Line
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-yellow-500 rounded"></div>
//                   Signal Line
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <div className="w-3 h-3 bg-green-500 rounded"></div>
//                   Histogram
//                 </span>
//               </div>
//             </div>
//             <div className="h-[400px] w-full">
//               <canvas ref={macdRef} className="w-full h-full"></canvas>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hover Tooltip */}
//       {hoverInfo.visible && hoverInfo.data && (
//         <div 
//           className="fixed z-50 pointer-events-none"
//           style={{ 
//             left: Math.min(hoverInfo.x, window.innerWidth - 300), 
//             top: Math.max(hoverInfo.y - 200, 10) 
//           }}
//         >
//           <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-4 min-w-[280px]">
//             <div className="text-blue-400 font-semibold mb-2 text-sm">
//               {selectedTicker} • {hoverInfo.data.time}
//             </div>
            
//             {hoverInfo.type === 'candlestick' && (
//               <div className="space-y-2 text-sm">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-gray-400">Open:</span>
//                     <span className="text-white ml-2 font-mono">${hoverInfo.data.open}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-400">High:</span>
//                     <span className="text-green-400 ml-2 font-mono">${hoverInfo.data.high}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-400">Low:</span>
//                     <span className="text-red-400 ml-2 font-mono">${hoverInfo.data.low}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-400">Close:</span>
//                     <span className="text-white ml-2 font-mono">${hoverInfo.data.close}</span>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-700 pt-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Change:</span>
//                     <span className={`font-mono ${hoverInfo.data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                       {hoverInfo.data.change >= 0 ? '+' : ''}${hoverInfo.data.change} ({hoverInfo.data.changePercent >= 0 ? '+' : ''}{hoverInfo.data.changePercent}%)
//                     </span>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <span className="text-gray-400">Volume:</span>
//                     <span className="text-yellow-400 font-mono">{hoverInfo.data.volume?.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {hoverInfo.type === 'rsi' && (
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">RSI (14):</span>
//                   <span className={`font-mono text-lg ${
//                     parseFloat(hoverInfo.data.rsi) > 70 ? 'text-red-400' : 
//                     parseFloat(hoverInfo.data.rsi) < 30 ? 'text-green-400' : 'text-purple-400'
//                   }`}>
//                     {hoverInfo.data.rsi}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {parseFloat(hoverInfo.data.rsi) > 70 ? '⚠️ Overbought Territory' : 
//                    parseFloat(hoverInfo.data.rsi) < 30 ? '📈 Oversold Territory' : '📊 Neutral Zone'}
//                 </div>
//                 <div className="border-t border-gray-700 pt-2">
//                   <div className="flex justify-between text-xs">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="text-white font-mono">${hoverInfo.data.close}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {hoverInfo.type === 'macd' && (
//               <div className="space-y-2 text-sm">
//                 <div className="grid grid-cols-1 gap-2">
//                   <div className="flex justify-between">
//                     <span className="text-blue-400">MACD:</span>
//                     <span className="text-white font-mono">{hoverInfo.data.macd}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-yellow-400">Signal:</span>
//                     <span className="text-white font-mono">{hoverInfo.data.signal}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Histogram:</span>
//                     <span className={`font-mono ${parseFloat(hoverInfo.data.histogram) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                       {hoverInfo.data.histogram}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-700 pt-2 text-xs">
//                   <div className="text-gray-500">
//                     {parseFloat(hoverInfo.data.histogram) > 0 ? '📈 Bullish Momentum' : '📉 Bearish Momentum'}
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <span className="text-gray-400">Price:</span>
//                     <span className="text-white font-mono">${hoverInfo.data.close}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicalAnalysis;

//NEW//

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, TrendingUp, Activity, BarChart3, Clock } from 'lucide-react';

const TechnicalAnalysis = () => {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [hoverInfo, setHoverInfo] = useState({ visible: false, data: null, x: 0, y: 0, type: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const candlestickRef = useRef(null);
  const rsiRef = useRef(null);
  const macdRef = useRef(null);
  const intervalRef = useRef(null);
  const timeUpdateRef = useRef(null);

  const tickers = [
    { symbol: 'AAPL', name: 'Apple Inc.', file: 'simulated_AAPL_live.json' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', file: 'simulated_GOOGL_live.json' },
    { symbol: 'IBM', name: 'IBM Corporation', file: 'simulated_IBM_.json' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', file: 'simulated_MSFT_live.json' },
    { symbol: 'TSLA', name: 'Tesla Inc.', file: 'simulated_TSLA_live.json' },
    { symbol: 'UL', name: 'Unilever PLC', file: 'simulated_UL_live.json' },
    { symbol: 'WMT', name: 'Walmart Inc.', file: 'simulated_WMT_live.json' }
  ];

  // Update current time every second
  useEffect(() => {
    timeUpdateRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
    };
  }, []);

  // Enhanced market hours utility functions
  const getMarketHours = () => {
    return {
      open: { hour: 9, minute: 30 }, // 9:30 AM
      close: { hour: 15, minute: 59 } // 3:59 PM (market closes at 4:00 PM, so 3:59 is last minute)
    };
  };

  const isMarketOpen = (time = currentTime) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;
    
    const marketHours = getMarketHours();
    const marketOpenMinutes = marketHours.open.hour * 60 + marketHours.open.minute;
    const marketCloseMinutes = marketHours.close.hour * 60 + marketHours.close.minute;
    
    return currentTimeMinutes >= marketOpenMinutes && currentTimeMinutes <= marketCloseMinutes;
  };

  const getMarketStatus = (time = currentTime) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;
    
    const marketHours = getMarketHours();
    const marketOpenMinutes = marketHours.open.hour * 60 + marketHours.open.minute;
    const marketCloseMinutes = marketHours.close.hour * 60 + marketHours.close.minute;
    
    if (currentTimeMinutes < marketOpenMinutes) {
      return 'PRE_MARKET';
    } else if (currentTimeMinutes > marketCloseMinutes) {
      return 'AFTER_MARKET';
    } else {
      return 'OPEN';
    }
  };

  const getNextMarketOpen = (time = currentTime) => {
    const marketHours = getMarketHours();
    const nextOpen = new Date(time);
    
    if (getMarketStatus(time) === 'PRE_MARKET') {
      // Same day
      nextOpen.setHours(marketHours.open.hour, marketHours.open.minute, 0, 0);
    } else {
      // Next trading day (assuming no weekends for simplicity)
      nextOpen.setDate(nextOpen.getDate() + 1);
      nextOpen.setHours(marketHours.open.hour, marketHours.open.minute, 0, 0);
    }
    
    return nextOpen;
  };

  const getTimeUntilMarketOpen = (time = currentTime) => {
    const nextOpen = getNextMarketOpen(time);
    const diff = nextOpen.getTime() - time.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, totalSeconds: Math.floor(diff / 1000) };
  };

  // Load data from JSON files
  const loadTickerData = async (ticker) => {
    try {
      const response = await fetch(`/data/${ticker.file}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${ticker.file}: ${response.status}`);
      }
      const jsonData = await response.json();
      
      // Transform JSON data to match our component structure
      const transformedData = jsonData.map((item, index) => {
        const open = parseFloat(item.open);
        const close = parseFloat(item.close);
        const change = close - open;
        
        return {
          date: new Date(item.timestamp).toISOString(),
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
          timestamp: item.timestamp,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseInt(item.volume),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat((change / open * 100).toFixed(2))
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error(`Error loading data for ${ticker.symbol}:`, error);
      return [];
    }
  };

  // Get appropriate data slice based on market status and current time
  const getCurrentDataSlice = (fullData, time = currentTime) => {
    if (!fullData || fullData.length === 0) return [];
    
    const marketStatus = getMarketStatus(time);
    
    if (marketStatus === 'PRE_MARKET') {
      // Before 9:30 AM - show previous trading day's complete data
      return fullData; // Assuming the JSON contains previous day's data
    } else if (marketStatus === 'AFTER_MARKET') {
      // After 3:59 PM - show current trading day's complete data
      return fullData; // Assuming the JSON contains current day's data
    } else {
      // Market is open (9:30 AM - 3:59 PM) - show data up to current time
      const currentHour = time.getHours();
      const currentMinute = time.getMinutes();
      
      return fullData.filter(item => {
        const itemDate = new Date(item.timestamp);
        const itemHour = itemDate.getHours();
        const itemMinute = itemDate.getMinutes();
        
        const itemTimeMinutes = itemHour * 60 + itemMinute;
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        
        // Only show data up to current time during market hours
        return itemTimeMinutes <= currentTimeMinutes;
      });
    }
  };

  // Update live data display based on current time
  const updateLiveData = async () => {
    if (!isLive) return;
    
    const now = new Date();
    setCurrentTime(now);
    
    setData(prevData => {
      const newData = { ...prevData };
      
      // Update displayed data slice based on current time
      tickers.forEach(ticker => {
        if (prevData[ticker.symbol] && prevData[`${ticker.symbol}_full`]) {
          const fullData = prevData[`${ticker.symbol}_full`];
          newData[ticker.symbol] = getCurrentDataSlice(fullData, now);
        }
      });
      
      return newData;
    });
    
    setLastUpdate(now);
  };

  // Calculate RSI
  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return [];
    
    const rsi = [];
    const gains = [];
    const losses = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }

    return rsi;
  };

  // Calculate MACD
  const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    if (prices.length < slowPeriod) return { macdLine: [], signalLine: [], histogram: [] };
    
    const ema = (data, period) => {
      const k = 2 / (period + 1);
      const ema = [data[0]];
      for (let i = 1; i < data.length; i++) {
        ema.push(data[i] * k + ema[i - 1] * (1 - k));
      }
      return ema;
    };

    const fastEMA = ema(prices, fastPeriod);
    const slowEMA = ema(prices, slowPeriod);
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = ema(macdLine, signalPeriod);
    const histogram = macdLine.map((macd, i) => macd - (signalLine[i] || 0));

    return { macdLine, signalLine, histogram };
  };

  // Load initial data and start live updates
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const tickerData = {};
        
        // Load data for all tickers
        for (const ticker of tickers) {
          const fullTickerData = await loadTickerData(ticker);
          
          // Store both full data and current display slice
          tickerData[`${ticker.symbol}_full`] = fullTickerData;
          tickerData[ticker.symbol] = getCurrentDataSlice(fullTickerData);
        }
        
        setData(tickerData);
      } catch (error) {
        console.error('Error loading ticker data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle live updates based on market status
  useEffect(() => {
    const marketStatus = getMarketStatus(currentTime);
    
    if (isLive && marketStatus === 'OPEN') {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(updateLiveData, 2000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, currentTime]);

  // Mouse event handlers for charts
  const handleMouseMove = (e, chartType) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const tickerData = data[selectedTicker];
    if (!tickerData || tickerData.length === 0) return;
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    
    // Calculate which data point we're hovering over
    const dataIndex = Math.floor(((mouseX - padding) / chartWidth) * tickerData.length);
    
    if (dataIndex >= 0 && dataIndex < tickerData.length) {
      const candleData = tickerData[dataIndex];
      const closes = tickerData.map(d => d.close);
      
      let hoverData = {
        time: new Date(candleData.date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        ...candleData
      };
      
      if (chartType === 'rsi') {
        const rsiData = calculateRSI(closes);
        const rsiIndex = Math.max(0, dataIndex - (closes.length - rsiData.length));
        if (rsiIndex < rsiData.length && rsiIndex >= 0) {
          hoverData.rsi = rsiData[rsiIndex]?.toFixed(2);
        }
      } else if (chartType === 'macd') {
        const macdData = calculateMACD(closes);
        const macdIndex = Math.max(0, dataIndex - (closes.length - macdData.macdLine.length));
        if (macdIndex < macdData.macdLine.length && macdIndex >= 0) {
          hoverData.macd = macdData.macdLine[macdIndex]?.toFixed(4);
          hoverData.signal = macdData.signalLine[macdIndex]?.toFixed(4);
          hoverData.histogram = macdData.histogram[macdIndex]?.toFixed(4);
        }
      }
      
      setHoverInfo({
        visible: true,
        data: hoverData,
        x: e.clientX + 10,
        y: e.clientY - 10,
        type: chartType
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo({ visible: false, data: null, x: 0, y: 0, type: '' });
  };

  // Custom chart drawing functions
  const drawCandlestickChart = (canvas, data) => {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!data || data.length === 0) return;

    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const prices = data.map(d => [d.high, d.low, d.open, d.close]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    
    const candleWidth = Math.max(1, (chartWidth / data.length) * 0.8);
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw price labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(price.toFixed(2), padding - 5, y + 4);
    }
    
    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length) * 0.1;
      const centerX = x + candleWidth / 2;
      
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      
      const isGreen = candle.close >= candle.open;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#059669' : '#DC2626';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
    });
    
    // Add mouse event listeners
    canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'candlestick'));
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Draw title
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${selectedTicker} - Live Price Chart`, canvas.width / 2, 25);
  };

  const drawLineChart = (canvas, data, options = {}) => {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!data || data.length === 0) return;

    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const minValue = options.min !== undefined ? options.min : Math.min(...data);
    const maxValue = options.max !== undefined ? options.max : Math.max(...data);
    const valueRange = maxValue - minValue || 1;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw value labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (valueRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(value.toFixed(2), padding - 5, y + 4);
    }
    
    // Draw line
    ctx.strokeStyle = options.color || '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + ((maxValue - value) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Fill area if specified
    if (options.fill && data.length > 0) {
      ctx.fillStyle = options.fillColor || 'rgba(59, 130, 246, 0.1)';
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.lineTo(padding, padding + chartHeight);
      ctx.closePath();
      ctx.fill();
    }
    
    // Add mouse event listeners
    canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'rsi'));
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Draw reference lines for RSI
    if (options.type === 'rsi') {
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // 70 line (overbought)
      const y70 = padding + ((maxValue - 70) / valueRange) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y70);
      ctx.lineTo(canvas.width - padding, y70);
      ctx.stroke();
      
      // 30 line (oversold)
      const y30 = padding + ((maxValue - 30) / valueRange) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y30);
      ctx.lineTo(canvas.width - padding, y30);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }
  };

  const drawMACDChart = (canvas, macdData) => {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!macdData || macdData.macdLine.length === 0) return;

    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const allValues = [...macdData.macdLine, ...macdData.signalLine, ...macdData.histogram];
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const valueRange = maxValue - minValue || 1;
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw zero line
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 1;
    const zeroY = padding + ((maxValue - 0) / valueRange) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(canvas.width - padding, zeroY);
    ctx.stroke();
    
    // Draw histogram bars
    const barWidth = Math.max(1, (chartWidth / macdData.histogram.length) * 0.8);
    macdData.histogram.forEach((value, index) => {
      const x = padding + (chartWidth / macdData.histogram.length) * index + (chartWidth / macdData.histogram.length) * 0.1;
      const y = padding + ((maxValue - Math.max(0, value)) / valueRange) * chartHeight;
      const height = Math.abs(value) / valueRange * chartHeight;
      
      ctx.fillStyle = value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
      ctx.fillRect(x, y, barWidth, height);
    });
    
    // Draw MACD line
    if (macdData.macdLine.length > 1) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      macdData.macdLine.forEach((value, index) => {
        const x = padding + (chartWidth / (macdData.macdLine.length - 1)) * index;
        const y = padding + ((maxValue - value) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
    
    // Draw Signal line
    if (macdData.signalLine.length > 1) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      macdData.signalLine.forEach((value, index) => {
        const x = padding + (chartWidth / (macdData.signalLine.length - 1)) * index;
        const y = padding + ((maxValue - value) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
    
    // Add mouse event listeners
    canvas.addEventListener('mousemove', (e) => handleMouseMove(e, 'macd'));
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Draw title
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MACD (12, 26, 9)', canvas.width / 2, 25);
  };

  // Create charts when data or selected ticker changes
  useEffect(() => {
    if (!data[selectedTicker] || loading) return;

    const tickerData = data[selectedTicker];
    const closes = tickerData.map(d => d.close);

    // Draw candlestick chart
    if (candlestickRef.current && tickerData.length > 0) {
      drawCandlestickChart(candlestickRef.current, tickerData);
    }

    // Draw RSI chart
    if (rsiRef.current && closes.length > 14) {
      const rsiData = calculateRSI(closes);
      if (rsiData.length > 0) {
        drawLineChart(rsiRef.current, rsiData, {
          color: '#8B5CF6',
          fillColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          min: 0,
          max: 100,
          title: 'RSI (14)',
          type: 'rsi'
        });
      }
    }

    // Draw MACD chart
    if (macdRef.current && closes.length > 26) {
      const macdData = calculateMACD(closes);
      if (macdData.macdLine.length > 0) {
        drawMACDChart(macdRef.current, macdData);
      }
    }
  }, [selectedTicker, data, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <Clock className="animate-spin" />
          Loading trading data...
        </div>
      </div>
    );
  }

  const currentData = data[selectedTicker];
  const latestPrice = currentData && currentData.length > 0 ? currentData[currentData.length - 1] : null;
  const marketStatus = getMarketStatus(currentTime);
  const timeUntilOpen = getTimeUntilMarketOpen(currentTime);

  const getMarketStatusDisplay = () => {
    switch (marketStatus) {
      case 'OPEN':
        return {
          status: 'LIVE MARKET',
          color: 'bg-green-400 animate-pulse',
          description: 'Real-time Technical Analysis • Live Market Data'
        };
      case 'PRE_MARKET':
        return {
          status: 'PRE-MARKET',
          color: 'bg-yellow-400',
          description: 'Technical Analysis • Pre-Market View (Previous Trading Day Data)'
        };
      case 'AFTER_MARKET':
        return {
          status: 'MARKET CLOSED',
          color: 'bg-red-400',
          description: 'Technical Analysis • Market Closed (Current Trading Day Complete Data)'
        };
      default:
        return {
          status: 'MARKET STATUS UNKNOWN',
          color: 'bg-gray-400',
          description: 'Technical Analysis'
        };
    }
  };

  const statusDisplay = getMarketStatusDisplay();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Live Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <TrendingUp className="text-blue-400" />
                STP Trading Platform
                <div className="flex items-center gap-2 ml-4">
                  <div className={`w-3 h-3 rounded-full ${statusDisplay.color}`}></div>
                  <span className="text-lg font-normal text-gray-300">
                    {statusDisplay.status}
                  </span>
                </div>
              </h1>
              <p className="text-gray-400">
                {statusDisplay.description}
              </p>
              <div className="text-gray-500 text-sm space-y-1">
                <p>
                  Last Update: {lastUpdate.toLocaleTimeString()} • 
                  Market Hours: 9:30 AM - 4:00 PM EST
                </p>
                <p>
                  Current Time: {currentTime.toLocaleTimeString()} • 
                  {marketStatus !== 'OPEN' && timeUntilOpen.totalSeconds > 0 && (
                    <span>
                      Next Market Open: {timeUntilOpen.hours}h {timeUntilOpen.minutes}m {timeUntilOpen.seconds}s
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Live/Pause Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isLive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
                disabled={marketStatus !== 'OPEN'}
              >
                {isLive ? 'Live Mode' : 'Paused'}
              </button>
            </div>
          </div>
        </div>

        {/* Ticker Selection */}
        <div className="mb-8">
          <div className="relative inline-block">
            <select
              value={selectedTicker}
              onChange={(e) => setSelectedTicker(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-64"
            >
              {tickers.map(ticker => (
                <option key={ticker.symbol} value={ticker.symbol}>
                  {ticker.symbol} - {ticker.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Price Summary */}
        {latestPrice && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-gray-400 text-sm mb-2">Current Price</h3>
              <p className="text-3xl font-bold">${latestPrice.close.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-gray-400 text-sm mb-2">Day Change</h3>
              <p className={`text-3xl font-bold ${latestPrice.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {latestPrice.change >= 0 ? '+' : ''}${latestPrice.change.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-gray-400 text-sm mb-2">Change %</h3>
              <p className={`text-3xl font-bold ${latestPrice.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {latestPrice.changePercent >= 0 ? '+' : ''}{latestPrice.changePercent}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="text-gray-400 text-sm mb-2">Volume</h3>
              <p className="text-3xl font-bold">{latestPrice.volume.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="text-gray-400 text-sm mb-2">Last Update</h3>
              <p className="text-2xl font-bold text-blue-400">{latestPrice.time}</p>
            </div>
          </div>
        )}

        {/* Market Status Alert */}
        {marketStatus !== 'OPEN' && (
          <div className={`mb-8 p-4 rounded-lg border-l-4 ${
            marketStatus === 'PRE_MARKET' 
              ? 'bg-yellow-900 border-yellow-500 text-yellow-200' 
              : 'bg-red-900 border-red-500 text-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {marketStatus === 'PRE_MARKET' 
                    ? '📊 Pre-Market Hours' 
                    : '🔒 Market Closed'
                  }
                </h3>
                <p className="text-sm mt-1">
                  {marketStatus === 'PRE_MARKET' 
                    ? 'Showing previous trading day data. Market opens at 9:30 AM EST.' 
                    : 'Showing complete trading day data. Market closed at 4:00 PM EST.'
                  }
                  {timeUntilOpen.totalSeconds > 0 && (
                    <span className="ml-2 font-mono">
                      Next open: {timeUntilOpen.hours}h {timeUntilOpen.minutes}m {timeUntilOpen.seconds}s
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="space-y-8">
          {/* Candlestick Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-green-400" />
                <h2 className="text-2xl font-semibold">Price Chart - {selectedTicker}</h2>
              </div>
              <div className="text-sm text-gray-400">
                {marketStatus === 'OPEN' && isLive ? 'Live Market Data • Auto-updating every 2s' :
                 marketStatus === 'OPEN' && !isLive ? 'Market Data • Updates Paused' :
                 marketStatus === 'PRE_MARKET' ? 'Previous Trading Day Complete Data' :
                 'Current Trading Day Complete Data'}
              </div>
            </div>
            <div className="h-[600px] w-full">
              <canvas ref={candlestickRef} className="w-full h-full cursor-crosshair"></canvas>
            </div>
          </div>

          {/* RSI Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-purple-400" />
                <h2 className="text-2xl font-semibold">RSI Indicator (14)</h2>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-red-400">⚠️ Overbought: 70+</span>
                <span className="text-green-400">📈 Oversold: 30-</span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <canvas ref={rsiRef} className="w-full h-full cursor-crosshair"></canvas>
            </div>
          </div>

          {/* MACD Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-400" />
                <h2 className="text-2xl font-semibold">MACD Indicator (12, 26, 9)</h2>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  MACD Line
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  Signal Line
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  Histogram
                </span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <canvas ref={macdRef} className="w-full h-full cursor-crosshair"></canvas>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        {currentData && currentData.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-400" />
              Data Summary for {selectedTicker}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Data Points:</span>
                <span className="ml-2 font-mono text-white">{currentData.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Market Status:</span>
                <span className="ml-2 font-semibold text-blue-400">{marketStatus.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-400">Period:</span>
                <span className="ml-2 font-mono text-white">
                  {currentData[0]?.time} - {currentData[currentData.length - 1]?.time}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Update Mode:</span>
                <span className={`ml-2 font-semibold ${isLive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {marketStatus === 'OPEN' ? (isLive ? 'Live' : 'Paused') : 'Static'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
      {hoverInfo.visible && hoverInfo.data && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: Math.min(hoverInfo.x, window.innerWidth - 300), 
            top: Math.max(hoverInfo.y - 200, 10) 
          }}
        >
          <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl p-4 min-w-[280px]">
            <div className="text-blue-400 font-semibold mb-2 text-sm">
              {selectedTicker} • {hoverInfo.data.time}
            </div>
            
            {hoverInfo.type === 'candlestick' && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Open:</span>
                    <span className="text-white ml-2 font-mono">${hoverInfo.data.open}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">High:</span>
                    <span className="text-green-400 ml-2 font-mono">${hoverInfo.data.high}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Low:</span>
                    <span className="text-red-400 ml-2 font-mono">${hoverInfo.data.low}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Close:</span>
                    <span className="text-white ml-2 font-mono">${hoverInfo.data.close}</span>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Change:</span>
                    <span className={`font-mono ${hoverInfo.data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {hoverInfo.data.change >= 0 ? '+' : ''}${hoverInfo.data.change} ({hoverInfo.data.changePercent >= 0 ? '+' : ''}{hoverInfo.data.changePercent}%)
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-yellow-400 font-mono">{hoverInfo.data.volume?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {hoverInfo.type === 'rsi' && hoverInfo.data.rsi && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">RSI (14):</span>
                  <span className={`font-mono text-lg ${
                    parseFloat(hoverInfo.data.rsi) > 70 ? 'text-red-400' : 
                    parseFloat(hoverInfo.data.rsi) < 30 ? 'text-green-400' : 'text-purple-400'
                  }`}>
                    {hoverInfo.data.rsi}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {parseFloat(hoverInfo.data.rsi) > 70 ? '⚠️ Overbought Territory' : 
                   parseFloat(hoverInfo.data.rsi) < 30 ? '📈 Oversold Territory' : '📊 Neutral Zone'}
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-mono">${hoverInfo.data.close}</span>
                  </div>
                </div>
              </div>
            )}
            
            {hoverInfo.type === 'macd' && hoverInfo.data.macd && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-blue-400">MACD:</span>
                    <span className="text-white font-mono">{hoverInfo.data.macd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Signal:</span>
                    <span className="text-white font-mono">{hoverInfo.data.signal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Histogram:</span>
                    <span className={`font-mono ${parseFloat(hoverInfo.data.histogram) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {hoverInfo.data.histogram}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-2 text-xs">
                  <div className="text-gray-500">
                    {parseFloat(hoverInfo.data.histogram) > 0 ? '📈 Bullish Momentum' : '📉 Bearish Momentum'}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-mono">${hoverInfo.data.close}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>  
  );
};

export default TechnicalAnalysis;
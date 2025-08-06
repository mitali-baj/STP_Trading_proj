import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const TechnicalAnalysis = () => {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [hoverInfo, setHoverInfo] = useState({ visible: false, data: null, x: 0, y: 0, type: '' });
  
  const candlestickRef = useRef(null);
  const rsiRef = useRef(null);
  const macdRef = useRef(null);
  const intervalRef = useRef(null);

  // const tickers = [
  //   { symbol: 'AAPL', name: 'Apple Inc.', file: 'simulated_AAPL_live.json' },
  //   { symbol: 'GOOGL', name: 'Alphabet Inc.', file: 'simulated_GOOGL_live.json' },
  //   { symbol: 'IBM', name: 'IBM Corporation', file: 'simulated_IBM_.json' },
  //   { symbol: 'MSFT', name: 'Microsoft Corp.', file: 'simulated_MSFT_live.json' },
  //   { symbol: 'TSLA', name: 'Tesla Inc.', file: 'simulated_TSLA_live.json' },
  //   { symbol: 'UL', name: 'Unilever PLC', file: 'simulated_UL_live.json' },
  //   { symbol: 'WMT', name: 'Walmart Inc.', file: 'simulated_WMT_live.json' }
  // ];

  const tickers = [
    { symbol: 'AAPL', file: 'simulated_AAPL_live.json' },
    { symbol: 'GOOGL', file: 'simulated_GOOGL_live.json' },
    { symbol: 'IBM', file: 'simulated_IBM_.json' },
    { symbol: 'MSFT', file: 'simulated_MSFT_live.json' },
    { symbol: 'TSLA', file: 'simulated_TSLA_live.json' },
    { symbol: 'UL', file: 'simulated_UL_live.json' },
    { symbol: 'WMT', file: 'simulated_WMT_live.json' }
  ];

  // Market hours utility functions
  const isMarketOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    // Market hours: 9:30 AM to 3:59 PM (EST)
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 15 * 60 + 59; // 3:59 PM
    
    return currentTime >= marketOpen && currentTime <= marketClose;
  };

  const getMarketStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 15 * 60 + 59; // 3:59 PM
    
    if (currentTime < marketOpen) {
      return 'PRE_MARKET';
    } else if (currentTime > marketClose) {
      return 'AFTER_MARKET';
    } else {
      return 'OPEN';
    }
  };

  // Load data from JSON files
  const loadTickerData = async (ticker) => {
    try {
      const response = await fetch(`/data/${ticker.file}`);
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

  // Get current live data slice based on market hours
  const getCurrentDataSlice = (fullData) => {
    if (!fullData || fullData.length === 0) return [];
    
    const marketStatus = getMarketStatus();
    const now = new Date();
    
    if (marketStatus === 'PRE_MARKET') {
      // Show previous day's complete data
      return fullData;
    } else if (marketStatus === 'AFTER_MARKET') {
      // Show complete current day data
      return fullData;
    } else {
      // Market is open - show data up to current time
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      return fullData.filter(item => {
        const itemDate = new Date(item.timestamp);
        const itemHour = itemDate.getHours();
        const itemMinute = itemDate.getMinutes();
        
        const itemTime = itemHour * 60 + itemMinute;
        const currentTime = currentHour * 60 + currentMinute;
        
        return itemTime <= currentTime;
      });
    }
  };

  // Update live data display based on current time
  const updateLiveData = async () => {
    if (!isLive) return;
    
    setData(prevData => {
      const newData = { ...prevData };
      
      // Update displayed data slice based on current time
      tickers.forEach(ticker => {
        if (prevData[ticker.symbol] && prevData[`${ticker.symbol}_full`]) {
          const fullData = prevData[`${ticker.symbol}_full`];
          newData[ticker.symbol] = getCurrentDataSlice(fullData);
        }
      });
      
      return newData;
    });
    
    setLastUpdate(new Date());
  };

  // Calculate RSI
  const calculateRSI = (prices, period = 14) => {
    const rsi = [];
    const gains = [];
    const losses = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    for (let i = period; i <= gains.length; i++) {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b) / period;
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }

    return rsi;
  };

  // Calculate MACD
  const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
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
      const tickerData = {};
      
      // Load data for all tickers
      for (const ticker of tickers) {
        const fullTickerData = await loadTickerData(ticker);
        
        // Store both full data and current display slice
        tickerData[`${ticker.symbol}_full`] = fullTickerData;
        tickerData[ticker.symbol] = getCurrentDataSlice(fullTickerData);
      }
      
      setData(tickerData);
      setLoading(false);
    };
    
    loadData();
    
    // Start live updates every 2 seconds during market hours
    const marketStatus = getMarketStatus();
    if (marketStatus === 'OPEN') {
      intervalRef.current = setInterval(updateLiveData, 2000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update live data when isLive changes
  useEffect(() => {
    const marketStatus = getMarketStatus();
    
    if (isLive && !intervalRef.current && marketStatus === 'OPEN') {
      intervalRef.current = setInterval(updateLiveData, 2000);
    } else if (!isLive && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (marketStatus !== 'OPEN' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

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
        if (rsiIndex < rsiData.length) {
          hoverData.rsi = rsiData[rsiIndex]?.toFixed(2);
        }
      } else if (chartType === 'macd') {
        const macdData = calculateMACD(closes);
        const macdIndex = Math.max(0, dataIndex - (closes.length - macdData.macdLine.length));
        if (macdIndex < macdData.macdLine.length) {
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
    const priceRange = maxPrice - minPrice;
    
    const candleWidth = chartWidth / data.length * 0.8;
    
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
      const bodyHeight = Math.abs(closeY - openY);
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#059669' : '#DC2626';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, highY);
      ctx.lineTo(centerX, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight || 1);
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
    const valueRange = maxValue - minValue;
    
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
    if (options.fill) {
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
    const valueRange = maxValue - minValue;
    
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
    const barWidth = chartWidth / macdData.histogram.length * 0.8;
    macdData.histogram.forEach((value, index) => {
      const x = padding + (chartWidth / macdData.histogram.length) * index + (chartWidth / macdData.histogram.length) * 0.1;
      const y = padding + ((maxValue - Math.max(0, value)) / valueRange) * chartHeight;
      const height = Math.abs(value) / valueRange * chartHeight;
      
      ctx.fillStyle = value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
      ctx.fillRect(x, y, barWidth, height);
    });
    
    // Draw MACD line
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
    
    // Draw Signal line
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
    if (candlestickRef.current) {
      drawCandlestickChart(candlestickRef.current, tickerData);
    }

    // Draw RSI chart
    if (rsiRef.current) {
      const rsiData = calculateRSI(closes);
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

    // Draw MACD chart
    if (macdRef.current) {
      const macdData = calculateMACD(closes);
      drawMACDChart(macdRef.current, macdData);
    }
  }, [selectedTicker, data, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading trading data...</div>
      </div>
    );
  }

  const currentData = data[selectedTicker];
  const latestPrice = currentData && currentData.length > 0 ? currentData[currentData.length - 1] : null;
  const marketStatus = getMarketStatus();

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
                  <div className={`w-3 h-3 rounded-full ${
                    marketStatus === 'OPEN' && isLive ? 'bg-green-400 animate-pulse' : 
                    marketStatus === 'OPEN' && !isLive ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-lg font-normal text-gray-300">
                    {marketStatus === 'OPEN' && isLive ? 'LIVE MARKET' : 
                     marketStatus === 'OPEN' && !isLive ? 'MARKET PAUSED' :
                     marketStatus === 'PRE_MARKET' ? 'PRE-MARKET' : 'MARKET CLOSED'}
                  </span>
                </div>
              </h1>
              <p className="text-gray-400">
                {marketStatus === 'OPEN' ? 'Real-time Technical Analysis • Live Market Data' : 
                 marketStatus === 'PRE_MARKET' ? 'Technical Analysis • Pre-Market View (Previous Day Data)' :
                 'Technical Analysis • Market Closed'}
              </p>
              <p className="text-gray-500 text-sm">
                Last Update: {lastUpdate.toLocaleTimeString()} • 
                Market Hours: 9:30 AM - 4:00 PM EST
              </p>
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

        {/* Charts */}
        <div className="space-y-8">
          {/* Candlestick Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-green-400" />
                <h2 className="text-2xl font-semibold">Live Price Chart - {selectedTicker}</h2>
              </div>
              <div className="text-sm text-gray-400">
                {marketStatus === 'OPEN' ? 'Live Market Data • Auto-updating every 2s' :
                 marketStatus === 'PRE_MARKET' ? 'Previous Day Complete Data' :
                 'Market Closed • Complete Day Data'}
              </div>
            </div>
            <div className="h-[600px] w-full">
              <canvas ref={candlestickRef} className="w-full h-full"></canvas>
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
                <span className="text-red-400">Overbought: 70+</span>
                <span className="text-green-400">Oversold: 30-</span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <canvas ref={rsiRef} className="w-full h-full"></canvas>
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
              <canvas ref={macdRef} className="w-full h-full"></canvas>
            </div>
          </div>
        </div>
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
            
            {hoverInfo.type === 'rsi' && (
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
            
            {hoverInfo.type === 'macd' && (
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
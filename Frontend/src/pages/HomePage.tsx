import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Bot, User, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import './HomePage.css';

// --- Interfaces ---
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  exchange?: string;
  country?: string;
}

interface NewsItem {
  title: string;
  source: string;
  time: string;
  image: string;
  url: string;
  description?: string;
  content?: string;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

interface PortfolioData {
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  holdings: Array<{
    symbol: string;
    shares: number;
    buyPrice: number;
  }>;
}

const HomePage: React.FC = () => {
  // CONNECTION TO YOUR BACKEND SERVER
  const BACKEND_URL = 'http://localhost:5000/api';

  // INITIAL STATE: Default Indian Portfolio
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    currentValue: 0,
    previousValue: 0,
    change: 0,
    changePercent: 0,
    holdings: [
      { symbol: 'RELIANCE', shares: 10, buyPrice: 2400 }, // Reliance Industries
      { symbol: 'TCS', shares: 5, buyPrice: 3500 },      // Tata Consultancy Services
      { symbol: 'INFY', shares: 20, buyPrice: 1400 },    // Infosys
      { symbol: 'TATAMOTORS', shares: 50, buyPrice: 600 } // Tata Motors
    ]
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      // Fetch all data in parallel
      await Promise.all([
        updatePortfolioValue(portfolioData),
        fetchMarketData(),
        fetchNews()
      ]);
    } catch (error) {
      console.error("Init failed", error);
      setApiError("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. Fetch Portfolio Data from Backend ---
  const updatePortfolioValue = async (portfolio: PortfolioData) => {
    try {
      const symbols = portfolio.holdings.map(h => h.symbol);
      
      const response = await fetch(`${BACKEND_URL}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });

      if (!response.ok) throw new Error('Backend fetch failed');

      const priceData = await response.json();
      
      // Create a map for quick price lookups
      const priceMap = new Map();
      priceData.forEach((item: any) => {
        priceMap.set(item.symbol, item.price);
      });

      let totalValue = 0;
      portfolio.holdings.forEach(holding => {
        // Use live price, or fallback to buyPrice if API fails for that stock
        const currentPrice = priceMap.get(holding.symbol) || holding.buyPrice;
        totalValue += currentPrice * holding.shares;
      });

      // Calculate mock previous value for daily change simulation
      const previousValue = portfolio.previousValue || totalValue * 0.99; 
      const change = totalValue - previousValue;
      const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

      const updatedPortfolio = {
        ...portfolio,
        currentValue: totalValue,
        previousValue: previousValue,
        change,
        changePercent
      };

      setPortfolioData(updatedPortfolio);
      generatePortfolioChart(updatedPortfolio);

    } catch (err) {
      console.error('Portfolio update failed:', err);
      setApiError("Is the backend server running?");
    }
  };

  // --- 2. Fetch Dynamic Market Data (Gainers/Losers) ---
  const fetchMarketData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/market`);
      if (!response.ok) throw new Error('Backend fetch failed');
      
      const data = await response.json();
      
      setTopGainers(data.gainers || []);
      setTopLosers(data.losers || []);
      
    } catch (err) {
      console.error("Market data fetch failed", err);
      // We don't block the UI if just market data fails
    }
  };

  const fetchNews = async () => {
    // Static Indian News Data
    const newsData: NewsItem[] = [
      {
        title: 'Sensex hits all-time high led by banking stocks',
        source: 'LiveMint',
        time: '2h ago',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
        url: '#',
        description: 'Indian benchmark indices scaled new peaks today...',
        content: 'The BSE Sensex crossed the 75,000 mark for the first time...'
      },
      {
        title: 'RBI keeps repo rate unchanged at 6.5%',
        source: 'Economic Times',
        time: '4h ago',
        image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=200&fit=crop',
        url: '#',
        description: 'The Monetary Policy Committee decided to maintain status quo.',
        content: 'RBI Governor announced that the policy rate will remain unchanged...'
      }
    ];
    setNews(newsData);
  };

  const generatePortfolioChart = (portfolio: PortfolioData) => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    const startValue = portfolio.previousValue || portfolio.currentValue * 0.95;
    const endValue = portfolio.currentValue;
    const points = 50;

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const time = new Date(now.getTime() - (points - i - 1) * 10 * 60000);
      const hour = time.getHours();
      let timeLabel = '';
      if (i % 10 === 0) {
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour % 12 || 12;
        timeLabel = `${displayHour} ${ampm}`;
      }
      const volatility = (Math.random() - 0.5) * (endValue - startValue) * 0.1;
      const value = startValue + (endValue - startValue) * progress + volatility;
      data.push({ time: timeLabel, value: Math.max(0, value) });
    }
    setChartData(data);
  };

  const StockItem: React.FC<{ stock: StockData }> = ({ stock }) => (
    <div className="stock-item">
      <div className="stock-item-left">
        <div className={`stock-icon ${stock.change >= 0 ? 'positive' : 'negative'}`}>
          {stock.symbol.substring(0, 2)}
        </div>
        <div className="stock-info">
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-name">{stock.name}</div>
        </div>
      </div>
      <div className="stock-item-right">
        {/* UPDATED: Rupee Symbol & Indian Number Formatting */}
        <div className="stock-price">
          ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
        <div className={`stock-percent ${stock.change >= 0 ? 'positive' : 'negative'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <div className="loading-text">Loading Indian Markets...</div>
          <div className="loading-subtext">Connecting to Server...</div>
        </div>
      </div>
    );
  }

  const isNewUser = portfolioData.currentValue === 0;

  return (
    <div className="dashboard">
      <div className="header">
        <div className="header-greeting">Hello, Investor</div>
        <h1 className="header-title">Dashboard</h1>
        {apiError && (
          <div className="api-error-banner">
             ⚠️ {apiError}
             <button className="retry-btn" onClick={() => window.location.reload()}>
               <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search stocks (e.g. RELIANCE)..." className="search-input" />
        </div>
      </div>

      <div className="portfolio-section">
        <div className="portfolio-card">
          <div className="portfolio-label">Portfolio value</div>
          <div className="portfolio-value">
            {/* UPDATED: Rupee Symbol */}
            ₹{portfolioData.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          {!isNewUser && (
            <div className={`portfolio-change ${portfolioData.change >= 0 ? 'positive' : 'negative'}`}>
              {portfolioData.change >= 0 ? '+' : ''}₹{Math.abs(portfolioData.change).toLocaleString('en-IN', { maximumFractionDigits: 2 })} 
              ({portfolioData.change >= 0 ? '+' : ''}{portfolioData.changePercent.toFixed(2)}%) Today
            </div>
          )}
          
          {!isNewUser && chartData.length > 0 && (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#fff" strokeOpacity={0.5} tick={{ fill: '#fff', fontSize: 10 }} tickLine={false} />
                  <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e40af', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Value']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs">
          <button onClick={() => setActiveTab('gainers')} className={`tab ${activeTab === 'gainers' ? 'active' : ''}`}>
            <TrendingUp size={16} className="tab-icon" />
            Top Gainers
          </button>
          <button onClick={() => setActiveTab('losers')} className={`tab ${activeTab === 'losers' ? 'active' : ''}`}>
            <TrendingDown size={16} className="tab-icon" />
            Top Losers
          </button>
        </div>
      </div>

      <div className="stocks-section">
        <div className="stocks-card">
          {activeTab === 'gainers' && topGainers.length > 0 ? (
            topGainers.map((stock) => <StockItem key={stock.symbol} stock={stock} />)
          ) : activeTab === 'losers' && topLosers.length > 0 ? (
            topLosers.map((stock) => <StockItem key={stock.symbol} stock={stock} />)
          ) : (
            <div className="no-data">
              {apiError ? 'Check Backend Connection' : 'No dynamic market data available'}
            </div>
          )}
        </div>
      </div>

      <div className="news-section">
        <h2 className="news-title">Market News</h2>
        {news.map((item, index) => (
            <div key={index} onClick={() => setSelectedNews(item)} className="news-item clickable">
              <img src={item.image} alt={item.title} className="news-image" />
              <div className="news-content">
                <h3 className="news-headline">{item.title}</h3>
                <div className="news-meta">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
        ))}
      </div>
      
      {/* News Modal */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <button className="news-modal-close" onClick={() => setSelectedNews(null)}>
                ✕
              </button>
            </div>
            <img src={selectedNews.image} alt={selectedNews.title} className="news-modal-image" />
            <div className="news-modal-content">
              <div className="news-modal-meta">
                <span className="news-modal-source">{selectedNews.source}</span>
                <span>•</span>
                <span className="news-modal-time">{selectedNews.time}</span>
              </div>
              <h1 className="news-modal-title">{selectedNews.title}</h1>
              {selectedNews.description && (
                <p className="news-modal-description">{selectedNews.description}</p>
              )}
              {selectedNews.content && (
                <div className="news-modal-body">
                  {selectedNews.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
              {selectedNews.url !== '#' && (
                <a 
                  href={selectedNews.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="news-modal-link"
                >
                  Read full article →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-item active"><Home size={24} /><span className="nav-label">Home</span></button>
        <button className="nav-item"><Bot size={24} /><span className="nav-label">AI Chat</span></button>
        <button className="nav-item"><User size={24} /><span className="nav-label">Profile</span></button>
      </nav>
    </div>
  );
};

export default HomePage;
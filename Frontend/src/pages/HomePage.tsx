import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Bot, User } from 'lucide-react';
import Home from './Home';
import Chatbot from './Chatbot';
import Profile from './Profile';
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
  const BACKEND_URL = 'http://localhost:3001/api';

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
  const [activeScreen, setActiveScreen] = useState<'home' | 'chat' | 'profile'>('home');

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

  return (
    <div className="dashboard">
      {/* Conditional Screen Rendering */}
      {activeScreen === 'home' && (
        <Home
          portfolioData={portfolioData}
          chartData={chartData}
          topGainers={topGainers}
          topLosers={topLosers}
          news={news}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedNews={selectedNews}
          setSelectedNews={setSelectedNews}
          apiError={apiError}
        />
      )}
      
      {activeScreen === 'chat' && <Chatbot />}
      
      {activeScreen === 'profile' && <Profile />}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeScreen === 'home' ? 'active' : ''}`}
          onClick={() => setActiveScreen('home')}
        >
          <HomeIcon size={24} />
          <span className="nav-label">Home</span>
        </button>
        <button 
          className={`nav-item ${activeScreen === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveScreen('chat')}
        >
          <Bot size={24} />
          <span className="nav-label">AI Chat</span>
        </button>
        <button 
          className={`nav-item ${activeScreen === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveScreen('profile')}
        >
          <User size={24} />
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
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
    name?: string; // Added name for display
  }>;
}

// --- API KEYS ---
// GNews Key (Keep as is)
const GNEWS_KEY = '3fdcb86666e1eeb08c7611a418bc3d9e';

const HomePage: React.FC = () => {
  // INITIAL STATE: Default Indian Portfolio
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    currentValue: 0,
    previousValue: 0,
    change: 0,
    changePercent: 0,
    holdings: [
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries', shares: 10, buyPrice: 2400 },
      { symbol: 'TCS.NS', name: 'Tata Consultancy Svc', shares: 5, buyPrice: 3500 },
      { symbol: 'INFY.NS', name: 'Infosys', shares: 20, buyPrice: 1400 },
      { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', shares: 50, buyPrice: 600 }
    ]
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [niftyData, setNiftyData] = useState<StockData | null>(null);
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
      await Promise.all([
        updatePortfolioValue(portfolioData),
        fetchMarketData(),
        fetchNews()
      ]);
    } catch (error) {
      console.error("Init failed", error);
      setApiError("Failed to fetch live data. Using cached/demo data.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch data from Yahoo Finance via CORS Proxy
  const fetchYahooData = async (symbol: string) => {
    try {
      // Using corsproxy.io to bypass CORS for Yahoo Finance
      const response = await fetch(`https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`);
      const data = await response.json();
      const result = data.chart.result[0];

      // Process chart data if available
      let chartPoints: ChartDataPoint[] = [];
      if (result.timestamp && result.indicators.quote[0].close) {
        chartPoints = result.timestamp.map((time: number, index: number) => {
          const val = result.indicators.quote[0].close[index];
          if (!val) return null;
          const date = new Date(time * 1000);
          return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: val
          };
        }).filter((p: any) => p !== null);
      }

      return {
        price: result.meta.regularMarketPrice,
        previousClose: result.meta.chartPreviousClose,
        change: result.meta.regularMarketPrice - result.meta.chartPreviousClose,
        changePercent: ((result.meta.regularMarketPrice - result.meta.chartPreviousClose) / result.meta.chartPreviousClose) * 100,
        chartData: chartPoints
      };
    } catch (error) {
      console.warn(`Failed to fetch ${symbol}`, error);
      return null;
    }
  };

  // --- 1. Fetch Portfolio Data (Yahoo Finance) ---
  const updatePortfolioValue = async (portfolio: PortfolioData) => {
    try {
      let totalValue = 0;
      let previousTotalValue = 0;

      await Promise.all(portfolio.holdings.map(async (holding) => {
        const data = await fetchYahooData(holding.symbol);

        const currentPrice = data?.price || holding.buyPrice;
        const previousClose = data?.previousClose || holding.buyPrice;

        totalValue += currentPrice * holding.shares;
        previousTotalValue += previousClose * holding.shares;

        return holding;
      }));

      const change = totalValue - previousTotalValue;
      const changePercent = previousTotalValue > 0 ? (change / previousTotalValue) * 100 : 0;

      const updatedPortfolio = {
        ...portfolio,
        currentValue: totalValue,
        previousValue: previousTotalValue,
        change,
        changePercent
      };

      setPortfolioData(updatedPortfolio);
      // generatePortfolioChart(updatedPortfolio); // Removed portfolio chart generation

    } catch (err) {
      console.error('Portfolio update failed:', err);
      // setApiError("Check API Keys");
    }
  };

  // --- 2. Fetch Dynamic Market Data (Yahoo Finance) ---
  const fetchMarketData = async () => {
    // 1. Fetch Nifty 50 Data
    const nifty = await fetchYahooData('%5ENSEI');
    if (nifty) {
      setNiftyData({
        symbol: 'NIFTY 50',
        name: 'Nifty 50',
        price: nifty.price,
        change: nifty.change,
        changePercent: nifty.changePercent
      });
      if (nifty.chartData && nifty.chartData.length > 0) {
        setChartData(nifty.chartData);
      }
    }

    // 2. Fetch Watchlist
    const popularStocks = [
      { symbol: 'RELIANCE.NS', name: 'Reliance' },
      { symbol: 'TCS.NS', name: 'TCS' },
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
      { symbol: 'INFY.NS', name: 'Infosys' },
      { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
      { symbol: 'SBIN.NS', name: 'SBI' },
      { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
      { symbol: 'ITC.NS', name: 'ITC' },
      { symbol: 'TATAMOTORS.NS', name: 'Tata Motors' },
      { symbol: 'LT.NS', name: 'L&T' }
    ];

    try {
      const stockPromises = popularStocks.map(async (stock) => {
        const data = await fetchYahooData(stock.symbol);
        if (!data) return null;

        return {
          symbol: stock.symbol.replace('.NS', ''), // Clean symbol
          name: stock.name,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          exchange: 'NSE',
          country: 'IN'
        } as StockData;
      });

      const results = (await Promise.all(stockPromises)).filter(s => s !== null && s.price > 0) as StockData[];

      // Sort by change percent
      const sorted = [...results].sort((a, b) => b.changePercent - a.changePercent);

      setTopGainers(sorted.filter(s => s.changePercent > 0).slice(0, 5));
      setTopLosers([...sorted].reverse().filter(s => s.changePercent < 0).slice(0, 5));

    } catch (err) {
      console.error("Market data fetch failed", err);
    }
  };

  // --- 3. Fetch News (GNews) ---
  const fetchNews = async () => {
    try {
      // Free tier: q=india AND (business OR economy)
      const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=in&max=5&apikey=${GNEWS_KEY}`);

      if (!response.ok) throw new Error('News fetch failed');

      const data = await response.json();

      if (data.articles) {
        const newsItems: NewsItem[] = data.articles.map((article: any) => ({
          title: article.title,
          source: article.source.name,
          time: new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          image: article.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          url: article.url,
          description: article.description,
          content: article.content
        }));
        setNews(newsItems);
      }
    } catch (err) {
      console.error("News fetch failed", err);
      // Fallback to static if API fails
      const fallbackNews: NewsItem[] = [
        {
          title: 'Market hits fresh record high; Sensex crosses 75k',
          source: 'LiveMint',
          time: '2h ago',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          url: '#',
          description: 'Indian benchmark indices scaled new peaks today...',
          content: 'The BSE Sensex crossed the 75,000 mark for the first time...'
        }
      ];
      setNews(fallbackNews);
    }
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
          <div className="loading-text">Loading Market Data...</div>
          <div className="loading-subtext">Fetching live prices...</div>
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
          niftyData={niftyData}
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
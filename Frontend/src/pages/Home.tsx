import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import './HomePage.css';
import './home.css';

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

interface HomeProps {
  portfolioData: PortfolioData;
  chartData: ChartDataPoint[];
  topGainers: StockData[];
  topLosers: StockData[];
  news: NewsItem[];
  activeTab: 'gainers' | 'losers';
  setActiveTab: (tab: 'gainers' | 'losers') => void;
  selectedNews: NewsItem | null;
  setSelectedNews: (news: NewsItem | null) => void;
  apiError: string | null;
  niftyData: StockData | null;
}

const Home: React.FC<HomeProps> = ({
  chartData,
  topGainers,
  topLosers,
  news,
  activeTab,
  setActiveTab,
  selectedNews,
  setSelectedNews,
  apiError,
  niftyData
}) => {
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
        <div className="stock-price">
          ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
        <div className={`stock-percent ${stock.change >= 0 ? 'positive' : 'negative'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );

  return (
    <>
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
          <div className="portfolio-label">NIFTY 50</div>
          {niftyData ? (
            <>
              <div className="portfolio-value">
                ₹{niftyData.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className={`portfolio-change ${niftyData.change >= 0 ? 'positive' : 'negative'}`}>
                {niftyData.change >= 0 ? '+' : ''}₹{Math.abs(niftyData.change).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                ({niftyData.change >= 0 ? '+' : ''}{niftyData.changePercent.toFixed(2)}%) Today
              </div>
            </>
          ) : (
            <div className="portfolio-value">Loading...</div>
          )}

          {chartData.length > 0 && (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#fff" strokeOpacity={0.5} tick={{ fill: '#fff', fontSize: 10 }} tickLine={false} minTickGap={30} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e40af', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Price']}
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
    </>
  );
};

export default Home;

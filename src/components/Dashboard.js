import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StockChart from './StockChart';
import OrderForm from './OrderForm';
import PortfolioSummary from './PortfolioSummary';

function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState({
    AAPL: { shares: 10, avgPrice: 145.30 },
    MSFT: { shares: 5, avgPrice: 250.10 }
  });

  return (
    <div className="dashboard">
      <h2>Welcome, {currentUser.email}</h2>
      <div className="dashboard-grid">
        <StockChart symbol={selectedStock} />
        <OrderForm 
          symbol={selectedStock} 
          balance={balance}
          portfolio={portfolio}
          setBalance={setBalance}
          setPortfolio={setPortfolio}
        />
        <PortfolioSummary portfolio={portfolio} balance={balance} />
      </div>
    </div>
  );
}

export default Dashboard;
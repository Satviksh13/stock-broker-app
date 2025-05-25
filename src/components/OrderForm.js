import React, { useState } from 'react';

function OrderForm({ symbol, balance, portfolio, setBalance, setPortfolio }) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState(150.50);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to your backend
    const totalCost = quantity * price;
    
    if (totalCost > balance) {
      alert('Insufficient funds');
      return;
    }

    setBalance(prev => prev - totalCost);
    setPortfolio(prev => ({
      ...prev,
      [symbol]: {
        shares: (prev[symbol]?.shares || 0) + quantity,
        avgPrice: prev[symbol] 
          ? ((prev[symbol].avgPrice * prev[symbol].shares) + totalCost) / 
             (prev[symbol].shares + quantity)
          : price
      }
    }));

    alert(`Order executed: ${quantity} shares of ${symbol} at $${price.toFixed(2)}`);
  };

  return (
    <div className="order-form">
      <h3>Trade {symbol}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Type:</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>
        
        {orderType !== 'market' && (
          <div>
            <label>Price:</label>
            <input 
              type="number" 
              step="0.01" 
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value))} 
            />
          </div>
        )}

        <div>
          <label>Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))} 
          />
        </div>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
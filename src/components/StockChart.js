import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function StockChart({ symbol }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from your backend API
    const fetchData = async () => {
      // Mock data
      const mockData = {
        labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
        datasets: [{
          label: `${symbol} Price`,
          data: Array.from({length: 30}, () => Math.random() * 50 + 150),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      setChartData(mockData);
    };

    fetchData();
  }, [symbol]);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="stock-chart">
      <h3>{symbol} Chart</h3>
      <Line data={chartData} />
    </div>
  );
}

export default StockChart;
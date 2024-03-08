// src/pages/StockPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { stocks } from '../mockData';
import { Card, CardContent, Typography } from '@mui/material';

const StockPage: React.FC = () => {
  // This mimics getting the stock ID from the URL.
  let { id } = useParams<'id'>();

  // Find the stock in the mock data. Default to the first stock if not found.
  const stock = stocks.find(stock => stock.id === id) || stocks[0];

  return (
    <div>
      <Card variant="outlined" style={{ margin: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {stock.name} ({stock.ticker})
          </Typography>
          <Typography color="textSecondary">
            Sector: {stock.sector}
          </Typography>
          <Typography variant="body2" component="p">
            Price: ${stock.price}
          </Typography>
          <Typography variant="body2" component="p" style={{ color: stock.change.startsWith('-') ? 'red' : 'green' }}>
            Change: {stock.change}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPage;

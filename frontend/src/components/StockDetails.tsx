// src/components/StockDetails.tsx
import React from 'react';
import { stocks } from '../mockData';
import { Card, CardContent, Typography } from '@mui/material';

const StockDetails: React.FC = () => {
  const stock = stocks[0]; // Placeholder for dynamic selection

  return (
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
  );
};

export default StockDetails;

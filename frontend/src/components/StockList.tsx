// src/components/StockList.tsx
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Stock } from '../types/types';

interface StockListProps {
  stocks: Stock[];
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  return (
    <List>
      {stocks.map((stock) => (
        <ListItem key={stock.id}>
          <ListItemText primary={`${stock.name} (${stock.ticker})`} secondary={`Price: $${stock.price} | ${stock.change}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default StockList;

// src/components/SearchFilterPanel.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material';

interface SearchFilterPanelProps {
  onSingleSearch: (ticker: string) => void;
  onMassSearch: (sector: string, numberOfStocks: string, sortBy: string) => void;
}


const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({ onSingleSearch, onMassSearch }) => {
    const [ticker, setTicker] = useState('');
    const [sector, setSector] = useState('');
    const [numberOfStocks, setNumberOfStocks] = useState('');
    const [sortBy, setSortBy] = useState('');

    return (
        <Box display="flex" flexDirection="column" gap={2} margin={2}>
            <TextField
                label="Ticker Symbol"
                variant="outlined"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                fullWidth
            />
            <Button variant="contained" onClick={() => onSingleSearch(ticker)}>Lookup Stock</Button>
            
            <FormControl variant="outlined" fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as string)}
                    label="Sector"
                >
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                </Select>
            </FormControl>
            
            <TextField
                label="Number of Stocks"
                type="number"
                variant="outlined"
                value={numberOfStocks}
                onChange={(e) => setNumberOfStocks(e.target.value)}
                fullWidth
            />
            
            <FormControl variant="outlined" fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as string)}
                    label="Sort By"
                >
                    <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
                    <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
                </Select>
            </FormControl>
            
            <Button variant="contained" onClick={() => onMassSearch(sector, numberOfStocks, sortBy)}>Mass Search</Button>
        </Box>
    );
};

export default SearchFilterPanel;

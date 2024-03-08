// src/pages/PredictionsPage.tsx
// import React, { useState } from 'react';
// import { Stock } from '../types/types';
// import { stocks } from '../mockData'; // Ensure this is correctly imported

const HomePage: React.FC = () => {
    // const [searchResults, setSearchResults] = useState<Stock[]>([]);

    // const handleSingleSearch = (ticker: string) => {
    //     const result = stocks.filter(stock => stock.ticker.toLowerCase() === ticker.toLowerCase());
    //     setSearchResults(result);
    // };

    // const handleMassSearch = (sector: string, numberOfStocks: string, sortBy: string) => {
    //     const limit = parseInt(numberOfStocks, 10) || 0; // Convert to number; use 0 or another default if parsing fails

    //     let results = stocks.filter(stock => stock.sector === sector);

    //     if (sortBy === "Price: Low to High") {
    //         results.sort((a, b) => a.price - b.price);
    //     } else if (sortBy === "Price: High to Low") {
    //         results.sort((a, b) => b.price - a.price);
    //     }

    //     results = results.slice(0, limit);
    //     setSearchResults(results);
    // };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
                {/* Placeholder for single stock information */}
                <div style={{ width: '75%', paddingRight: '20px', boxSizing: 'border-box' }}>
                    <div style={{ background: '#16213e', borderRadius: '10px', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
                        {/* Placeholder content */}
                        <p>Single Stock Information Placeholder</p>
                    </div>
                </div>
                {/* Placeholder for Daily Top Movers */}
                <div style={{ width: '25%', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
                    <div style={{ background: '#16213e', borderRadius: '10px', padding: '20px', boxSizing: 'border-box' }}>
                        <p>Daily Top Movers Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
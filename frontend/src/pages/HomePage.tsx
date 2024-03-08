// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { stocks } from '../mockData'; // Ensure this is correctly imported
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartOptions, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';

const hostName = "https://skysupply.live";
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

    type Bar = {
        ticker: string;
        name: string;
        c: number; // Close price
        h: number; // High price
        l: number; // Low price
        o: number; // Open price
        t: string;  // Timestamp
        v: number;  // Volume
        vw: number; // Volume weighted average price
        p: number; // Change in price
    };

    interface StockDetails {
        name: string;
        ticker: string;
        sector: string;
        price: number;
        change: string;
    }     

    interface NewsItem {
        author: string;
        content: string;
        created_at: string;
        headline: string;
        id: number;
        images: { size: string; url: string; }[];
        source: string;
        summary: string;
        symbols: string[];
        updated_at: string;
        url: string;
    }
    

    // This mimics getting the stock ID from the URL.
    let { id } = useParams<'id'>();

    // Find the stock in the mock data. Default to the first stock if not found.
    const stock = stocks.find(stock => stock.id === id) || stocks[0];


    function formatDate(date: Date): string {
        // Adjust the date to the previous day
        date.setDate(date.getDate() - 1);
    
        // If the day is Saturday (6) or Sunday (0), adjust to Friday
        if (date.getDay() === 0) {
            // If it's Sunday, go back 2 days to get to Friday
            date.setDate(date.getDate() - 2);
        } else if (date.getDay() === 6) {
            // If it's Saturday, go back 1 day to get to Friday
            date.setDate(date.getDate() - 1);
        }
    
        const day = date.getDate();
        const daySuffix = ((day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        })(day);
    
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        const weekDay = weekDays[date.getDay()];
        const month = months[date.getMonth()];
    
        return `${weekDay}, ${month} ${day}${daySuffix}`;
    }

    const [loadingStockData, setLoadingStockData] = useState(true);
    const [loadingPredictionData, setLoadingPredictionData] = useState(true);
    
    async function callGetPrice(ticker :string) {
        try {
        setLoadingStockData(true); // Start loading
        const priceResponse = await fetch(`${hostName}/qstock/getPrice?ticker=${ticker}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/content-json' },
            });
        if (!priceResponse.ok) throw new Error(`Price response not ok, status ${priceResponse.status}`);
        return await priceResponse.json();
        } catch (error) {
            console.error('There was a problem with fetch operations:', error);
            setLoadingStockData(false); // Ensure loading is stopped in case of error
        } finally {
            setLoadingStockData(false); // Stop loading after fetching and processing, or if there's an error
        }
    
    }

    const [stockData, setStockData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });
    const [topMovers, setTopMovers] = useState<Bar[]>(); // Use your actual state initialization
    const [stockNews, setStockNews] = useState<NewsItem[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [currentStock, setCurrentStock] = useState<StockDetails>({
        name: '',
        ticker: '',
        sector: '',
        price: 0,
        change: '',
    });
    const [predictionData, setPredictionData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });
    


    // Define a function to fetch prediction data from your Flask API
    async function fetchPredictionData(ticker: string) {
        try {
            setLoadingPredictionData(true); // Start loading
            // const response = await fetch(`${hostName}/predict`, {
            const response = await fetch(`${hostName}/predict`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*'},
                body: JSON.stringify({ symbol: ticker }), // Adjust based on your Flask API's expected input
            });
            // if (!response.ok) throw new Error(`Prediction response not ok, status ${response.status}`);
            // const data = dummyPredictionData; // Simulate fetching data
            const data = await response.json();
            // Process the prediction data to fit into the Chart.js format if necessary
            const processedData = {
                labels: data?.forecast?.map((entry: any) => new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric', // Use '2-digit' for two-digit year
                    month: '2-digit', // 'short' for abbreviated month name, 'long' for full month name
                    day: '2-digit', // '2-digit' for two-digit day
                })),
                
                datasets: [
                    {
                        label: `${ticker} Prediction`,
                        data: data?.forecast?.map((entry :any) => entry.price), // Assuming 'prediction' is an array of values
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                    },
                ],
            };
            
            setPredictionData(processedData);
        } catch (error) {
            setLoadingPredictionData(false); // Done loading
            console.error('There was a problem fetching prediction data:', error);
        } finally {
            setLoadingPredictionData(false); // Ensure loading is stopped in case of error
        }
    }



    // This function now fetches both price data and news data for a given stock ticker
    const handleCardClick = async (ticker: string) => {
        try {
            // Fetching stock price data
            const priceData = await callGetPrice(ticker)

            // Set stock price data to state (assuming you have a state for this)
            // Update your state with the fetched price data

            setCurrentStock({
                name: priceData.name, // Update with actual property name
                ticker: priceData.symbol,
                sector: priceData.sector, // Update with actual property name
                price: priceData.close, // This is an example. Replace with actual property name
                change: priceData.change, // This is an example. Replace with actual property name
            });

            const parsedData = {
                labels: priceData.bars.map((bar: Bar) => new Date(bar.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
                datasets: [
                    {
                        label: `${ticker} Price`,
                        data: priceData.bars.map((bar: Bar) => bar.c),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            };
            setStockData(parsedData);
            fetchPredictionData(ticker);
            
        } catch (error) {
            console.error('There was a problem with fetch operations:', error);
        }
    };
    
    useEffect(() => {
        
        const populateFirstRenderFetch = async (ticker: string) => {
            try {
                const priceData = await callGetPrice(ticker);
                if (priceData && priceData.bars) { // Check if priceData and priceData.bars exist
                    setCurrentStock({
                        name: priceData.name, // Update with actual property name
                        ticker: priceData.symbol,
                        sector: priceData.sector, // Update with actual property name
                        price: priceData.close, // This is an example. Replace with actual property name
                        change: priceData.change, // This is an example. Replace with actual property name
                    });
                    const parsedData = {
                        labels: priceData.bars.map((bar: Bar) => new Date(bar.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
                        datasets: [
                            {
                                label: `${ticker} Price`,
                                data: priceData.bars.map((bar: Bar) => bar.c),
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                            },
                        ],
                    };
                    setStockData(parsedData);
                    fetchPredictionData(ticker);
                }
        
                // Fetching stock news data (Ensure news data is also checked)
                const newsResponse = await fetch(`${hostName}/qstock/getNews?ticker=${ticker}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!newsResponse.ok) throw new Error(`News response not ok, status ${newsResponse.status}`);
                const newsJson = await newsResponse.json();
                if (newsJson && newsJson.news) { // Check if newsJson and newsJson.news exist
                    setStockNews(newsJson.news); // Assuming the news is directly under the "news" key
                }
            } catch (error) {
                console.error('There was a problem with fetch operations:', error);
            }
        };
        
        const fetchTopMovers = async () => {
            try {
                const response = await fetch(`${hostName}/qstock/getTopMovers`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status ${response.status}`);
                }
                const movers: Bar[] = await response.json();
                setTopMovers(movers);
            } catch (error) {
                console.error('There was a problem fetching top movers:', error);
            }
        };
        populateFirstRenderFetch('AAPL');
        fetchTopMovers();
    }, []);


    const options: ChartOptions<'line'> = {
        maintainAspectRatio: false, // Ensure the chart stretches in both dimensions
        responsive: true, // Ensure chart responsiveness is enabled
        scales: {
            x: {
                time: {
                    unit: 'minute',
                    parser: 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'',
                    displayFormats: {
                        minute: 'h:mm a'
                    },
                },
                grid: {
                    display: false,
                },
                ticks: {
                    source: 'auto',
                    autoSkip: false,
                    maxRotation: 0,
                    maxTicksLimit: 20,
                },
            },
            y: {
                beginAtZero: false,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
    };
    

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '20px', height: 'calc(100vh - 40px)' }}>
                {/* Container for Stock Information (Left Side) */}
                <div style={{ width: '75%', display: 'flex', flexDirection: 'column', paddingRight: '20px', height: '100%' }}>
                    {/* First Placeholder for single stock information */}
                    <div style={{ background: '#0f3460', borderRadius: '10px', padding: '20px', boxSizing: 'border-box', marginBottom: '20px', flex: 1 }}>
                        {/* Placeholder content */}
                        <Typography variant="h4" component="h2"> Stock Data for {formatDate(new Date())}</Typography>
                        <Card variant="outlined" style={{ margin: '20px' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {currentStock.name} ({currentStock.ticker})
                                </Typography>
                                <Typography color="textSecondary">
                                    Sector: {currentStock.sector}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Price: ${currentStock?.price?.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" component="p" style={{ color: currentStock?.change?.startsWith('-') ? 'red' : 'green' }}>
                                    Change: {currentStock.change}
                                </Typography>
                                {/* Stock Line Graph */}
                                <div style={{ height: '300px', position: 'relative' }}>
                                    {loadingStockData ? (
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <CircularProgress />
                                        </div>
                                    ) : (
                                        <Line data={stockData} options={options} />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Second Placeholder for single stock information */}
                    <div style={{ background: '#0f3460', borderRadius: '10px', padding: '20px', boxSizing: 'border-box', flex: 1 }}>
                        {/* Placeholder content */}
                        <Typography variant="h4" component="h2">Prediction Forecast for {currentStock.name}</Typography>
                        <Card variant="outlined" style={{ margin: '20px' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {currentStock.name} ({currentStock.ticker})
                                </Typography>
                                <Typography color="textSecondary">
                                    Sector: {currentStock.sector}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Price: ${currentStock.price}
                                </Typography>
                                <Typography variant="body2" component="p" style={{ color: stock.change.startsWith('-') ? 'red' : 'green' }}>
                                    Change: {currentStock.change}
                                </Typography>
                                {/* Stock Line Graph */}
                                <div style={{ height: '300px', position: 'relative' }}>
                                    {loadingStockData ? (
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <CircularProgress />
                                        </div>
                                    ) : (
                                        <Line data={predictionData} options={options} />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Container for Daily Top Movers (Right Side) */}
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', marginBottom: '20px', flex: 1 }}>
                    
                    {/* Search Bar - Positioned Outside and Between the Two Containers */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 20px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search stock (ticker)..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && searchInput) {
                                    handleCardClick(searchInput.toUpperCase()); // Ensure ticker is uppercase
                                }
                            }}
                            style={{
                                width: 'calc(100% - 40px)',
                                padding: '15px',
                                borderRadius: '5px',
                                border: '2px solid #ffffff50',
                                backgroundColor: '#0e1a2b',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                            }}
                        />
                    </div>


                    {/* Header for Stock News */}
                    <Typography variant="h4" component="h2" style={{ padding: '20px', background: '#16213e', borderRadius: '10px 10px 0 0' }}>Latest News</Typography>

                    {/* Scrollable List for Stock News */}
                    <div style={{ flex: 1, overflowY: 'auto', background: '#16213e', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '20px', paddingTop: 0 }}>
                        {stockNews.length > 0 ? (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {stockNews.map((newsItem, index) => (
                                    <li key={index} style={{ marginBottom: '15px' }}>
                                        <Typography variant="h6" component="h3">
                                            <a href={newsItem.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'cyan' }}>
                                                {newsItem.headline}
                                            </a>
                                        </Typography>
                                        <Typography variant="body1" style={{ color: '#ddd' }}>
                                            {newsItem.summary}
                                        </Typography>
                                        {/* Optionally display the author and created_at date here */}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body1">No news available.</Typography>
                        )}
                    </div>


                    {/*  */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 20px', marginBottom: '10px' }}>
                        
                    </div>


                    {/* Second Placeholder for Daily Top Movers */}
                    <Typography variant="h4" component="h2" style={{ padding: '20px', background: '#16213e', borderRadius: '10px 10px 0 0' }}>Top Movers</Typography>
                    <div style={{ flex: 1, overflowY: 'auto', background: '#16213e', borderRadius: '10px', padding: '20px' }}>
                        {topMovers?.map((stock, index) => (
                            <Card key={index} variant="outlined" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => handleCardClick(stock.ticker)}>
                                <CardContent style={{ width: '50%' }}>
                                    <Typography variant="h5" component="div">
                                        {stock.name} ({stock.ticker})
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Close Price: ${stock.c.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <Box style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <Typography variant="h4" component="p" style={{ color: stock.p < 0 ? 'red' : 'green' }}>
                                        {stock.p > 0 && '+'}{stock.p.toFixed(2)}%
                                    </Typography>
                                </Box>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );        
};

export default HomePage;

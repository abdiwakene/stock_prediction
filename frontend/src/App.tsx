// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StockPage from './pages/StockPage';
import PredictionsPage from './pages/PredictionsPage';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quicksearch" element={<StockPage />} />
        <Route path="/stock/:id" element={<StockPage />} />
        <Route path="/predictions" element={<PredictionsPage/>} />
      </Routes>
    </Router>
  );
};

export default App;

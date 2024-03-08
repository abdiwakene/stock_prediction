import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Ensure Link is also imported for the home link

const NavigationBar: React.FC = () => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', background: '#0f3460', padding: '10px 20px', color: 'white' }}>
            {/* This div will automatically be centered due to the justifyContent: 'center' in the nav style */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white', marginRight: '20px', fontWeight: 'bold' }}>Stock Prediction Tool</Link>
            </div>
        </nav>
    );
};


export default NavigationBar;


import React from 'react';
import './Header.css';
import logo from '../../../assets/logo_icon.png';

const Header = () => {
  return (
    <header className="bg-dark p-4 py-1">
      <div className="d-flex align-items-center">
        <img src={logo} alt="GymTM Logo" className="logo-image ms-2 me-2" />
        <h3 className="text-white mb-0">GymTM</h3>
      </div>
    </header>
  );
};

export default Header;
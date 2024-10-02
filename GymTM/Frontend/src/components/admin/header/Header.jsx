import React, { useEffect, useState, useContext } from 'react';
import './Header.css';
import logo from '../../../assets/logo_icon.png';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <header className="bg-dark p-4 py-2">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img src={logo} alt="GymTM Logo" className="logo-image ms-2 me-2" />
          <h1 className="text-white mb-0">GymTM Admin</h1>
        </div>
        <div className="d-flex align-items-center">
          <Button variant="danger" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
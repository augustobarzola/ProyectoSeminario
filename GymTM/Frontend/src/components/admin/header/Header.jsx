import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../../../assets/logo_icon.png';
import { getUserData } from '../../../services/authService';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  return (
    <header className="bg-dark p-4 py-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img src={logo} alt="GymTM Logo" className="logo-image ms-2 me-2" />
          <h3 className="text-white mb-0">GymTM Administración</h3>
        </div>
        <h5 className="text-white mb-0">{user?.nombre_completo} ({user?.rol})</h5>
      </div>
    </header>
  );
};

export default Header;
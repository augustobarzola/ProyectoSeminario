import React from 'react';
import { Spinner } from 'react-bootstrap';
import './CustomSpinner.css';

const CustomSpinner = () => {
  return (
    <div className="spinner-overlay">
      <Spinner animation="border" variant="light" role="status" />
    </div>
  );
};

export default CustomSpinner;
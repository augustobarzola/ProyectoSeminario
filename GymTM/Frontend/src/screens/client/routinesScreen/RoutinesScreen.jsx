import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getData, insertData, updateData, deleteData } from '../../../services/dataService';
import toast from 'react-hot-toast';
import CustomSpinner from '../../../components/customSpinner/CustomSpinner';
import { getUserData } from '../../../services/authService';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const RoutinesScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Container fluid className="py-4">
      <h3 className="text-center">Mis Rutinas</h3>
      <Alert variant="danger" className="text-center"><FontAwesomeIcon icon={faExclamationCircle} /> No se encontraron rutinas.</Alert>
      {isLoading && <CustomSpinner />}
    </Container>
  );
};

export default RoutinesScreen;
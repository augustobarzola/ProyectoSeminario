import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfirmationModalProvider } from './components/confirmationModalProvider/ConfirmationModalProvider';
import CustomSpinner from './components/customSpinner/CustomSpinner';
import ClientHeader from './components/client/header/Header';
import ClientMain from './components/client/main/Main';
import ClientFooter from './components/client/footer/Footer';
import AdminHeader from './components/admin/header/Header';
import AdminMain from './components/admin/main/Main';
import AdminFooter from './components/admin/footer/Footer';
import LoginScreen from './screens/loginScreen/LoginScreen';
import NotFoundScreen from './screens/notFoundScreen/NotFoundScreen';
import PrivateRoute from './routes/privateRoute';

const AdminLayout = () => {
  return (
    <ConfirmationModalProvider>
      <AdminHeader />
      <AdminMain />
      <AdminFooter />
    </ConfirmationModalProvider>
  );
}

const ClientLayout = () => {
  return (
    <ConfirmationModalProvider>
      <ClientHeader />
      <ClientMain />
      <ClientFooter />
    </ConfirmationModalProvider>
  );
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(true);

  // Mientras esperas la respuesta de la autenticación, muestra el Spinner
  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta de login común */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Rutas para la sección administrativa */}
        <Route path="/admin/*" element={<PrivateRoute isAuthenticated={isAdminLoggedIn}><AdminLayout /></PrivateRoute>} />

        {/* Rutas para la sección de clientes */}       
        <Route path="/*" element={<PrivateRoute isAuthenticated={isClientLoggedIn}><ClientLayout /></PrivateRoute>} />

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
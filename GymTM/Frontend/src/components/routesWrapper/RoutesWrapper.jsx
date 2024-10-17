import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../../routes/privateRoute';
import { ConfirmationModalProvider } from '../confirmationModalProvider/ConfirmationModalProvider';
import ClientHeader from '../client/header/Header';
import ClientMain from '../client/main/Main';
import ClientFooter from '../client/footer/Footer';
import AdminHeader from '../admin/header/Header';
import AdminMain from '../admin/main/Main';
import AdminFooter from '../admin/footer/Footer';
import RedirectBasedOnRole from '../redirectBasedOnRole/RedirectBasedOnRole';
import RoleSelectionScreen from '../../screens/roleSelectionScreen/RoleSelectionScreen';

// Layouts
const AdminLayout = () => (
  <ConfirmationModalProvider>
    <AdminHeader />
    <AdminMain />
    <AdminFooter />
  </ConfirmationModalProvider>
);

const ClientLayout = () => (
  <ConfirmationModalProvider>
    <ClientHeader />
    <ClientMain />
    <ClientFooter />
  </ConfirmationModalProvider>
);

const RoutesWrapper = () => {
  return (
    <Routes>
      {/* Rutas */}
      <Route path="/login" element={<RedirectBasedOnRole />} />
      <Route path="/seleccionRol" element={<RoleSelectionScreen />} />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute role="client">
            <ClientLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RoutesWrapper;
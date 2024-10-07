import { adminRoutes } from "./adminRoutes";
import { clientRoutes } from "./clientRoutes";

export const getAccessibleRoutes = (id_rol) => {
  switch (id_rol) {
    case 1: // Administrador
      return adminRoutes; // Acceso completo
    case 2: // Recepcionista
      return adminRoutes.filter(route => route.path === '/' || route.path === '/clientes' || route.path === '/planes' || route.path === '/asistencias' || route.path === '/entrenadores' || route.path === '/perfil');
    case 3: // Entrenador
      return adminRoutes.filter(route => route.path === '/rutinas' || route.path === '/clientes' || route.path === '/perfil');
    case 4: // Cliente
      return clientRoutes;
    default:
      return []; // Sin acceso
  }
};
import { adminRoutes } from "./adminRoutes";
import { clientRoutes } from "./clientRoutes";

export const getAccessibleRoutes = (id_rol) => {
  switch (id_rol) {
    case 1: // Administrador de Sistemas
      return [];
    case 2: // Administrador de Gimnasio
      return adminRoutes; // Acceso completo
    case 3: // Recepcionista
      return adminRoutes.filter(route => route.path === '/clientes' || route.path === '/planes' || route.path === '/asistencias' || route.path === '/entrenadores' || route.path === '/perfil');
    case 4: // Entrenador
      return adminRoutes.filter(route => route.path === '/rutinas' || route.path === '/clientes' || route.path === '/perfil');
    case 5: // Cliente
      return clientRoutes;
    default:
      return []; // Sin acceso
  }
};
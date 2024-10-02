import { faHouse, faUsers, faDumbbell, faRunning, faUser } from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../screens/admin/homeScreen/HomeScreen';
import ClientsScreen from '../screens/admin/clientsScreen/ClientsScreen';
import PlansScreen from '../screens/admin/plansScreen/PlansScreen';
import RoutinesScreen from '../screens/admin/routinesScreen/RoutinesScreen';
import PerfilScreen from '../screens/admin/perfilScreen/PerfilScreen';

export const routes = [
  {
    label: 'Inicio',
    icon: faHouse,
    path: '/',
    element: <HomeScreen />,  
  },
  {
    label: 'Clientes',
    icon: faUsers,
    path: '/clientes',
    element: <ClientsScreen />,  
  },
  {
    label: 'Planes',
    icon: faDumbbell,
    path: '/planes',
    element: <PlansScreen />,  
  },
  {
    label: 'Rutinas',
    icon: faRunning,
    path: '/rutinas',
    element: <RoutinesScreen />,  
  },
  {
    label: 'Perfil',
    icon: faUser,
    path: '/perfil',
    element: <PerfilScreen />,  
  },
];
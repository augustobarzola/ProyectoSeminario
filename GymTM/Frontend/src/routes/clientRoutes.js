import { faHouse, faDumbbell, faUserGear } from '@fortawesome/free-solid-svg-icons';
import RoutinesScreen from '../screens/client/routinesScreen/RoutinesScreen';
import PerfilScreen from '../screens/perfilScreen/PerfilScreen';
import HomeScreen from '../screens/client/homeScreen/HomeScreen';

export const clientRoutes = [
  {
    label: 'Inicio',
    icon: faHouse,
    path: '/',
    element: <HomeScreen />,  
    color: '#3498db', 
  },
  {
    label: 'Rutinas',
    icon: faDumbbell,
    path: '/rutinas',
    element: <RoutinesScreen />,  
    color: '#f1c40f', 
  },
  {
    label: 'Perfil',
    icon: faUserGear,
    path: '/perfil',
    element: <PerfilScreen />,  
    color: '#6c757d', 
  },
];
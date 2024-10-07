import { faChartLine, faCalendarCheck, faDumbbell, faUserPlus, faUserGear, faUsers, faFileInvoice, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import DashboardScreen from '../screens/admin/dashboardScreen/DashboardScreen';
import ClientsScreen from '../screens/admin/clientsScreen/ClientsScreen';
import PlansScreen from '../screens/admin/plansScreen/PlansScreen';
import RoutinesScreen from '../screens/admin/routinesScreen/RoutinesScreen';
import PerfilScreen from '../screens/perfilScreen/PerfilScreen';
import UsersScreen from '../screens/admin/usersScreen/UsersScreen';
import AssistsScreen from '../screens/admin/assistsScreen/AssistsScreen';
import TrainersScreen from '../screens/admin/trainersScreen/TrainersScreen';

export const adminRoutes = [
  {
    label: 'Dashboard',
    icon: faChartLine,
    path: '/',
    element: <DashboardScreen />,  
    color: '#3498db', 
  },
  {
    label: 'Asistencias',
    icon: faCalendarCheck,
    path: '/asistencias',
    element: <AssistsScreen />,  
    color: '#1abc9c', 
  },
  {
    label: 'Clientes',
    icon: faUsers,
    path: '/clientes',
    element: <ClientsScreen />,  
    color: '#2ecc71', 
  },
  {
    label: 'Planes',
    icon: faFileInvoice,
    path: '/planes',
    element: <PlansScreen />,  
    color: '#e74c3c', 
  },
  {
    label: 'Rutinas',
    icon: faDumbbell,
    path: '/rutinas',
    element: <RoutinesScreen />,  
    color: '#f1c40f',
  },
  {
    label: 'Entrenadores',
    icon: faPeopleGroup,
    path: '/entrenadores',
    element: <TrainersScreen />,  
    color: '#e67e22', 
  },
  {
    label: 'Usuarios',
    icon: faUserPlus,
    path: '/usuarios',
    element: <UsersScreen />,  
    color: '#9b59b6',
  },
  {
    label: 'Perfil',
    icon: faUserGear,
    path: '/perfil',
    element: <PerfilScreen />,  
    color: '#34495e', 
  },
];
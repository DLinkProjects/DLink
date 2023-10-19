import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Servers from '@/components/content/servers';
import Container from '@/components/content/container';
import Log from '@/components/content/log';
import Dashboard from '@/components/content/dashboard';
import Key from '@/components/content/key';

const routers = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/servers',
        element: <Servers />,
      },
      {
        path: '/container',
        element: <Container />,
      },
      {
        path: '/log',
        element: <Log />,
      },
      {
        path: '/key',
        element: <Key />,
      },
    ],
  },
]);

export default routers;

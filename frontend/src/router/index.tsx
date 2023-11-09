import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Servers from '@/components/content/servers/servers';
import Container from '@/components/content/container/container';
import Log from '@/components/content/log/log';
import Dashboard from '@/components/content/dashboard/dashboard';
import Key from '@/components/content/key/key';

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

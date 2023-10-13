import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Server from '@/components/content/server';
import Container from '@/components/content/container';
import Log from '@/components/content/log';
import Dashboard from '@/components/content/dashboard';

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
        path: '/server',
        element: <Server />,
      },
      {
        path: '/container',
        element: <Container />,
      },
      {
        path: '/log',
        element: <Log />,
      },
    ],
  },
]);

export default routers;

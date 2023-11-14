import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import routers from '@/router/index.jsx';
import '@/styles/style.css';
import '@/i18n/i18n';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  // <React.StrictMode>
  <RouterProvider router={routers} />,
  // </React.StrictMode>,
);

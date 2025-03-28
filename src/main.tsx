import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoadingProvider } from './contexts/LoadingContext';
import { LoadingOverlay } from './components/LoadingOverlay';
import { routes } from './routes';
import './index.css';

const router = createBrowserRouter(routes, {
  basename: '/',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadingProvider>
      <Suspense fallback={<LoadingOverlay />}>
        <RouterProvider router={router} />
      </Suspense>
    </LoadingProvider>
  </React.StrictMode>
);
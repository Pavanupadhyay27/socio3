import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.routes';
import { LoadingProvider } from './contexts/LoadingContext';
import { WalletProvider } from './contexts/WalletContext';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <WalletProvider>
      <LoadingProvider>
        <RouterProvider router={router} />
      </LoadingProvider>
    </WalletProvider>
  </React.StrictMode>
);
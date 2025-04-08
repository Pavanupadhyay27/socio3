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

const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <WalletProvider>
          <LoadingProvider>
            <RouterProvider router={router} />
          </LoadingProvider>
        </WalletProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Failed to load application</h1>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
};

renderApp();
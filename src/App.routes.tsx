import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import { CreateContent } from './pages/CreateContent';
import Profile from './pages/Profile';
import { EditProfileForm } from './components/EditProfileForm';
import AllPosts from './pages/AllPosts';
import { CredentialPage } from './pages/CredentialPage';
import { Login } from './pages/Login';
import NotFound from './pages/NotFound';

const ErrorBoundary = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
    <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 max-w-md w-full border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <button 
        onClick={() => window.location.href = '/posts'}
        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
      >
        Return to Posts
      </button>
    </div>
  </div>
);

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-white">Loading...</div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CredentialPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/profile',
    element: <Profile />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/profile/edit',
    element: <EditProfileForm />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/posts/*',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <AllPosts />
      },
      {
        path: 'create',
        element: <CreateContent />
      }
    ]
  }
]);

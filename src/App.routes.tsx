import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import { EditProfileForm } from './components/EditProfileForm';
import AllPosts from './pages/AllPosts';

const ErrorBoundary = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
    <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 max-w-md w-full border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a 
        href="/"
        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
      >
        Return Home
      </a>
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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'create',
        element: <CreatePost />
      },
      {
        path: 'create-post',
        element: <CreatePost />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'profile/edit',
        element: <EditProfileForm 
          onClose={() => window.history.back()}
          onSave={(data) => {
            window.history.back();
          }}
        />
      },
      {
        path: 'posts',
        element: <AllPosts />
      }
    ]
  }
], {
  basename: '/' // Explicitly set the base URL
});

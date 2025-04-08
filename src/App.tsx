import React, { useEffect } from 'react';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoadingOverlay } from './components/LoadingOverlay';
import StarBackground from './components/StarBackground';
import { CreatePost } from './pages/CreatePost';
import { CreateContent } from './pages/CreateContent';
import { CredentialPage } from './pages/CredentialPage';
import { createBrowserRouter } from 'react-router-dom';
import { useWallet } from './hooks/useWallet';
import { AllPosts } from './pages/AllPosts';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <StarBackground />
      <LoadingOverlay />
      <Navbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/create',
        element: <CreatePost />
      },
      {
        path: '/create-content',
        element: <CreateContent />
      },
      {
        path: '/credential',
        element: <CredentialPage />
      },
      {
        path: '/posts/all',
        element: (
          <RequireAuth>
            <AllPosts />
          </RequireAuth>
        )
      },
      // ...other routes
    ],
  },
]);

// Helper component to require authentication
function RequireAuth({ children }: { children: JSX.Element }) {
  const { account } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  return account ? children : null;
}

export default App;
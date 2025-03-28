import React from 'react';
import type { RouteObject } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import { ProfileForm } from './components/ProfileForm';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile-setup',
        element: <ProfileForm 
          onClose={() => window.history.back()}
          onSubmit={(data) => {
            localStorage.setItem('userProfile', JSON.stringify(data));
            window.history.back();
          }}
        />
      }
    ]
  }
];
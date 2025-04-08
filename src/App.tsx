import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LoadingOverlay } from './components/LoadingOverlay';
import StarBackground from './components/StarBackground';

const App = () => {
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
};

export default App;
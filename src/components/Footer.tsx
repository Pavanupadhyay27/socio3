import React from 'react';

export function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-white font-medium">Hashdit</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Hashdit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

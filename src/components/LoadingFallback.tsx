import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-white flex items-center gap-2">
      <Loader className="w-5 h-5 animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

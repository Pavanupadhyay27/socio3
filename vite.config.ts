import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  define: {
    // Explicitly make env variables available
    'process.env.VITE_PINATA_JWT': JSON.stringify(process.env.VITE_PINATA_JWT),
    'process.env.VITE_PINATA_GATEWAY': JSON.stringify(process.env.VITE_PINATA_GATEWAY),
    'process.env.VITE_PINATA_API_KEY': JSON.stringify(process.env.VITE_PINATA_API_KEY),
    'process.env.VITE_PINATA_API_SECRET': JSON.stringify(process.env.VITE_PINATA_API_SECRET)
  }
});

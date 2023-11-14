import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ include: '**/*.svg?react' })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@wailsApp': resolve(__dirname, 'wailsjs'),
    },
  },
});

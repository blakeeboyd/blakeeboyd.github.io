import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [
    react(),
    // Serve site-wide assets (css/, js/, images/) from site root in dev
    {
      name: 'serve-site-root',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          // Strip query strings for file lookup
          const urlPath = req.url.split('?')[0];
          // Serve /css/*, /js/*, /images/*, /favicon.svg, /manifest.json from site root
          if (/^\/(css|js|images)\//.test(urlPath) || urlPath === '/favicon.svg' || urlPath === '/manifest.json') {
            const filePath = path.join(siteRoot, urlPath);
            if (fs.existsSync(filePath)) {
              return res.end(fs.readFileSync(filePath));
            }
          }
          next();
        });
      },
    },
  ],
  base: '/projects/modular-daw/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from the site root (for shared CSS/JS)
      allow: [
        siteRoot,
      ],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
});

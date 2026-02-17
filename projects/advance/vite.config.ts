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
    // Inject dev entry point so index.html stays clean for production
    {
      name: 'inject-dev-entry',
      transformIndexHtml(html) {
        return html.replace(
          '</body>',
          '  <script type="module" src="/src/main.tsx"></script>\n</body>',
        );
      },
    },
    // Serve site-wide assets (css/, js/, images/) from site root in dev
    {
      name: 'serve-site-root',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const urlPath = req.url.split('?')[0];
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
  base: '/projects/advance/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
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
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index[extname]',
        inlineDynamicImports: true,
      },
    },
  },
});

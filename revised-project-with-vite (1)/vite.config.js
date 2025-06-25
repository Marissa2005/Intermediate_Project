import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.png', 'robots.txt'],
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.js',
      manifest: {
        id: '/?source=pwa',
        start_url: '/?source=pwa',
        name: 'StoryApp',
        short_name: 'StoryApp',
        description: 'A simple story sharing progressive web app',
        theme_color: '#2196f3',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-48.png', sizes: '48x48', type: 'image/png' },
          { src: 'icons/icon-144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});

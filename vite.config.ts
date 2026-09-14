import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react';

import eslintPlugin from 'vite-plugin-eslint';

import fs from 'fs';

import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const certPath = path.resolve(__dirname, 'certs/cert.pem');
  const keyPath = path.resolve(__dirname, 'certs/key.pem');

  const hasCertificates =
    fs.existsSync(certPath) && fs.existsSync(keyPath);

  return {
    base: '/',
    server: {
      https: hasCertificates
        ? {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
          }
        : undefined,
      port: 3000,
      host: true,
    },

    plugins: [
      react(),
      eslintPlugin({
        failOnError: false,
        failOnWarning: false,
      }),
    ],

    build: {
      outDir: 'build',
    },

    publicDir: 'public',
  };
});
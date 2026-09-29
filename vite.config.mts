import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

import eslintPlugin from 'vite-plugin-eslint';

import fs from 'fs';

import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isTest = process.env.VITEST === 'true';

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
      ...(isTest
        ? []
        : [
            eslintPlugin({
              failOnError: false,
              failOnWarning: false,
            }),
          ]),
    ],

    build: {
      outDir: 'build',
    },

    publicDir: 'public',

    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: true,
      exclude: ['node_modules', 'build', 'e2e'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/**/*.interface.ts'],
      },
    },
  };
});
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente corretamente
  const env = loadEnv(mode, process.cwd(), '');

  const isDev = env.VITE_ENVIROMENT === 'development';

  const certPath = path.resolve(__dirname, 'certs/cert.pem');
  const keyPath = path.resolve(__dirname, 'certs/key.pem');

  return {
    base: '/',
    server: {
      https: isDev
        ? {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
          }
        : undefined,
      port: 3000,
      host: true,
    },
    plugins: [react(), eslintPlugin()],
    build: {
      outDir: 'build',
    },
  };
});

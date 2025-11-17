import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
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
    plugins: [
      react(),
      mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      }),
    ],
    build: {
      outDir: 'build',
    },
  };
});

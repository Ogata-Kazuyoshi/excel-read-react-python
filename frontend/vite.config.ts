import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  server: {
    port: 5180,
    proxy: {
      '/api': {
        target: 'http://localhost:5181',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // Buffer モジュールをブラウザ互換のものに置き換え
      buffer: 'buffer/',
      // global を window にマッピング
      global: 'globalthis',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js のグローバル変数とモジュールをポリフィル
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});

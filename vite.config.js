import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import commonjs from 'vite-plugin-commonjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    commonjs(),
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: true,
              pure: true,
              meaninglessFileNames: ['index', 'styles', 'style'],
              namespace: 'cloud-music',
              minify: false,
              transpileTemplateLiterals: false,
              topLevelImportPaths: [],
              ssr: false,
            },
          ],
        ],
      },
    }),
    svgr(),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://zhulang-music.vercel.app/',
        changeOrigin: true,
      },
    },
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      sourceMap: true,
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
    devSourcemap: true,
  },
});

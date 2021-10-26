import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), viteCommonjs()],
  server: {},
  build: {
    lib: {
      name: 'S2-React',
      entry: './src/index.tsx',
      formats: ['es', 'umd'],
    },
    minify: false,
    rollupOptions: {
      output: {
        format: 'es',
        dir: 'esm',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          '@ant-design/icons': 'icons',
          '@antv/s2': 'S2',
        },
      },
      external: ['react', 'react-dom', /antd/, '@ant-design/icons', '@antv/s2'],
    },
  },
});

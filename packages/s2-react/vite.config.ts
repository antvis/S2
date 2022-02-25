/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { defineConfig, LibraryFormats } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';

const OUT_DIR_NAME_MAP = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const format = process.env.FORMAT as LibraryFormats;
const outDir = OUT_DIR_NAME_MAP[format];
const isUmdFormat = format === 'umd';

const isAnalysisMode = process.env.ANALYSIS;
const isDevMode = process.env.PLAYGROUND;
const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,
  server: {
    port: 3000,
    hmr: true,
  },

  // 打包配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      lodash: 'lodash-es',
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      isDevMode ? 'development' : 'production',
    ),
  },
  plugins: [
    peerDepsExternal(),
    viteCommonjs(),
    react({
      jsxRuntime: 'classic',
    }),
    isAnalysisMode && visualizer({ gzipSize: true }),
  ].filter(Boolean),
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      // 样式小驼峰转化
      // css: goods-list => tsx: goodsList
      localsConvention: 'camelCase',
    },
  },

  build: {
    minify: isUmdFormat ? 'esbuild' : false,
    sourcemap: true,

    lib: {
      name: 'S2-React',
      entry: './src/index.ts',
      formats: [format],
    },
    outDir: outDir,

    rollupOptions: {
      output: {
        entryFileNames: `[name]${isUmdFormat ? '.min' : ''}.js`,
        assetFileNames: `[name]${isUmdFormat ? '.min' : ''}.[ext]`,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@antv/s2': 'S2',
        },
      },
    },
  },
});

/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { defineConfig, type LibraryFormats, type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';
import svgLoader from 'vite-svg-loader';

const OUT_DIR_NAME_MAP: { [key in LibraryFormats]?: string } = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const format = process.env.FORMAT as LibraryFormats;
const outDir = OUT_DIR_NAME_MAP[format] as string;
const isUmdFormat = format === 'umd';

const isAnalysisMode = process.env.ANALYSIS;
const isDevMode = process.env.PLAYGROUND;
const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,

  server: {
    port: 5050,
    hmr: true,
  },

  // 打包配置
  resolve: {
    mainFields: ['src', 'module', 'main'],
    alias: {
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
    !isDevMode && viteCommonjs(),
    vue(),
    svgLoader({
      defaultImport: 'component',
    }),
    vueJsx(),
    isAnalysisMode && visualizer({ gzipSize: true }),
  ].filter(Boolean) as PluginOption[],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  build: {
    target: 'es2015',
    minify: isUmdFormat ? 'esbuild' : false,
    sourcemap: true,
    lib: {
      name: 'S2-Vue',
      entry: './src/index.ts',
      formats: [format],
    },
    outDir,
    rollupOptions: {
      output: {
        entryFileNames: `[name]${isUmdFormat ? '.min' : ''}.js`,
        assetFileNames: `[name]${isUmdFormat ? '.min' : ''}.[ext]`,
        globals: {
          vue: 'Vue',
          '@antv/s2': 'S2',
        },
      },
    },
  },
});

/* eslint-disable prefer-named-capture-group */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line prettier/prettier
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  defineConfig,
  type Alias,
  type LibraryFormats,
  type PluginOption,
} from 'vite';
import svgr from 'vite-plugin-svgr';

const OUT_DIR_NAME_MAP: { [key in LibraryFormats]?: string } = {
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

const alias: Alias[] = [
  {
    find: 'lodash',
    replacement: 'lodash-es',
  },
];

if (isDevMode) {
  // 防止开发模式下直接加载s2-core中的主题less
  alias.push({
    find: /^(.*)\/theme\/(.*)\.less$/,
    replacement: '$1/theme/$2.less?inline',
  });
  alias.push({
    find: /^@antv\/s2$/,
    replacement: path.join(__dirname, '../s2-core/src'),
  });
}

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,
  server: {
    port: 3001,
    hmr: true,
  },

  // 打包配置
  resolve: {
    mainFields: ['src', 'module', 'main'],
    alias,
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      isDevMode ? 'development' : 'production',
    ),
  },

  plugins: [
    peerDepsExternal(),
    !isDevMode && viteCommonjs(),
    react({
      jsxRuntime: 'classic',
    }),
    svgr(),
    isAnalysisMode && visualizer({ gzipSize: true }),
  ].filter(Boolean) as PluginOption[],

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      /*
       * 样式小驼峰转化
       * css: goods-list => tsx: goodsList
       */
      localsConvention: 'camelCase',
    },
  },

  build: {
    target: 'es2015',
    minify: isUmdFormat ? 'esbuild' : false,
    sourcemap: true,
    lib: {
      name: 'S2-React',
      entry: './src/index.ts',
      formats: [format],
    },
    outDir,
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

import path from 'path';
import { defineConfig, LibraryFormats } from 'vite';
import viteImp from 'vite-plugin-imp';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';

const OUT_DIR_NAME_MAP: { [key in LibraryFormats]?: string } = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode, command }) => {
  const format = mode as LibraryFormats;
  const outDir = OUT_DIR_NAME_MAP[format];

  const isUmdFormat = format === 'umd';
  const root = path.join(__dirname, command === 'serve' ? 'playground' : '');

  return {
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
        command === 'serve' ? 'development' : 'production',
      ),
    },
    plugins: [
      peerDepsExternal(),
      viteCommonjs(),
      react(),
      viteImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style/index.less`,
          },
        ],
      }),
      visualizer({ gzipSize: true }),
    ],
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
  };
});

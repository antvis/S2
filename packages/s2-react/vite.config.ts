import path from 'path';
import { defineConfig, LibraryFormats } from 'vite';
import viteImp from 'vite-plugin-imp';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const OUT_DIR_NAME_MAP = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode, command }) => {
  const format = mode as LibraryFormats;
  const isEsmFormat = format === 'es';
  const isUmdFormat = format === 'umd';
  const outDir = OUT_DIR_NAME_MAP[format];

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
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(
        command === 'serve' ? 'development' : 'production',
      ),
    },
    plugins: [
      viteCommonjs(),
      react({
        jsxRuntime: 'classic',
      }),
      // TODO: antd 按需引入还是整个 external?
      viteImp({
        libList: [],
      }),
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
        name: 's2-react',
        entry: './src/index.ts',
        formats: [format],
      },
      outDir: outDir,

      rollupOptions: {
        plugins: [
          peerDepsExternal(),
          // typescript({
          //   abortOnError: true,
          //   tsconfig: 'tsconfig.json',
          //   tsconfigOverride: {
          //     include: ['src'],
          //     exclude: ['__tests__'],
          //     compilerOptions: {
          //       declaration: isEsmFormat,
          //     },
          //   },
          //   typescript: ttypescript,
          // }),
        ],
        output: {
          entryFileNames: '[name].js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            antd: 'antd',
            '@ant-design/icons': 'icons',
            '@antv/s2': 'S2',
          },
        },
      },
    },
  };
});

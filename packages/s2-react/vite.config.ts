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
export default defineConfig(({ mode }) => {
  const format = mode as LibraryFormats;
  const isEsmFormat = format === 'es';
  const outDir = OUT_DIR_NAME_MAP[format];

  return {
    // 开发配置
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
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    plugins: [
      peerDepsExternal(),
      viteCommonjs(),
      react({
        jsxRuntime: 'classic',
      }),
      typescript({
        abortOnError: true,
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          include: ['src'],
          exclude: ['__tests__'],
          compilerOptions: {
            declaration: isEsmFormat,
          },
        },
        typescript: ttypescript,
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
        // 样式小驼峰转化,
        // css: goods-list => tsx: goodsList
        localsConvention: 'camelCase',
      },
    },

    build: {
      minify: 'esbuild',
      sourcemap: true,

      lib: {
        name: 's2-react',
        entry: './src/index.tsx',
        formats: [format],
      },
      outDir: outDir,

      rollupOptions: {
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

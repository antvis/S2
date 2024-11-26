/* eslint-disable max-lines-per-function */
/* eslint-disable import/order */
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { toLower } from 'lodash';
import path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';

export const getBaseConfig = ({
  aliasReact = false,
  aliasReactComponents = false,
} = {}) => {
  const entry = './src/index.ts';

  const OUT_DIR_NAME_MAP = {
    es: 'esm',
    cjs: 'lib',
    umd: 'dist',
  };

  const format = process.env.FORMAT;
  const isAnalysisMode = process.env.ANALYSIS;
  const isDevMode = process.env.PLAYGROUND;
  const outDir = OUT_DIR_NAME_MAP[format];
  const isUMD = format === 'umd';
  const isESM = format === 'es';

  const define = {
    'process.env.NODE_ENV': JSON.stringify(
      isDevMode ? 'development' : 'production',
    ),
  };

  const resolve = {
    mainFields: ['src', 'module', 'main'],
    alias: [],
  };

  if (isDevMode) {
    // 防止开发模式下直接加载 s2-core 中的主题 less
    resolve.alias.push(
      ...[
        {
          find: /^@antv\/s2$/,
          replacement: path.join(__dirname, './packages/s2-core/src'),
        },
        {
          find: /^@antv\/s2\/extends$/,
          replacement: path.join(__dirname, './packages/s2-core/src/extends'),
        },
        aliasReact && {
          find: /^@antv\/s2-react$/,
          replacement: path.join(__dirname, './packages/s2-react/src'),
        },
        aliasReactComponents && {
          find: /^@antv\/s2-react-components$/,
          replacement: path.join(
            __dirname,
            './packages/s2-react-components/src',
          ),
        },
      ].filter(Boolean),
    );
  }

  const getViteConfig = (
    { port, name, libName, plugins } = {
      port: 3001,
      plugins: [],
    },
  ) => {
    const filename = isUMD ? `${toLower(name || libName)}.min` : '[name]';

    return {
      server: {
        port,
        hmr: true,
      },

      resolve,

      define: {
        'process.env.NODE_ENV': JSON.stringify(
          isDevMode ? 'development' : 'production',
        ),
      },

      plugins: [
        peerDepsExternal(),
        !isDevMode && viteCommonjs(),
        isAnalysisMode &&
          visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ...plugins,
      ].filter(Boolean),

      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
          },
        },
        modules: {
          /**
           * 样式小驼峰转化
           * css: goods-list => tsx: goodsList
           */
          localsConvention: 'camelCase',
        },
      },

      build: {
        target: 'es2015',
        minify: isUMD ? 'esbuild' : false,
        sourcemap: true,
        lib: {
          name: libName,
          entry,
          formats: [format],
        },
        outDir,
        rollupOptions: {
          output: {
            dir: outDir,
            entryFileNames: `${filename}.js`,
            assetFileNames: `${filename}.[ext]`,
            globals: {
              vue: 'Vue',
              react: 'React',
              'react-dom': 'ReactDOM',
              '@antv/s2': 'S2',
              '@antv/s2-react': 'S2React',
              lodash: '_',
              antd: 'antd',
              'ant-design-vue': 'antd',
            },
          },
        },
      },
    };
  };

  return {
    entry,
    getViteConfig,
    define,
    format,
    resolve,
    isAnalysisMode,
    outDir,
    OUT_DIR_NAME_MAP,
    isDevMode,
    isUMD,
    isESM,
  };
};

import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { visualizer } from 'rollup-plugin-visualizer';

export const getBaseConfig = () => {
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

  const output = {
    dir: outDir,
    entryFileNames: `[name]${isUMD ? '.min' : ''}.js`,
    assetFileNames: `[name]${isUMD ? '.min' : ''}.[ext]`,
    globals: {
      vue: 'Vue',
      react: 'React',
      'react-dom': 'ReactDOM',
      '@antv/s2': 'S2',
      '@antv/s2-react': 'S2React',
      lodash: '_',
    },
  };

  const resolve = {
    mainFields: ['src', 'module', 'main'],
    alias: [
      {
        find: 'lodash',
        replacement: 'lodash-es',
      },
    ],
  };

  if (isDevMode) {
    // 防止开发模式下直接加载 s2-core 中的主题 less
    resolve.alias.push({
      find: /^(.*)\/theme\/(.*)\.less$/,
      replacement: '$1/theme/$2.less?inline',
    });
  }

  const getViteConfig = (
    { port, libName, plugins } = { port: 3001, plugins: [] },
  ) => {
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
          output,
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
    output,
    OUT_DIR_NAME_MAP,
    isDevMode,
    isUMD,
    isESM,
  };
};

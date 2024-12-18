/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

const format = process.env.FORMAT;
const enableAnalysis = process.env.ANALYSIS;

const OUT_DIR_NAME_MAP = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const outDir = OUT_DIR_NAME_MAP[format];

const isUmdFormat = format === 'umd';

const output = {
  format,
  exports: 'named',
  name: 'S2',
  sourcemap: true,
  dir: outDir,
};

const plugins = [
  peerDepsExternal(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
  commonjs(),
  resolve(),
  typescript({
    abortOnError: true,
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      outDir,
      include: ['src', '../../global.d.ts'],
      compilerOptions: {
        declaration: false,
        useDefineForClassFields: false,
      },
    },
  }),
  postcss({
    exclude: ['**/styles/theme/*.less'],
    minimize: isUmdFormat,
    use: {
      sass: null,
      stylus: null,
      less: { javascriptEnabled: true },
    },
    extract: `s2${isUmdFormat ? '.min' : ''}.css`,
  }),
  /** 主题变量 less 不需要 extract&inject */
  postcss({
    include: ['**/styles/theme/*.less'],
    use: {
      sass: null,
      stylus: null,
      less: { javascriptEnabled: true },
    },
    inject: false,
    extract: false,
  }),
];

if (enableAnalysis) {
  plugins.push(visualizer({ gzipSize: true }));
}

if (isUmdFormat) {
  output.globals = {
    '@antv/s2': 'S2',
  };
  output.entryFileNames = '[name].min.js';
  plugins.push(terser());
}

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: {
      s2: 'src/index.ts',
    },
    output,
    plugins,
  },
  {
    input: {
      's2-extends': 'src/extends/index.ts',
    },
    output: {
      ...output,
      name: 'S2Extends',
    },
    plugins,

    external: ['@antv/s2'],
  },
];

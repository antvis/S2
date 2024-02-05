/* eslint-disable import/no-extraneous-dependencies */
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

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
};

const plugins = [
  peerDepsExternal(),
  alias({
    entries: [
      { find: 'lodash', replacement: 'lodash-es' },
      {
        find: /^(?<name>.*).less\?inline$/,
        replacement: '$1.less',
      },
    ],
  }),
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
      include: ['src'],
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
    extract: `style${isUmdFormat ? '.min' : ''}.css`,
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
  output.file = 'dist/index.min.js';
  plugins.push(terser());
} else {
  output.dir = outDir;
}

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.ts',
  output,
  plugins,
};

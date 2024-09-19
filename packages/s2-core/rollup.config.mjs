/* eslint-disable import/no-extraneous-dependencies */
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';
import { getBaseConfig } from '../../build.config.base.mjs';

const {
  isUMD,
  define,
  resolve: resolveConfig,
  entry,
  output,
  outDir,
  isAnalysisMode,
} = getBaseConfig();

const plugins = [
  peerDepsExternal(),
  alias({
    entries: [
      ...resolveConfig.alias,
      {
        find: /^(?<name>.*).less\?inline$/,
        replacement: '$1.less',
      },
    ],
  }),
  replace({
    ...define,
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
    },
  }),
  postcss({
    exclude: ['**/styles/theme/*.less'],
    minimize: isUMD,
    use: {
      sass: null,
      stylus: null,
      less: { javascriptEnabled: true },
    },
    extract: `style${isUMD ? '.min' : ''}.css`,
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

if (isAnalysisMode) {
  plugins.push(visualizer({ gzipSize: true }));
}

if (isUMD) {
  plugins.push(terser());
}

// eslint-disable-next-line import/no-default-export
export default {
  input: entry,
  output,
  plugins,
};

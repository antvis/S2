import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';
import ttypescript from 'ttypescript';

const format = process.env.FORMAT;
const enableAnalysis = process.env.ANALYSIS;

const OUT_DIR_NAME_MAP = {
  esm: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const outDir = OUT_DIR_NAME_MAP[format];
const isEsmFormat = format === 'esm';

const output = {
  format: format,
  exports: 'named',
  name: 'S2',
  sourcemap: true,
};

const plugins = [
  alias({
    entries: [{ find: 'lodash', replacement: 'lodash-es' }],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
  commonjs(),
  resolve(),
  typescript({
    outDir: outDir,
    abortOnError: true,
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      exclude: ['__tests__'],
      compilerOptions: {
        declaration: isEsmFormat,
      },
    },
    typescript: ttypescript,
  }),
  postcss({
    minimize: true,
    use: {
      sass: null,
      stylus: null,
      less: { javascriptEnabled: true },
    },
    extract: true,
    output: outDir + '/s2.min.css',
  }),
];

if (enableAnalysis) {
  plugins.push(visualizer({ gzipSize: true }));
}

const external = [];

if (format === 'umd') {
  output.file = 'dist/index.min.js';
  plugins.push(terser());
  output.globals = {};
} else {
  external.push(
    'd3-interpolate',
    'lodash',
    'lodash-es',
    '@antv/g-gesture',
    '@antv/g-canvas',
    '@antv/event-emitter',
    'd3-timer',
  );
  output.dir = outDir;
}

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.ts',
  output,
  external,
  plugins,
};

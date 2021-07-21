import typescript from '@rollup/plugin-typescript';
import less from 'rollup-plugin-less';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

const format = process.env.FORMAT;

const OUT_DIR_NAME_MAP = {
  es: 'esm',
  cjs: 'lib',
  umd: 'dist',
};

const outDir = OUT_DIR_NAME_MAP[format];

const output = {
  format: format,
  preserveModules: format === 'es',
  exports: 'named',
  name: 'S2',
  sourcemap: true,
  preserveModulesRoot: 'src',
};

const plugins = [
  commonjs(),
  resolve(),
  typescript({
    outDir: outDir,
  }),
  less({
    output: outDir + '/s2.css',
  }),
];

const external = [
  'moment',
  'react',
  'react-dom',
  'antd/lib/locale/zh_CN',
  '@ant-design/icons',
  'antd',
];

if (format === 'umd') {
  output.file = 'dist/s2.min.js';
  plugins.push(terser());
  output.globals = {
    moment: 'moment',
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    'antd/lib/locale/zh_CN': 'antd.locales.zh_CN',
    '@ant-design/icons': 'icons',
  };
} else {
  external.push(
    'd3-interpolate',
    'lodash',
    '@antv/g-gesture',
    '@antv/g-canvas',
    '@antv/event-emitter',
    '@antv/matrix-util',
    'd3-timer',
    'classnames',
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

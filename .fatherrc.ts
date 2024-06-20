import { defineConfig } from 'father';
import path from 'path';

export default (name: string) => {
  return defineConfig({
    sourcemap: true,
    alias: {
      lodash: 'lodash-es',
      '@antv/s2': path.resolve(__dirname, './packages/s2-core'),
      '@antv/s2-shared': path.resolve(__dirname, './packages/s2-shared'),
      '@/*': 's2-core/src/*',
      'tests/*': 's2-core/__tests__/*',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    esm: {
      output: 'esm',
    },
    cjs: {
      output: 'lib',
    },
    umd: {
      name,
      output: 'dist',
      externals: {
        '@antv/s2': 'S2',
        antd: 'antd',
        react: 'React',
        'react-dom': 'ReactDOM',
        vue: 'Vue',
        'ant-design-vue': 'AntDesignVue',
      },
    },
  });
};

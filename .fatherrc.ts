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
        antd: 'antd',
        react: 'react',
        'react-dom': 'ReactDOM',
      },
      // chainWebpack(memo, { webpack }) {
      //   memo
      //     .plugin('NormalModuleReplacementPlugin')
      //     .use(webpack.NormalModuleReplacementPlugin, [
      //       /^(?<name>.*).less\?inline$/,
      //       (resource) => {
      //         resource.request = resource.request.replace('?inline', '');
      //       },
      //     ])
      //     .end();

      //   return memo;
      // },
    },
  });
};

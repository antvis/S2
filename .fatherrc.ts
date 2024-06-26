import { defineConfig } from 'father';
import path from 'path';

export default (name: string) => {
  const alias = {
    '@antv/s2-shared': path.resolve(process.cwd(), './src/shared'),
  };

  return defineConfig({
    sourcemap: true,
    alias,
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
      alias: {
        '@antv/s2': path.resolve(__dirname, 'packages/s2-core'),
      },
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

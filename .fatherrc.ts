import { defineConfig } from 'father';
import path from 'path';

export default (name: string) => {
  const alias = {
    '@antv/s2-shared': path.relative(process.cwd(), './src/shared'),
  };

  return defineConfig({
    sourcemap: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    esm: {
      output: 'esm',
      alias,
    },
    cjs: {
      output: 'lib',
      alias,
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

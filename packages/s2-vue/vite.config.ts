/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { UserConfig, defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import { getBaseConfig } from '../../build.config.base.mjs';

const { getViteConfig, isDevMode } = getBaseConfig();
const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // 开发配置
  root,

  ...getViteConfig({
    port: 5050,
    name: 's2-vue',
    libName: 'S2Vue',
    plugins: [
      vue(),
      svgLoader({
        defaultImport: 'component',
      }),
      vueJsx(),
    ] as UserConfig['plugins'],
  }),
} as UserConfig);

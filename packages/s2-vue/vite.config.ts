/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { UserConfig, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { getBaseConfig } from '../../build.config.base.mjs';

const { getViteConfig, isDevMode, isUMD, format } = getBaseConfig();
const root = path.join(__dirname, isDevMode ? 'playground' : '');

// eslint-disable-next-line import/no-default-export
export default defineConfig(() => {
  const baseConfig = getViteConfig({
    port: 5050,
    name: 's2-vue',
    libName: 'S2Vue',
    plugins: [
      vue(),
      vueJsx(),
      // Generate .d.ts files for ESM build only
      !isDevMode &&
        !isUMD &&
        format === 'es' &&
        dts({
          outDir: 'esm',
          include: ['src/**/*'],
          exclude: ['**/__tests__/**', '**/playground/**'],
          tsconfigPath: './tsconfig.build.json',
        }),
    ].filter(Boolean) as UserConfig['plugins'],
  });

  // For ESM and CJS builds, use preserveModules to output individual files
  if (!isDevMode && !isUMD) {
    return {
      root,
      ...baseConfig,
      build: {
        ...baseConfig.build,
        rollupOptions: {
          ...baseConfig.build?.rollupOptions,
          // Externalize dependencies to avoid bundling them
          external: ['lodash', /^lodash\/.*/, '@vueuse/core', /^@vueuse\/.*/],
          output: {
            ...baseConfig.build?.rollupOptions?.output,
            preserveModules: true,
            preserveModulesRoot: 'src',
          },
        },
      },
    } as UserConfig;
  }

  // For dev mode and UMD build, use the default config
  return {
    root,
    ...baseConfig,
  } as UserConfig;
});
